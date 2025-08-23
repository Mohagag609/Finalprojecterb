'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function UnitsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'code', header: 'الكود' },
		{ accessorKey: 'type', header: 'النوع' },
		{ accessorKey: 'area', header: 'المساحة' },
		{ accessorKey: 'price', header: 'السعر' },
		{ accessorKey: 'status', header: 'الحالة' }
	];
	return <DataTable columns={columns} data={items} />;
}