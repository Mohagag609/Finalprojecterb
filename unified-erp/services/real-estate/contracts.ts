import { prisma } from '@/lib/prisma';
import { PlanType } from '@prisma/client';

export async function createContractWithPlan(input: {
  clientId: string;
  unitId: string;
  startDate: Date;
  totalAmount: number;
  downPayment: number;
  months: number;
  planType: PlanType;
  notes?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const contract = await tx.contract.create({
      data: {
        clientId: input.clientId,
        unitId: input.unitId,
        startDate: input.startDate,
        totalAmount: input.totalAmount,
        downPayment: input.downPayment,
        months: input.months,
        planType: input.planType,
        notes: input.notes
      }
    });

    const base = (input.totalAmount - input.downPayment) / input.months;
    for (let i = 0; i < input.months; i++) {
      const due = new Date(input.startDate);
      if (input.planType === 'MONTHLY') due.setMonth(due.getMonth() + i + 1);
      if (input.planType === 'QUARTERLY') due.setMonth(due.getMonth() + (i + 1) * 3);
      if (input.planType === 'YEARLY') due.setFullYear(due.getFullYear() + i + 1);
      await tx.installment.create({ data: { contractId: contract.id, amount: Math.round(base * 100) / 100, dueDate: due } });
    }

    return contract;
  });
}