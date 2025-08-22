import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded border">أرصدة الخزن</div>
        <div className="p-4 rounded border">إيراد/مصروف الشهر</div>
        <div className="p-4 rounded border">آخر نسخة احتياطية</div>
      </div>
      <pre className="mt-6 text-xs opacity-60">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}