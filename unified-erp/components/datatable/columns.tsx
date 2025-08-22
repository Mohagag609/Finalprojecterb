import { ColumnDef } from '@tanstack/react-table';

export function buildColumns<T extends Record<string, any>>(keys: { key: keyof T; header: string }[]): ColumnDef<T, any>[] {
  return keys.map((k) => ({
    accessorKey: k.key as string,
    header: k.header,
    cell: ({ row }) => String(row.original[k.key] ?? '')
  }));
}