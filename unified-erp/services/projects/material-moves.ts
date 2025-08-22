import { prisma } from '@/lib/prisma';

export async function listMaterialMoves(projectId: string, page = 1, size = 10) {
  const where = { projectId };
  const [items, total] = await Promise.all([
    prisma.materialMove.findMany({ where, skip: (page - 1) * size, take: size, include: { material: true, phase: true }, orderBy: { date: 'desc' } }),
    prisma.materialMove.count({ where })
  ]);
  return { items, total, page, size };
}

export async function createMaterialMove(data: any) {
  return prisma.materialMove.create({ data });
}