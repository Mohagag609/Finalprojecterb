import ContractForm from '@/components/forms/contract-form';
import ContractsTable from '@/components/datatable/contracts-table';

async function fetchContracts(searchParams: { q?: string; page?: string; size?: string } = {}) {
  const q = searchParams.q || '';
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/contracts?q=${encodeURIComponent(q)}&page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function ContractsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchContracts((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">العقود</h1>
      <ContractForm />
      <ContractsTable items={items} />
    </div>
  );
}