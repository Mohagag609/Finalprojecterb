import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status') || undefined;
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const where: any = {};
  if (status) where.status = status as any;
  const [items, total] = await Promise.all([
    prisma.installment.findMany({ where, skip: (page - 1) * size, take: size, include: { contract: { include: { client: true, unit: true } } }, orderBy: { dueDate: 'asc' } }),
    prisma.installment.count({ where })
  ]);
  return NextResponse.json({ items, total, page, size });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const updated = await prisma.installment.update({ where: { id: body.id }, data: { status: body.status, paidAt: body.paidAt ? new Date(body.paidAt) : null } });
  return NextResponse.json(updated);
}