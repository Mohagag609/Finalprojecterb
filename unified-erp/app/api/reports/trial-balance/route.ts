import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const from = fromStr ? new Date(fromStr) : new Date(0);
  const to = toStr ? new Date(toStr) : new Date();

  const lines = await prisma.journalLine.findMany({
    where: { entry: { date: { gte: from, lte: to } } },
    include: { account: true }
  });

  const map = new Map<string, { code: string; name: string; debit: number; credit: number }>();
  for (const l of lines) {
    const key = l.accountId;
    const item = map.get(key) || { code: l.account.code, name: l.account.name, debit: 0, credit: 0 } as any;
    item.debit += Number(l.debit);
    item.credit += Number(l.credit);
    map.set(key, item);
  }

  const items = Array.from(map.values());
  const totalDebit = items.reduce((s, i) => s + i.debit, 0);
  const totalCredit = items.reduce((s, i) => s + i.credit, 0);

  return NextResponse.json({ items, totalDebit, totalCredit });
}