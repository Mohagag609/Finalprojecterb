'use client';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/projects/projects')
      .then((r) => r.json())
      .then((d) => setItems(d.items || []));
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">المشاريع</h1>
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 text-right">الكود</th>
              <th className="p-2 text-right">الاسم</th>
              <th className="p-2 text-right">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="even:bg-muted/30">
                <td className="p-2">{p.code}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}