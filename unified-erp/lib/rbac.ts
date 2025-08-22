import { Role } from '@prisma/client';

export function requireRole(userRole: Role | undefined, allowed: Role[]) {
  if (!userRole) throw new Error('Unauthorized');
  if (!allowed.includes(userRole)) throw new Error('Forbidden');
}