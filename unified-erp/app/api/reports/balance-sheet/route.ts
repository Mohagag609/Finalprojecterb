import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const asOfStr = url.searchParams.get('asOf');
  const asOf = asOfStr ? new Date(asOfStr) : new Date();

  const lines = await prisma.journalLine.findMany({ where: { entry: { date: { lte: asOf } } }, include: { account: true } });
  const balances = new Map<string, number>();
  for (const l of lines) {
    const key = l.accountId;
    const sign = l.account.type === 'liability' || l.account.type === 'equity' || l.account.type === 'revenue' ? -1 : 1;
    const val = (Number(l.debit) - Number(l.credit)) * sign;
    balances.set(key, (balances.get(key) || 0) + val);
  }
  const accounts = await prisma.account.findMany();
  const grouped: { asset: number; liability: number; equity: number } = { asset: 0, liability: 0, equity: 0 };
  for (const acc of accounts) {
    const bal = balances.get(acc.id) ?? 0;
    switch (acc.type) {
      case 'asset':
        grouped.asset += bal;
        break;
      case 'liability':
        grouped.liability += bal;
        break;
      case 'equity':
        grouped.equity += bal;
        break;
      default:
        break;
    }
  }
  return NextResponse.json({ ...grouped, assetsEqualsLiabilitiesPlusEquity: Math.abs(grouped.asset - (grouped.liability + grouped.equity)) < 0.01 });
}