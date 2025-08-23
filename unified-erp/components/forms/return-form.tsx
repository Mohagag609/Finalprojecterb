'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ReturnForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      unitId: String(fd.get('unitId')),
      reason: String(fd.get('reason') || '' ) || undefined,
      complementPartnerId: String(fd.get('complementPartnerId') || '' ) || undefined,
      complementDate: String(fd.get('complementDate') || '' ) || undefined,
      complementAmount: fd.get('complementAmount') ? Number(fd.get('complementAmount')) : undefined,
      resaleStatus: String(fd.get('resaleStatus') || 'pending')
    };
    setLoading(true);
    try {
      const res = await fetch('/api/real-estate/returns', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { alert('تعذر إنشاء المرتجع'); return; }
      e.currentTarget.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-7 gap-2 border rounded p-3 bg-card">
      <input name="unitId" placeholder="ID الوحدة" required className="border rounded px-2 py-1" />
      <input name="reason" placeholder="سبب" className="border rounded px-2 py-1" />
      <input name="complementPartnerId" placeholder="ID الشريك المكمل" className="border rounded px-2 py-1" />
      <input name="complementDate" type="date" className="border rounded px-2 py-1" />
      <input name="complementAmount" type="number" step="0.01" placeholder="مبلغ مكمل" className="border rounded px-2 py-1" />
      <select name="resaleStatus" className="border rounded px-2 py-1">
        <option value="pending">قيد إعادة البيع</option>
        <option value="resold">تم إعادة البيع</option>
      </select>
      <button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
    </form>
  );
}