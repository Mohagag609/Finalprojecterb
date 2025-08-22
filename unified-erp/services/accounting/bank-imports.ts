import { prisma } from '@/lib/prisma';

export async function importBankTransactions(input: {
  items: { date: Date; amount: number; type: 'debit' | 'credit'; reference?: string; bankName?: string; description?: string }[];
}) {
  return await prisma.$transaction(async (tx) => {
    const created = await tx.bankImport.createMany({ data: input.items });
    return created;
  });
}

export async function matchInstallments({ toleranceAmount = 5, toleranceDays = 7 }: { toleranceAmount?: number; toleranceDays?: number } = {}) {
  return await prisma.$transaction(async (tx) => {
    const credits = await tx.bankImport.findMany({ where: { type: 'credit', posted: false } });
    let matched = 0;
    for (const tr of credits) {
      const dueFrom = new Date(tr.date);
      dueFrom.setDate(dueFrom.getDate() - toleranceDays);
      const dueTo = new Date(tr.date);
      dueTo.setDate(dueTo.getDate() + toleranceDays);

      const inst = await tx.installment.findFirst({
        where: {
          status: 'PENDING',
          amount: { gte: tr.amount - toleranceAmount, lte: tr.amount + toleranceAmount },
          dueDate: { gte: dueFrom, lte: dueTo }
        }
      });
      if (inst) {
        await tx.installment.update({ where: { id: inst.id }, data: { status: 'PAID', paidAt: new Date(), matchedBankImportId: tr.id } });
        await tx.bankImport.update({ where: { id: tr.id }, data: { posted: true, matchedInstallmentId: inst.id } });
        matched++;
      }
    }
    return { matched };
  });
}