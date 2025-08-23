import ReturnForm from '@/components/forms/return-form';
import ReturnsTable from '@/components/datatable/returns-table';

async function fetchReturns(searchParams: { page?: string; size?: string } = {}) {
  const page = parseInt(searchParams.page || '1');
  const size = parseInt(searchParams.size || '10');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/real-estate/returns?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!res.ok) return { items: [], total: 0, page, size };
    return res.json();
  } catch {
    return { items: [], total: 0, page, size };
  }
}

export default async function ReturnsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const { items } = await fetchReturns((searchParams as any) || {});
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">المرتجعات</h1>
      <ReturnForm />
      <ReturnsTable items={items} />
    </div>
  );
}