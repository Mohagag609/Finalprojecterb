'use client';
import DataTable from '@/components/datatable/data-table';
import { ColumnDef } from '@tanstack/react-table';

export default function ClientsTable({ items }: { items: any[] }) {
	const columns: ColumnDef<any, any>[] = [
		{ accessorKey: 'name', header: 'الاسم' },
		{ accessorKey: 'phone', header: 'الهاتف' },
		{ accessorKey: 'email', header: 'البريد' },
		{ accessorKey: 'address', header: 'العنوان' }
	];
	return <DataTable columns={columns} data={items} />;
}