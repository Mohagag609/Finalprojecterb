import TransferForm from '@/components/forms/transfer-form';
import TransfersTable from '@/components/datatable/transfers-table';

async function fetchTransfers(searchParams: { page?: string; size?: string } = {}) {
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/accounting/transfers?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function TransfersPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchTransfers((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">تحويلات الخزن</h1>
      <TransferForm />
      <TransfersTable items={items} />
    </div>
  );
}