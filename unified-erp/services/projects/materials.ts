import { prisma } from '@/lib/prisma';

export async function listMaterials(q = '', page = 1, size = 10) {
  const where = q ? { OR: [{ name: { contains: q } }, { unit: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.material.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { name: 'asc' } }),
    prisma.material.count({ where })
  ]);
  return { items, total, page, size };
}

export async function createMaterial(data: any) {
  return prisma.material.create({ data });
}