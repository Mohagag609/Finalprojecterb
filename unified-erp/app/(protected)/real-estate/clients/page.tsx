import DataTable from '@/components/datatable/data-table';
import { buildColumns } from '@/components/datatable/columns';

async function fetchClients(searchParams: { q?: string; page?: string; size?: string } = {}) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/clients?q=${encodeURIComponent(q)}&page=${page}&size=${size}`, { cache: 'no-store' });
  return res.json();
}

export default async function ClientsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchClients((searchParams as any) || {});
  const columns = buildColumns<any>([
    { key: 'name', header: 'الاسم' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'email', header: 'البريد' },
    { key: 'address', header: 'العنوان' }
  ]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">العملاء</h1>
      <form action="/api/real-estate/clients" method="post" className="grid grid-cols-1 md:grid-cols-5 gap-2 border rounded p-3 bg-card">
        <input name="name" placeholder="الاسم" className="border rounded px-2 py-1" required />
        <input name="phone" placeholder="الهاتف" className="border rounded px-2 py-1" />
        <input name="email" placeholder="البريد" type="email" className="border rounded px-2 py-1" />
        <input name="address" placeholder="العنوان" className="border rounded px-2 py-1" />
        <button type="submit" className="bg-primary text-primary-foreground rounded px-3">إضافة</button>
      </form>
      <DataTable columns={columns} data={items} />
    </div>
  );
}