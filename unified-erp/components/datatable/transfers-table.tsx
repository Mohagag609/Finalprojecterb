'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function TransfersTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'date', header: 'التاريخ' },
		{ accessorKey: 'fromCashboxId', header: 'من' },
		{ accessorKey: 'toCashboxId', header: 'إلى' },
		{ accessorKey: 'amount', header: 'المبلغ' },
		{ accessorKey: 'note', header: 'ملاحظة' }
	];
	return <DataTable columns={columns} data={items} />;
}