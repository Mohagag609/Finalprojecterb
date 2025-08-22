import { NextResponse } from 'next/server';
import { listMaterials, createMaterial } from '@/services/projects/materials';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const size = parseInt(url.searchParams.get('size') || '10');
  const res = await listMaterials(q, page, size);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await createMaterial(data);
  return NextResponse.json(created);
}