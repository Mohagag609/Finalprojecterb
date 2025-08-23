'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function InvoiceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      type: String(fd.get('type')) as 'customer' | 'supplier' | 'contractor',
      number: String(fd.get('number')),
      date: String(fd.get('date')),
      dueDate: String(fd.get('dueDate') || '' ) || undefined,
      partyId: String(fd.get('partyId') || '' ) || undefined,
      lines: [
        {
          description: String(fd.get('description')),
          qty: Number(fd.get('qty')),
          unitPrice: Number(fd.get('unitPrice')),
          accountId: String(fd.get('accountId'))
        }
      ]
    };
    setLoading(true);
    try {
      const res = await fetch('/api/accounting/invoices', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        alert('تعذر إنشاء الفاتورة');
        return;
      }
      e.currentTarget.reset();
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-8 gap-2 border rounded p-3 bg-card">
      <select name="type" className="border rounded px-2 py-1">
        <option value="customer">عميل</option>
        <option value="supplier">مورد</option>
        <option value="contractor">مقاول</option>
      </select>
      <input name="number" placeholder="رقم" required className="border rounded px-2 py-1" />
      <input name="date" type="date" required className="border rounded px-2 py-1" defaultValue={new Date().toISOString().slice(0, 10)} />
      <input name="dueDate" type="date" className="border rounded px-2 py-1" />
      <input name="partyId" placeholder="Party ID (اختياري)" className="border rounded px-2 py-1" />
      <input name="description" placeholder="وصف البند" required className="border rounded px-2 py-1 md:col-span-2" />
      <input name="qty" type="number" step="0.01" placeholder="كمية" required className="border rounded px-2 py-1" />
      <input name="unitPrice" type="number" step="0.01" placeholder="سعر" required className="border rounded px-2 py-1" />
      <input name="accountId" placeholder="حساب الإيراد/المصروف (ID)" required className="border rounded px-2 py-1 md:col-span-2" />
      <button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
    </form>
  );
}