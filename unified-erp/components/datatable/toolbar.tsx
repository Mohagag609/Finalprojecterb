'use client';
import { useState } from 'react';

export default function DataTableToolbar({ onSearch }: { onSearch: (q: string) => void }) {
  const [q, setQ] = useState('');
  return (
    <div className="flex items-center gap-2 mb-3">
      <input
        className="border rounded px-3 py-2 w-64"
        placeholder="بحث..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(q)}
      />
      <button className="px-3 py-2 border rounded" onClick={() => onSearch(q)}>
        بحث
      </button>
    </div>
  );
}