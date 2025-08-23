import { NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';

export async function POST(req: Request) {
	const formData = await req.formData();
	const email = String(formData.get('email') || '');
	const password = String(formData.get('password') || '');
	try {
		await signIn('credentials', { redirect: false, email, password });
		return NextResponse.redirect(new URL('/dashboard', req.url));
	} catch (e) {
		return NextResponse.redirect(new URL('/login?error=Credentials', req.url));
	}
}