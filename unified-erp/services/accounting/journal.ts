import { prisma } from '@/lib/prisma';
import { ensureBalanced, assert } from '@/lib/utils';
import Decimal from 'decimal.js-light';

export type JournalLineInput = {
  accountId: string;
  debit?: number | string;
  credit?: number | string;
  projectId?: string;
  cashboxId?: string;
  clientId?: string;
  supplierId?: string;
  contractorId?: string;
  partnerId?: string;
  invoiceId?: string;
  phaseId?: string;
  materialId?: string;
};

export async function createJournalEntry(input: {
  date: Date;
  ref?: string;
  description?: string;
  projectId?: string;
  createdBy: string;
  lines: JournalLineInput[];
}) {
  const debits = input.lines.map((l) => new Decimal(l.debit || 0));
  const credits = input.lines.map((l) => new Decimal(l.credit || 0));

  // Validate line constraints
  input.lines.forEach((l, idx) => {
    const d = new Decimal(l.debit || 0);
    const c = new Decimal(l.credit || 0);
    assert(!(d.gt(0) && c.gt(0)), `Line ${idx + 1}: debit and credit both > 0`);
    assert(d.gte(0) && c.gte(0), `Line ${idx + 1}: negative amounts not allowed`);
  });

  ensureBalanced(debits, credits);

  return await prisma.$transaction(async (tx) => {
    const entry = await tx.journalEntry.create({
      data: {
        date: input.date,
        ref: input.ref,
        description: input.description,
        projectId: input.projectId,
        posted: true,
        createdBy: input.createdBy,
        lines: {
          create: input.lines.map((l) => ({
            accountId: l.accountId,
            debit: new Decimal(l.debit || 0).toNumber(),
            credit: new Decimal(l.credit || 0).toNumber(),
            projectId: l.projectId,
            cashboxId: l.cashboxId,
            clientId: l.clientId,
            supplierId: l.supplierId,
            contractorId: l.contractorId,
            partnerId: l.partnerId,
            invoiceId: l.invoiceId,
            phaseId: l.phaseId,
            materialId: l.materialId
          }))
        }
      },
      include: { lines: true }
    });

    await tx.auditLog.create({
      data: {
        actorId: input.createdBy,
        action: 'journal.post',
        entity: 'JournalEntry',
        entityId: entry.id,
        meta: entry as any
      }
    });

    return entry;
  });
}

export async function reverseJournalEntry(entryId: string, actorId: string) {
  return await prisma.$transaction(async (tx) => {
    const original = await tx.journalEntry.findUnique({
      where: { id: entryId },
      include: { lines: true }
    });
    assert(!!original, 'Original entry not found');

    const reversed = await tx.journalEntry.create({
      data: {
        date: new Date(),
        ref: `REV-${original!.id}`,
        description: `Reversal of ${original!.id}`,
        projectId: original!.projectId ?? undefined,
        posted: true,
        reversedEntryId: original!.id,
        createdBy: actorId,
        lines: {
          create: original!.lines.map((l) => ({
            accountId: l.accountId,
            debit: new Decimal(l.credit).toNumber(),
            credit: new Decimal(l.debit).toNumber(),
            projectId: l.projectId ?? undefined,
            cashboxId: l.cashboxId ?? undefined,
            clientId: l.clientId ?? undefined,
            supplierId: l.supplierId ?? undefined,
            contractorId: l.contractorId ?? undefined,
            partnerId: l.partnerId ?? undefined,
            invoiceId: l.invoiceId ?? undefined,
            phaseId: l.phaseId ?? undefined,
            materialId: l.materialId ?? undefined
          }))
        }
      },
      include: { lines: true }
    });

    await tx.auditLog.create({
      data: {
        actorId,
        action: 'journal.reverse',
        entity: 'JournalEntry',
        entityId: reversed.id,
        meta: { originalId: original!.id } as any
      }
    });
    return reversed;
  });
}