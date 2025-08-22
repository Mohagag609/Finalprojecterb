import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const where = q ? { OR: [{ code: { contains: q } }, { name: { contains: q } }, { branch: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.cashbox.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { code: 'asc' } }),
    prisma.cashbox.count({ where })
  ]);
  return NextResponse.json({ items, total, page, size });
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.cashbox.create({ data });
  return NextResponse.json(created);
}