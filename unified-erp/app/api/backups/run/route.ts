import { NextResponse } from 'next/server';
import { ensureDailyBackup, runDailyBackup } from '@/lib/backup';

export async function GET() {
  const backup = await ensureDailyBackup();
  return NextResponse.json(backup);
}

export async function POST() {
  const backup = await runDailyBackup();
  return NextResponse.json(backup);
}