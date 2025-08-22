import { NextResponse } from 'next/server';
import { importBankTransactions, matchInstallments } from '@/services/accounting/bank-imports';

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