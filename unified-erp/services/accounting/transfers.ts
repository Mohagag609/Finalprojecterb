import { prisma } from '@/lib/prisma';
import { assert } from '@/lib/utils';

export async function createTransfer(input: {
  fromCashboxId: string;
  toCashboxId: string;
  date: Date;
  amount: number;
  note?: string;
  actorId: string;
}) {
  assert(input.fromCashboxId !== input.toCashboxId, 'Transfer between the same cashbox is not allowed');
  return await prisma.$transaction(async (tx) => {
    const from = await tx.cashbox.findUnique({ where: { id: input.fromCashboxId } });
    const to = await tx.cashbox.findUnique({ where: { id: input.toCashboxId } });
    assert(!!from && !!to, 'Cashboxes not found');

    const transfer = await tx.transfer.create({
      data: {
        fromCashboxId: input.fromCashboxId,
        toCashboxId: input.toCashboxId,
        date: input.date,
        amount: input.amount,
        note: input.note
      }
    });

    const entry = await tx.journalEntry.create({
      data: {
        date: input.date,
        description: input.note,
        posted: true,
        createdBy: input.actorId,
        lines: {
          create: [
            { accountId: to!.accountId, debit: input.amount, cashboxId: to!.id },
            { accountId: from!.accountId, credit: input.amount, cashboxId: from!.id }
          ]
        }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: 'transfer.create',
        entity: 'Transfer',
        entityId: transfer.id,
        meta: { entryId: entry.id, amount: input.amount } as any
      }
    });

    return { transfer, entry };
  });
}