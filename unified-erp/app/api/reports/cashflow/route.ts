import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const from = fromStr ? new Date(fromStr) : new Date(0);
  const to = toStr ? new Date(toStr) : new Date();

  const cashAccounts = await prisma.cashbox.findMany({ select: { accountId: true } });
  const accountIds = cashAccounts.map((c) => c.accountId);

  const lines = await prisma.journalLine.findMany({ where: { accountId: { in: accountIds }, entry: { date: { gte: from, lte: to } } } });
  const inflow = lines.reduce((s, l) => s + Number(l.debit), 0);
  const outflow = lines.reduce((s, l) => s + Number(l.credit), 0);
  const net = inflow - outflow;
  return NextResponse.json({ inflow, outflow, net });
}