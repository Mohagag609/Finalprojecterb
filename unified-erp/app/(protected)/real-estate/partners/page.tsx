import PartnerForm from '@/components/forms/partner-form';
import PartnersTable from '@/components/datatable/partners-table';

async function fetchPartners(searchParams: { q?: string; page?: string; size?: string } = {}) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/partners?q=${encodeURIComponent(q)}&page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function PartnersPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchPartners((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">الشركاء</h1>
      <PartnerForm />
      <PartnersTable items={items} />
    </div>
  );
}