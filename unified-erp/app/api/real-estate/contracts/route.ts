import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createContractWithPlan } from '@/services/real-estate/contracts';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const where = q ? { OR: [{ notes: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.contract.findMany({ where, skip: (page - 1) * size, take: size, include: { client: true, unit: true }, orderBy: { createdAt: 'desc' } }),
    prisma.contract.count({ where })
  ]);
  return NextResponse.json({ items, total, page, size });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const generate = url.searchParams.get('generate') === 'true';
  const data = await req.json();
  if (generate) {
    const created = await createContractWithPlan({ ...data, startDate: new Date(data.startDate) });
    return NextResponse.json(created);
  }
  const created = await prisma.contract.create({ data });
  return NextResponse.json(created);
}