import InvoiceForm from '@/components/forms/invoice-form';
import InvoicesTable from '@/components/datatable/invoices-table';

async function fetchInvoices(searchParams: { page?: string; size?: string } = {}) {
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/accounting/invoices?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function InvoicesPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchInvoices((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">الفواتير</h1>
      <InvoiceForm />
      <InvoicesTable items={items} />
    </div>
  );
}