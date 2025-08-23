'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function InstallmentsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'dueDate', header: 'الاستحقاق' },
		{ accessorKey: 'amount', header: 'المبلغ' },
		{ accessorKey: 'status', header: 'الحالة' },
		{ accessorKey: 'paidAt', header: 'تاريخ السداد' }
	];
	const mapped = items.map((i) => ({ ...i, dueDate: i.dueDate?.slice(0,10), paidAt: i.paidAt ? i.paidAt.slice(0,10) : '' }));
	return <DataTable columns={columns} data={mapped} />;
}