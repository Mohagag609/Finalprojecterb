import { prisma } from '@/lib/prisma';
import { assert } from '@/lib/utils';
import { InvoiceType, InvoiceStatus } from '@prisma/client';

export async function createAndPostInvoice(input: {
  projectId?: string;
  type: InvoiceType;
  number: string;
  date: Date;
  dueDate?: Date;
  lines: {
    description: string;
    materialId?: string;
    qty: number;
    unitPrice: number;
    accountId: string;
  }[];
  partyId?: string; // clientId or supplierId or contractorId depending on type
  note?: string;
  actorId: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const total = input.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

    const invoice = await tx.invoice.create({
      data: {
        projectId: input.projectId,
        type: input.type,
        number: input.number,
        date: input.date,
        dueDate: input.dueDate,
        total,
        status: 'posted',
        clientId: input.type === 'customer' ? input.partyId : undefined,
        supplierId: input.type === 'supplier' ? input.partyId : undefined,
        contractorId: input.type === 'contractor' ? input.partyId : undefined,
        note: input.note,
        lines: {
          create: input.lines.map((l) => ({
            description: l.description,
            materialId: l.materialId,
            qty: l.qty,
            unitPrice: l.unitPrice,
            accountId: l.accountId
          }))
        }
      },
      include: { lines: true }
    });

    // Journal
    const lines = [] as any[];
    if (input.type === 'customer') {
      const ar = await tx.account.findUnique({ where: { code: '1300' } });
      assert(!!ar, 'AR account missing');
      lines.push({ accountId: ar!.id, debit: total, clientId: invoice.clientId ?? undefined });
      // credit each revenue account by line amounts
      for (const l of invoice.lines) {
        const amount = l.qty.toNumber ? Number(l.qty) * Number(l.unitPrice) : l.qty * l.unitPrice;
        lines.push({ accountId: l.accountId, credit: amount });
      }
    } else {
      const ap = await tx.account.findUnique({ where: { code: '2300' } });
      assert(!!ap, 'AP account missing');
      for (const l of invoice.lines) {
        const amount = l.qty.toNumber ? Number(l.qty) * Number(l.unitPrice) : l.qty * l.unitPrice;
        lines.push({ accountId: l.accountId, debit: amount });
      }
      lines.push({ accountId: ap!.id, credit: total, supplierId: invoice.supplierId ?? undefined, contractorId: invoice.contractorId ?? undefined });
    }

    const entry = await tx.journalEntry.create({
      data: {
        date: input.date,
        description: `Posting invoice ${invoice.number}`,
        projectId: input.projectId,
        posted: true,
        createdBy: input.actorId,
        lines: { create: lines.map((l) => ({ ...l, invoiceId: invoice.id })) }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: 'invoice.post',
        entity: 'Invoice',
        entityId: invoice.id,
        meta: { entryId: entry.id, total } as any
      }
    });

    return { invoice, entry };
  });
}

export async function settleInvoice(input: {
  invoiceId: string;
  amount: number;
  cashboxId: string;
  date: Date;
  actorId: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({ where: { id: input.invoiceId } });
    assert(!!invoice, 'Invoice not found');
    const cashbox = await tx.cashbox.findUnique({ where: { id: input.cashboxId } });
    assert(!!cashbox, 'Cashbox not found');

    const totalSettledAgg = await tx.journalLine.aggregate({
      where: { invoiceId: invoice!.id, cashboxId: cashbox!.id },
      _sum: { debit: true, credit: true }
    });
    const alreadySettled = Number(totalSettledAgg._sum.debit || 0) + Number(totalSettledAgg._sum.credit || 0);

    const remaining = Number(invoice!.total) - alreadySettled;
    assert(input.amount <= remaining, 'Settlement exceeds remaining amount');

    const ar = await tx.account.findUnique({ where: { code: '1300' } });
    const ap = await tx.account.findUnique({ where: { code: '2300' } });
    assert(!!ar && !!ap, 'Core accounts missing');

    const lines: any[] = [];
    if (invoice!.type === 'customer') {
      lines.push({ accountId: cashbox!.accountId, debit: input.amount, cashboxId: cashbox!.id });
      lines.push({ accountId: ar!.id, credit: input.amount, clientId: invoice!.clientId ?? undefined });
    } else {
      lines.push({ accountId: ap!.id, debit: input.amount, supplierId: invoice!.supplierId ?? undefined, contractorId: invoice!.contractorId ?? undefined });
      lines.push({ accountId: cashbox!.accountId, credit: input.amount, cashboxId: cashbox!.id });
    }

    await tx.journalEntry.create({
      data: {
        date: input.date,
        description: `Settlement for invoice ${invoice!.number}`,
        projectId: invoice!.projectId ?? undefined,
        posted: true,
        createdBy: input.actorId,
        lines: { create: lines.map((l) => ({ ...l, invoiceId: invoice!.id })) }
      }
    });

    // update status
    const newRemaining = remaining - input.amount;
    const newStatus: InvoiceStatus = newRemaining > 0 ? 'partial' : 'paid';
    await tx.invoice.update({ where: { id: invoice!.id }, data: { status: newStatus } });

    await tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: 'invoice.settle',
        entity: 'Invoice',
        entityId: invoice!.id,
        meta: { amount: input.amount, remaining: newRemaining } as any
      }
    });

    return { remaining: newRemaining, status: newStatus };
  });
}