import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function IndexPage() {
  const enableAuth = process.env.ENABLE_AUTH !== 'false';
  if (!enableAuth) {
    redirect('/dashboard');
  }
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }
  redirect('/login');
}