'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PartnerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name')),
      phone: String(fd.get('phone') || '' ) || undefined,
      note: String(fd.get('note') || '' ) || undefined
    };
    setLoading(true);
    try {
      const res = await fetch('/api/real-estate/partners', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { alert('تعذر إنشاء الشريك'); return; }
      e.currentTarget.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-2 border rounded p-3 bg-card">
      <input name="name" placeholder="الاسم" required className="border rounded px-2 py-1" />
      <input name="phone" placeholder="الهاتف" className="border rounded px-2 py-1" />
      <input name="note" placeholder="ملاحظة" className="border rounded px-2 py-1 md:col-span-2" />
      <button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
    </form>
  );
}