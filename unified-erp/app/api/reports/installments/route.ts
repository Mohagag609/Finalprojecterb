import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPdf, baseStyles, reportHeader } from '@/lib/pdf';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const ym = url.searchParams.get('ym'); // YYYY-MM
  const [y, m] = ym ? ym.split('-').map((x) => parseInt(x)) : [new Date().getFullYear(), new Date().getMonth() + 1];
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 0, 23, 59, 59);

  const items = await prisma.installment.findMany({
    where: { dueDate: { gte: from, lte: to } },
    include: { contract: { include: { client: true, unit: true } } }
  });

  const body = [
    [{ text: 'العميل', style: 'tableHeader' }, { text: 'الوحدة', style: 'tableHeader' }, { text: 'المبلغ', style: 'tableHeader' }, { text: 'تاريخ الاستحقاق', style: 'tableHeader' }],
    ...items.map((it) => [it.contract.client.name, it.contract.unit.code, Number(it.amount).toFixed(2), new Date(it.dueDate).toLocaleDateString('ar-EG')])
  ];

  const doc = {
    content: [reportHeader('تقرير الأقساط الشهرية'), { table: { headerRows: 1, body } }],
    styles: baseStyles,
    defaultStyle: { fontSize: 10 }
  } as any;
  const buf = await buildPdf(doc);
  return new NextResponse(buf, { headers: { 'Content-Type': 'application/pdf' } });
}