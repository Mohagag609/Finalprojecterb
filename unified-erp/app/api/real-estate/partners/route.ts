import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const where = q ? { OR: [{ name: { contains: q } }, { phone: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.partner.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { name: 'asc' } }),
    prisma.partner.count({ where })
  ]);
  return NextResponse.json({ items, total, page, size });
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.partner.create({ data });
  return NextResponse.json(created);
}