'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function ContractsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'client.name', header: 'العميل' },
		{ accessorKey: 'unit.code', header: 'الوحدة' },
		{ accessorKey: 'startDate', header: 'بداية' },
		{ accessorKey: 'totalAmount', header: 'الإجمالي' },
		{ accessorKey: 'downPayment', header: 'المقدم' },
		{ accessorKey: 'months', header: 'أشهر' },
		{ accessorKey: 'planType', header: 'الخطة' }
	];
	const mapped = items.map((c) => ({
		...c,
		startDate: c.startDate ? new Date(c.startDate).toISOString().slice(0, 10) : ''
	}));
	return <DataTable columns={columns} data={mapped} />;
}