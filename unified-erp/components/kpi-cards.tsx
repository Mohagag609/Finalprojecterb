'use client';
import { Card } from '@/components/ui/card';
import { Wallet, FileSpreadsheet, Users, ShieldCheck } from 'lucide-react';

export default function KPICards({ data }: { data: { cashBalance?: string; monthlyPnL?: string; overdueInvoices?: number; lastBackupAt?: string; clientsCount?: number } }) {
	const items = [
		{ icon: Wallet, label: 'أرصدة الخزن', value: data.cashBalance ?? '-' },
		{ icon: FileSpreadsheet, label: 'إيراد/مصروف الشهر', value: data.monthlyPnL ?? '-' },
		{ icon: Users, label: 'عدد العملاء', value: String(data.clientsCount ?? '-') },
		{ icon: ShieldCheck, label: 'آخر نسخة احتياطية', value: data.lastBackupAt ?? '-' }
	];
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
			{items.map(({ icon: Icon, label, value }, idx) => (
				<Card key={idx} className="p-4 flex items-center justify-between">
					<div className="text-sm text-muted-foreground">{label}</div>
					<div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="font-semibold">{value}</span></div>
				</Card>
			))}
		</div>
	);
}