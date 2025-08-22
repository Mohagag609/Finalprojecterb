import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const [items, total] = await Promise.all([
    prisma.return.findMany({ skip: (page - 1) * size, take: size, include: { unit: true, partner: true }, orderBy: { createdAt: 'desc' } }),
    prisma.return.count()
  ]);
  return NextResponse.json({ items, total, page, size });
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.return.create({ data });
  return NextResponse.json(created);
}