import InstallmentsTable from '@/components/datatable/installments-table';

async function fetchInstallments(searchParams: { status?: string; page?: string; size?: string } = {}) {
  const status = searchParams.status || '';
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  const qs = new URLSearchParams();
  if (status) qs.set('status', status);
  qs.set('page', String(page));
  qs.set('size', String(size));
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/installments?${qs.toString()}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function InstallmentsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchInstallments((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">الأقساط</h1>
      <InstallmentsTable items={items} />
    </div>
  );
}