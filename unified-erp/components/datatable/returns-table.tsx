'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function ReturnsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'unit.code', header: 'الوحدة' },
		{ accessorKey: 'reason', header: 'السبب' },
		{ accessorKey: 'resaleStatus', header: 'حالة إعادة البيع' },
		{ accessorKey: 'createdAt', header: 'تاريخ' }
	];
	const mapped = items.map((r) => ({ ...r, createdAt: r.createdAt?.slice(0,10) }));
	return <DataTable columns={columns} data={mapped} />;
}