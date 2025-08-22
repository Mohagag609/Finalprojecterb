import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get('projectId');
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const from = fromStr ? new Date(fromStr) : new Date(0);
  const to = toStr ? new Date(toStr) : new Date();

  const lines = await prisma.journalLine.findMany({
    where: { projectId: projectId || undefined, entry: { date: { gte: from, lte: to } } },
    include: { account: true }
  });

  let revenue = 0, expense = 0;
  for (const l of lines) {
    if (l.account.type === 'revenue') revenue += Number(l.credit) - Number(l.debit);
    if (l.account.type === 'expense') expense += Number(l.debit) - Number(l.credit);
  }
  const pnl = revenue - expense;
  return NextResponse.json({ revenue, expense, pnl });
}