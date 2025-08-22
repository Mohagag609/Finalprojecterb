import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createVoucher } from '@/services/accounting/vouchers';
import { auth } from '@/lib/auth';

const schema = z.object({
  kind: z.enum(['receipt', 'payment']),
  date: z.string(),
  cashboxId: z.string(),
  projectId: z.string().optional(),
  amount: z.number(),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  contractorId: z.string().optional(),
  partnerId: z.string().optional(),
  note: z.string().optional()
});

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const parsed = schema.parse(body);
  const res = await createVoucher({
    ...parsed,
    date: new Date(parsed.date),
    actorId: (session?.user as any)?.id || 'system'
  });
  return NextResponse.json(res);
}