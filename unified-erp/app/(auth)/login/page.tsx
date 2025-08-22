import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  await signIn('credentials', { redirect: false, email, password });
  redirect('/dashboard');
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form action={loginAction} className="w-full max-w-sm space-y-4 bg-card p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold text-center">تسجيل الدخول</h1>
        <div className="space-y-2">
          <label className="block text-sm">البريد الإلكتروني</label>
          <input name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm">كلمة المرور</label>
          <input name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="w-full bg-primary text-primary-foreground rounded p-2">دخول</button>
      </form>
    </div>
  );
}