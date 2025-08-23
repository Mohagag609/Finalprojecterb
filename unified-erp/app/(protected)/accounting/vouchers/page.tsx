import VoucherForm from '@/components/forms/voucher-form';
import VouchersTable from '@/components/datatable/vouchers-table';

async function fetchVouchers(searchParams: { page?: string; size?: string } = {}) {
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/accounting/vouchers?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function VouchersPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchVouchers((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">السندات</h1>
      <VoucherForm />
      <VouchersTable items={items} />
    </div>
  );
}