import { prisma } from '@/lib/prisma';
import { assert } from '@/lib/utils';
import { AccountType } from '@prisma/client';

export async function createVoucher(input: {
  kind: 'receipt' | 'payment';
  date: Date;
  cashboxId: string;
  projectId?: string;
  amount: number;
  clientId?: string;
  supplierId?: string;
  contractorId?: string;
  partnerId?: string;
  note?: string;
  actorId: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const cashbox = await tx.cashbox.findUnique({ include: { account: true }, where: { id: input.cashboxId } });
    assert(!!cashbox, 'Cashbox not found');

    const ar = await tx.account.findUnique({ where: { code: '1300' } });
    const ap = await tx.account.findUnique({ where: { code: '2300' } });
    const revenue = await tx.account.findUnique({ where: { code: '4000' } });
    const expense = await tx.account.findUnique({ where: { code: '5000' } });
    assert(!!ar && !!ap && !!revenue && !!expense, 'Core accounts missing');

    const voucher = await tx.voucher.create({
      data: {
        kind: input.kind,
        date: input.date,
        cashboxId: input.cashboxId,
        projectId: input.projectId,
        amount: input.amount,
        clientId: input.clientId,
        supplierId: input.supplierId,
        contractorId: input.contractorId,
        partnerId: input.partnerId,
        note: input.note
      }
    });

    const cashAccId = cashbox!.accountId;

    const lines = [] as {
      accountId: string;
      debit?: number;
      credit?: number;
      cashboxId?: string;
      clientId?: string;
      supplierId?: string;
      contractorId?: string;
      partnerId?: string;
    }[];

    if (input.kind === 'receipt') {
      lines.push({ accountId: cashAccId, debit: input.amount, cashboxId: cashbox!.id });
      if (input.clientId) {
        lines.push({ accountId: ar!.id, credit: input.amount, clientId: input.clientId });
      } else if (input.partnerId) {
        // partner wallet account via ProjectPartner
        const projPartner = await tx.projectPartner.findFirst({ where: { projectId: input.projectId!, partnerId: input.partnerId } });
        assert(!!projPartner, 'Partner wallet not found');
        lines.push({ accountId: projPartner!.walletAccountId, credit: input.amount, partnerId: input.partnerId });
      } else {
        lines.push({ accountId: revenue!.id, credit: input.amount });
      }
    } else {
      // payment
      if (input.supplierId || input.contractorId) {
        lines.push({ accountId: ap!.id, debit: input.amount, supplierId: input.supplierId, contractorId: input.contractorId });
      } else if (input.partnerId) {
        const projPartner = await tx.projectPartner.findFirst({ where: { projectId: input.projectId!, partnerId: input.partnerId } });
        assert(!!projPartner, 'Partner wallet not found');
        lines.push({ accountId: projPartner!.walletAccountId, debit: input.amount, partnerId: input.partnerId });
      } else {
        lines.push({ accountId: expense!.id, debit: input.amount });
      }
      lines.push({ accountId: cashAccId, credit: input.amount, cashboxId: cashbox!.id });
    }

    const entry = await tx.journalEntry.create({
      data: {
        date: input.date,
        description: input.note,
        projectId: input.projectId,
        posted: true,
        createdBy: input.actorId,
        lines: { create: lines }
      },
      include: { lines: true }
    });

    await tx.auditLog.create({
      data: {
        actorId: input.actorId,
        action: `voucher.${input.kind}`,
        entity: 'Voucher',
        entityId: voucher.id,
        meta: { entryId: entry.id, amount: input.amount } as any
      }
    });

    return { voucher, entry };
  });
}