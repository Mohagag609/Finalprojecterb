'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BankImportForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function parseCsv(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    const items = lines.slice(1).map((l) => {
      const [date, amount, type, reference, description] = l.split(',');
      return { date: new Date(date), amount: Number(amount), type: type as 'debit' | 'credit', reference, description };
    });
    return items;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get('file') as File | null;
    if (!file) return;
    setLoading(true);
    try {
      const items = await parseCsv(file);
      const res = await fetch('/api/accounting/bank-imports', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items }) });
      if (!res.ok) { alert('تعذر الاستيراد'); return; }
      await fetch('/api/accounting/bank-imports?action=match', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({}) });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 border rounded p-3 bg-card">
      <input type="file" name="file" accept="text/csv" className="border rounded px-2 py-1" />
      <button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'استيراد + مطابقة'}</button>
    </form>
  );
}