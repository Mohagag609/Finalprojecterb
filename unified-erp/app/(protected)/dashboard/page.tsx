import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a href="/accounting/cashboxes" className="p-4 rounded border bg-card hover:bg-muted transition">أرصدة الخزن</a>
        <a href="/reports" className="p-4 rounded border bg-card hover:bg-muted transition">إيراد/مصروف الشهر</a>
        <a href="/settings" className="p-4 rounded border bg-card hover:bg-muted transition">آخر نسخة احتياطية</a>
      </div>
      <div className="mt-6 flex gap-3">
        <a href="/real-estate/clients" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">العملاء</a>
        <a href="/real-estate/units" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">الوحدات</a>
        <a href="/accounting/journal" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">دفتر القيود</a>
      </div>
      <pre className="mt-6 text-xs opacity-60">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}