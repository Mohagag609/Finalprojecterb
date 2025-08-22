import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = (url.searchParams.get('type') || 'AR').toUpperCase(); // AR or AP
  const now = new Date();
  const buckets = [0, 30, 60, 90];

  const ar = await prisma.account.findUnique({ where: { code: '1300' } });
  const ap = await prisma.account.findUnique({ where: { code: '2300' } });

  const invoices = await prisma.invoice.findMany({ where: { type: kind === 'AR' ? 'customer' : { in: ['supplier', 'contractor'] } as any } as any });

  const results: any[] = [];
  for (const inv of invoices) {
    const lines = await prisma.journalLine.aggregate({
      where: { invoiceId: inv.id, accountId: kind === 'AR' ? ar?.id : ap?.id },
      _sum: { debit: true, credit: true }
    });
    const settled = Math.abs(Number(lines._sum.debit || 0) - Number(lines._sum.credit || 0));
    const outstanding = Number(inv.total) - settled;
    if (outstanding <= 0) continue;
    const days = Math.floor((now.getTime() - new Date(inv.dueDate ?? inv.date).getTime()) / (1000 * 3600 * 24));
    let bucket = `>${buckets[buckets.length - 1]}`;
    for (const b of buckets) {
      if (days <= b) { bucket = `${b}`; break; }
    }
    results.push({ invoiceId: inv.id, number: inv.number, partyId: inv.clientId || inv.supplierId || inv.contractorId, days, bucket, outstanding });
  }

  return NextResponse.json({ type: kind, items: results });
}