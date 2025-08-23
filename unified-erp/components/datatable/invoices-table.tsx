'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function InvoicesTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'date', header: 'التاريخ' },
		{ accessorKey: 'type', header: 'النوع' },
		{ accessorKey: 'number', header: 'الرقم' },
		{ accessorKey: 'total', header: 'الإجمالي' },
		{ accessorKey: 'status', header: 'الحالة' }
	];
	return <DataTable columns={columns} data={items} />;
}