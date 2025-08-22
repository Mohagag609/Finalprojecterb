import { NextResponse } from 'next/server';
import { listPhases, createPhase } from '@/services/projects/phases';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get('projectId')!;
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const res = await listPhases(projectId, page, size);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await createPhase(data);
  return NextResponse.json(created);
}