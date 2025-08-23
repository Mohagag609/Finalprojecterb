'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function VouchersTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'date', header: 'التاريخ' },
		{ accessorKey: 'kind', header: 'النوع' },
		{ accessorKey: 'amount', header: 'المبلغ' },
		{ accessorKey: 'cashboxId', header: 'الخزنة' },
		{ accessorKey: 'note', header: 'ملاحظة' }
	];
	return <DataTable columns={columns} data={items} />;
}