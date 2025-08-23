import BankImportForm from '@/components/forms/bank-import-form';
import BankImportsTable from '@/components/datatable/bank-imports-table';

async function fetchBankImports(searchParams: { page?: string; size?: string } = {}) {
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/accounting/bank-imports?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function BankImportsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchBankImports((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">كشف البنك</h1>
      <BankImportForm />
      <BankImportsTable items={items} />
    </div>
  );
}