'use client';
import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';

export default function DataTable<T>({ columns, data }: { columns: ColumnDef<T, any>[]; data: T[] }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize } },
    onPaginationChange: (updater) => {
      const next = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="text-right p-2 border-b bg-muted">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-muted/30">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <div className="space-x-2 rtl:space-x-reverse">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-2 py-1 border rounded">
            السابق
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-2 py-1 border rounded">
            التالي
          </button>
        </div>
        <div>صفحة {pageIndex + 1} من {table.getPageCount()}</div>
      </div>
    </div>
  );
}