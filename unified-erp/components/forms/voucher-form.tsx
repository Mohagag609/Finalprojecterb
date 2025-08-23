'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VoucherForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const payload = {
			kind: String(fd.get('kind')) as 'receipt' | 'payment',
			date: String(fd.get('date')),
			cashboxId: String(fd.get('cashboxId')),
			amount: Number(fd.get('amount')),
			note: String(fd.get('note') || '') || undefined
		};
		setLoading(true);
		try {
			const res = await fetch('/api/accounting/vouchers', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) {
				alert('تعذر إنشاء السند');
				return;
			}
			e.currentTarget.reset();
			router.refresh();
		} finally {
			setLoading(false);
		}
	}
	return (
		<form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-2 border rounded p-3 bg-card">
			<select name="kind" className="border rounded px-2 py-1">
				<option value="receipt">قبض</option>
				<option value="payment">صرف</option>
			</select>
			<input name="date" type="date" required className="border rounded px-2 py-1" defaultValue={new Date().toISOString().slice(0, 10)} />
			<input name="cashboxId" placeholder="ID الخزنة" required className="border rounded px-2 py-1" />
			<input name="amount" type="number" step="0.01" placeholder="المبلغ" required className="border rounded px-2 py-1" />
			<input name="note" placeholder="ملاحظة" className="border rounded px-2 py-1 md:col-span-2" />
			<button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
		</form>
	);
}