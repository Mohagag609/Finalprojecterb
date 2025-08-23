import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createVoucher } from '@/services/accounting/vouchers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '10');
    const where = q ? { OR: [{ note: { contains: q } }, { kind: { contains: q as any } }] } : {};
    const [items, total] = await Promise.all([
      prisma.voucher.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { date: 'desc' } }),
      prisma.voucher.count({ where })
    ]);
    return NextResponse.json({ items, total, page, size });
  } catch (e: any) {
    return NextResponse.json({ error: 'Database unavailable', details: e?.message }, { status: 503 });
  }
}

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