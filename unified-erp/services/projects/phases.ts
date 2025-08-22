import { prisma } from '@/lib/prisma';

export async function listPhases(projectId: string, page = 1, size = 10) {
  const where = { projectId };
  const [items, total] = await Promise.all([
    prisma.phase.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { name: 'asc' } }),
    prisma.phase.count({ where })
  ]);
  return { items, total, page, size };
}

export async function createPhase(data: any) {
  return prisma.phase.create({ data });
}