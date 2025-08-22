'use client';
import { useEffect, useState } from 'react';

export default function CashboxesPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/accounting/cashboxes')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">الخزن</h1>
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-right">الكود</th>
              <th className="p-2 text-right">الاسم</th>
              <th className="p-2 text-right">الفرع</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="even:bg-muted/30">
                <td className="p-2">{c.code}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.branch || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}