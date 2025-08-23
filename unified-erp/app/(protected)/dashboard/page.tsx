import { auth } from '@/lib/auth';
import KPICards from '@/components/kpi-cards';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await auth();
  // Safe KPI queries
  let data: any = {};
  try {
    const [clientsCount, lastBackup] = await Promise.all([
      prisma.client.count().catch(() => 0),
      prisma.backup.findFirst({ orderBy: { runAt: 'desc' } }).catch(() => null)
    ]);
    data.clientsCount = clientsCount;
    data.lastBackupAt = lastBackup ? new Date(lastBackup.runAt).toLocaleString('ar-EG') : '-';
  } catch {
    data = {};
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>
      <KPICards data={data} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/accounting/cashboxes" className="p-4 rounded border bg-card hover:bg-muted transition">أرصدة الخزن</a>
        <a href="/reports" className="p-4 rounded border bg-card hover:bg-muted transition">إيراد/مصروف الشهر</a>
        <a href="/settings" className="p-4 rounded border bg-card hover:bg-muted transition">آخر نسخة احتياطية</a>
      </div>
      <div className="flex gap-3">
        <a href="/real-estate/clients" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">العملاء</a>
        <a href="/real-estate/units" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">الوحدات</a>
        <a href="/accounting/journal" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">دفتر القيود</a>
      </div>
      <pre className="text-xs opacity-60">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}