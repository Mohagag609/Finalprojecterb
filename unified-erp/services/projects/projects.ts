import { prisma } from '@/lib/prisma';

export async function listProjects(params: { q?: string; page?: number; size?: number } = {}) {
  const { q = '', page = 1, size = 10 } = params;
  const where = q ? { OR: [{ code: { contains: q } }, { name: { contains: q } }] } : {};
  const [items, total] = await Promise.all([
    prisma.project.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { code: 'asc' } }),
    prisma.project.count({ where })
  ]);
  return { items, total, page, size };
}

export async function createProject(data: any) {
  return prisma.project.create({ data });
}