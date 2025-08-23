import UnitsTable from '@/components/datatable/units-table';

async function fetchUnits(searchParams: { q?: string; page?: string; size?: string } = {}) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/units?q=${encodeURIComponent(q)}&page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function UnitsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchUnits((searchParams as any) || {});

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">الوحدات</h1>
      <form action="/api/real-estate/units" method="post" className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-3 bg-card">
        <input name="code" placeholder="الكود" className="border rounded px-2 py-1" required />
        <input name="type" placeholder="النوع" className="border rounded px-2 py-1" required />
        <input name="area" placeholder="المساحة" type="number" step="0.01" className="border rounded px-2 py-1" />
        <input name="price" placeholder="السعر" type="number" step="0.01" className="border rounded px-2 py-1" required />
        <select name="status" className="border rounded px-2 py-1">
          <option value="available">متاحة</option>
          <option value="sold">مباعة</option>
          <option value="returned">مرتجعة</option>
        </select>
        <button type="submit" className="bg-primary text-primary-foreground rounded px-3">إضافة</button>
      </form>
      <UnitsTable items={items} />
    </div>
  );
}