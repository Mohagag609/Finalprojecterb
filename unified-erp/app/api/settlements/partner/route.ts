import { NextResponse } from 'next/server';
import { settleProjectPartners } from '@/services/settlements/partner';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await auth();
  const { projectId } = await req.json();
  const res = await settleProjectPartners(projectId, (session?.user as any)?.id || 'system');
  return NextResponse.json(res);
}