import { NextResponse } from 'next/server';
import { restoreFromBackup } from '@/lib/backup';

export async function POST(req: Request) {
  const { idOrPath } = await req.json();
  const ok = await restoreFromBackup(idOrPath);
  return NextResponse.json({ ok });
}