'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ContractForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      clientId: String(fd.get('clientId')),
      unitId: String(fd.get('unitId')),
      startDate: String(fd.get('startDate')),
      totalAmount: Number(fd.get('totalAmount')),
      downPayment: Number(fd.get('downPayment')),
      months: Number(fd.get('months')),
      planType: String(fd.get('planType')) as 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
      notes: String(fd.get('notes') || '') || undefined
    };
    setLoading(true);
    try {
      const res = await fetch('/api/real-estate/contracts?generate=true', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) { alert('تعذر إنشاء العقد'); return; }
      e.currentTarget.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-8 gap-2 border rounded p-3 bg-card">
      <input name="clientId" placeholder="ID العميل" required className="border rounded px-2 py-1" />
      <input name="unitId" placeholder="ID الوحدة" required className="border rounded px-2 py-1" />
      <input name="startDate" type="date" required className="border rounded px-2 py-1" defaultValue={new Date().toISOString().slice(0,10)} />
      <input name="totalAmount" type="number" step="0.01" placeholder="إجمالي" required className="border rounded px-2 py-1" />
      <input name="downPayment" type="number" step="0.01" placeholder="مقدم" required className="border rounded px-2 py-1" />
      <input name="months" type="number" placeholder="أشهر" required className="border rounded px-2 py-1" />
      <select name="planType" className="border rounded px-2 py-1">
        <option value="MONTHLY">شهري</option>
        <option value="QUARTERLY">ربع سنوي</option>
        <option value="YEARLY">سنوي</option>
      </select>
      <input name="notes" placeholder="ملاحظات" className="border rounded px-2 py-1 md:col-span-2" />
      <button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
    </form>
  );
}