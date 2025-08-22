import { prisma } from '@/lib/prisma';
import { assert } from '@/lib/utils';

export type SettlementPlan = { fromPartnerId: string; toPartnerId: string; amount: number }[];

export function buildSettlementPlan(contributions: { partnerId: string; amount: number }[]): SettlementPlan {
  const n = contributions.length;
  const total = contributions.reduce((s, c) => s + c.amount, 0);
  const avg = total / n;
  const due = contributions.map((c) => ({ partnerId: c.partnerId, due: c.amount - avg }));
  const payers = [...due].filter((d) => d.due < 0).map((d) => ({ ...d, due: Math.abs(d.due) }));
  const receivers = [...due].filter((d) => d.due > 0);
  const plan: SettlementPlan = [];
  let i = 0,
    j = 0;
  while (i < payers.length && j < receivers.length) {
    const pay = payers[i];
    const rec = receivers[j];
    const amt = Math.min(pay.due, rec.due);
    if (amt > 0) {
      plan.push({ fromPartnerId: pay.partnerId, toPartnerId: rec.partnerId, amount: Math.round(amt * 100) / 100 });
      pay.due -= amt;
      rec.due -= amt;
    }
    if (pay.due <= 0.0001) i++;
    if (rec.due <= 0.0001) j++;
  }
  return plan;
}

export async function settleProjectPartners(projectId: string, actorId: string) {
  return await prisma.$transaction(async (tx) => {
    const partners = await tx.projectPartner.findMany({ where: { projectId }, include: { partner: true } });
    assert(partners.length > 1, 'Need at least two partners');
    // For MVP: use previousCarry as contribution proxy
    const contributions = partners.map((pp) => ({ partnerId: pp.partnerId, amount: Number(pp.previousCarry) }));
    const plan = buildSettlementPlan(contributions);

    if (plan.length === 0) return { plan, entryId: null };

    const walletMap = new Map(partners.map((pp) => [pp.partnerId, pp.walletAccountId] as const));

    const lines = plan.flatMap((p) => [
      { accountId: walletMap.get(p.toPartnerId)!, debit: p.amount, partnerId: p.toPartnerId },
      { accountId: walletMap.get(p.fromPartnerId)!, credit: p.amount, partnerId: p.fromPartnerId }
    ]);

    const entry = await tx.journalEntry.create({
      data: {
        date: new Date(),
        description: `Partner settlement for project ${projectId}`,
        projectId,
        posted: true,
        createdBy: actorId,
        lines: { create: lines }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: actorId,
        action: 'partner.settlement',
        entity: 'Project',
        entityId: projectId,
        meta: { plan } as any
      }
    });

    // Reset previousCarry to zero for new cycle
    for (const pp of partners) {
      await tx.projectPartner.update({ where: { id: pp.id }, data: { previousCarry: 0 } });
    }

    return { plan, entryId: entry.id };
  });
}