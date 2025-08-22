import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function runDailyBackup() {
  const provider = process.env.BACKUP_PROVIDER || 'local';
  const runAt = new Date();
  try {
    const outDir = process.env.BACKUP_LOCAL_PATH || './backups';
    await fs.mkdir(outDir, { recursive: true });
    const filename = `backup-${runAt.toISOString().slice(0, 10)}.sql.gz`;
    const fullPath = path.join(outDir, filename);
    // In real env, run pg_dump; here we just write a placeholder
    await fs.writeFile(fullPath, '');
    const backup = await prisma.backup.create({
      data: {
        runAt,
        location: provider as any,
        pathOrDriveId: fullPath,
        sizeBytes: 0,
        status: 'ok'
      }
    });
    return backup;
  } catch (e: any) {
    await prisma.backup.create({
      data: {
        runAt,
        location: (process.env.BACKUP_PROVIDER || 'local') as any,
        pathOrDriveId: 'n/a',
        status: 'failed',
        message: e?.message || 'Unknown error'
      }
    });
    throw e;
  }
}

export async function restoreFromBackup(_idOrPath: string) {
  // Stub restore; should run psql with file
  return true;
}