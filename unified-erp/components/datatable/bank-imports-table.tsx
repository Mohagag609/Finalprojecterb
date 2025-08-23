'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function BankImportsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'date', header: 'التاريخ' },
		{ accessorKey: 'amount', header: 'المبلغ' },
		{ accessorKey: 'type', header: 'النوع' },
		{ accessorKey: 'reference', header: 'مرجع' },
		{ accessorKey: 'description', header: 'الوصف' },
		{ accessorKey: 'posted', header: 'مرحّل؟' }
	];
	return <DataTable columns={columns} data={items} />;
}