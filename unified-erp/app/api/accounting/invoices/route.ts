import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAndPostInvoice, settleInvoice } from '@/services/accounting/invoices';
import { auth } from '@/lib/auth';

const postSchema = z.object({
  projectId: z.string().optional(),
  type: z.enum(['customer', 'supplier', 'contractor']),
  number: z.string(),
  date: z.string(),
  dueDate: z.string().optional(),
  lines: z.array(z.object({ description: z.string(), materialId: z.string().optional(), qty: z.number(), unitPrice: z.number(), accountId: z.string() })),
  partyId: z.string().optional(),
  note: z.string().optional()
});

const settleSchema = z.object({ invoiceId: z.string(), amount: z.number(), cashboxId: z.string(), date: z.string() });

export async function POST(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'post';
  const body = await req.json();

  if (action === 'settle') {
    const parsed = settleSchema.parse(body);
    const res = await settleInvoice({ ...parsed, date: new Date(parsed.date), actorId: (session?.user as any)?.id || 'system' });
    return NextResponse.json(res);
  }

  const parsed = postSchema.parse(body);
  const res = await createAndPostInvoice({
    ...parsed,
    date: new Date(parsed.date),
    dueDate: parsed.dueDate ? new Date(parsed.dueDate) : undefined,
    actorId: (session?.user as any)?.id || 'system'
  });
  return NextResponse.json(res);
}