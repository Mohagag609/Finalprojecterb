'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TransferForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const payload = {
			fromCashboxId: String(fd.get('fromCashboxId')),
			toCashboxId: String(fd.get('toCashboxId')),
			date: String(fd.get('date')),
			amount: Number(fd.get('amount')),
			note: String(fd.get('note') || '') || undefined
		};
		setLoading(true);
		try {
			const res = await fetch('/api/accounting/transfers', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!res.ok) {
				alert('تعذر إنشاء التحويل');
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
			<input name="fromCashboxId" placeholder="من خزنة (ID)" required className="border rounded px-2 py-1" />
			<input name="toCashboxId" placeholder="إلى خزنة (ID)" required className="border rounded px-2 py-1" />
			<input name="date" type="date" required className="border rounded px-2 py-1" defaultValue={new Date().toISOString().slice(0, 10)} />
			<input name="amount" type="number" step="0.01" placeholder="المبلغ" required className="border rounded px-2 py-1" />
			<input name="note" placeholder="ملاحظة" className="border rounded px-2 py-1" />
			<button disabled={loading} className="bg-primary text-primary-foreground rounded px-3">{loading ? 'جارٍ...' : 'إضافة'}</button>
		</form>
	);
}