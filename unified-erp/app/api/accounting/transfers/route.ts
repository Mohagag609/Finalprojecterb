import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createTransfer } from '@/services/accounting/transfers';
import { auth } from '@/lib/auth';

const schema = z.object({
  fromCashboxId: z.string(),
  toCashboxId: z.string(),
  date: z.string(),
  amount: z.number(),
  note: z.string().optional()
});

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