import { NextResponse } from 'next/server';
import { importBankTransactions, matchInstallments } from '@/services/accounting/bank-imports';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '10');
    const [items, total] = await Promise.all([
      prisma.bankImport.findMany({ skip: (page - 1) * size, take: size, orderBy: { date: 'desc' } }),
      prisma.bankImport.count()
    ]);
    return NextResponse.json({ items, total, page, size });
  } catch (e: any) {
    return NextResponse.json({ error: 'Database unavailable', details: e?.message }, { status: 503 });
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'import';
  const body = await req.json();
  if (action === 'match') {
    const res = await matchInstallments(body || {});
    return NextResponse.json(res);
  }
  const res = await importBankTransactions({ items: body.items || [] });
  return NextResponse.json(res);
}