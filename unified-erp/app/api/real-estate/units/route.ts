import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const size = parseInt(url.searchParams.get('size') || '10');
    const where = q ? { OR: [{ code: { contains: q } }, { type: { contains: q } }, { description: { contains: q } }] } : {};
    const [items, total] = await Promise.all([
      prisma.unit.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { code: 'asc' } }),
      prisma.unit.count({ where })
    ]);
    return NextResponse.json({ items, total, page, size });
  } catch (e: any) {
    return NextResponse.json({ error: 'Database unavailable', details: e?.message }, { status: 503 });
  }
}

export async function POST(req: Request) {
  try {
    let data: any;
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await req.json();
    } else {
      const fd = await req.formData();
      data = Object.fromEntries(fd.entries());
    }
    if (data.area != null) data.area = Number(data.area);
    if (data.price != null) data.price = Number(data.price);
    const created = await prisma.unit.create({ data });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json({ error: 'Database unavailable', details: e?.message }, { status: 503 });
  }
}