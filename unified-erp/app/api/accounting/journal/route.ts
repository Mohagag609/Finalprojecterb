import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createJournalEntry, reverseJournalEntry } from '@/services/accounting/journal';
import { auth } from '@/lib/auth';

const postSchema = z.object({
  date: z.string(),
  ref: z.string().optional(),
  description: z.string().optional(),
  projectId: z.string().optional(),
  lines: z.array(
    z.object({
      accountId: z.string(),
      debit: z.number().optional(),
      credit: z.number().optional(),
      projectId: z.string().optional(),
      cashboxId: z.string().optional(),
      clientId: z.string().optional(),
      supplierId: z.string().optional(),
      contractorId: z.string().optional(),
      partnerId: z.string().optional(),
      invoiceId: z.string().optional(),
      phaseId: z.string().optional(),
      materialId: z.string().optional()
    })
  )
});

const reversalSchema = z.object({ entryId: z.string() });

export async function POST(req: Request) {
  const session = await auth();
  const url = new URL(req.url);
  const action = url.searchParams.get('action') || 'post';
  const body = await req.json();

  if (action === 'reverse') {
    const parsed = reversalSchema.parse(body);
    const res = await reverseJournalEntry(parsed.entryId, (session?.user as any)?.id || 'system');
    return NextResponse.json(res);
  }

  const parsed = postSchema.parse(body);
  const res = await createJournalEntry({ ...parsed, date: new Date(parsed.date), createdBy: (session?.user as any)?.id || 'system' });
  return NextResponse.json(res);
}