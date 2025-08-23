import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createTransfer } from '@/services/accounting/transfers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  fromCashboxId: z.string(),
  toCashboxId: z.string(),
  date: z.string(),
  amount: z.number(),
  note: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '10');
    const [items, total] = await Promise.all([
      prisma.transfer.findMany({ skip: (page - 1) * size, take: size, orderBy: { date: 'desc' } }),
      prisma.transfer.count()
    ]);
    return NextResponse.json({ items, total, page, size });
  } catch (e: any) {
    return NextResponse.json({ error: 'Database unavailable', details: e?.message }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const parsed = schema.parse(body);
  const res = await createTransfer({
    ...parsed,
    date: new Date(parsed.date),
    actorId: (session?.user as any)?.id || 'system'
  });
  return NextResponse.json(res);
}