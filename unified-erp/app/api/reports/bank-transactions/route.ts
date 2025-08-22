import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildExcel } from '@/lib/excel';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fromStr = url.searchParams.get('from');
  const toStr = url.searchParams.get('to');
  const from = fromStr ? new Date(fromStr) : new Date(0);
  const to = toStr ? new Date(toStr) : new Date();

  const items = await prisma.bankImport.findMany({
    where: { date: { gte: from, lte: to } },
    orderBy: { date: 'asc' }
  });

  const headers = ['التاريخ', 'المبلغ', 'النوع', 'مرجع', 'البنك', 'الوصف', 'مرحل'];
  const rows = items.map((b) => [
    new Date(b.date),
    Number(b.amount),
    b.type,
    b.reference || '',
    b.bankName || '',
    b.description || '',
    b.posted ? 'نعم' : 'لا'
  ]);

  const buf = await buildExcel({ sheetName: 'BankTx', headers, rows });
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
}