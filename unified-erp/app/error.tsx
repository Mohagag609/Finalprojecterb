"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
	return (
		<html>
			<body className="min-h-screen grid place-items-center p-6">
				<div className="max-w-md w-full border rounded-lg p-4 bg-card text-center space-y-3">
					<h1 className="text-xl font-bold">حدث خطأ غير متوقع</h1>
					<p className="text-muted-foreground">من فضلك أعد المحاولة لاحقًا. إن استمر الخطأ أرسل لنا رمز التتبّع.</p>
					{error?.digest && (
						<div className="text-xs opacity-70">Digest: {error.digest}</div>
					)}
					<a href="/" className="inline-flex items-center justify-center rounded bg-primary text-primary-foreground px-3 py-2">عودة للصفحة الرئيسية</a>
				</div>
			</body>
		</html>
	);
}