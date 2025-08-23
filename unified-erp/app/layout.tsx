import '@/app/globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { ensureDailyBackup } from '@/lib/backup';

// Make the entire app render dynamically to avoid build-time DB calls
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Unified Real Estate & Treasury ERP',
  description: 'ERP عقاري وخزينة - RTL',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Skip backup execution at build time or when DB is not configured
  if (process.env.DATABASE_URL) {
    await ensureDailyBackup().catch(() => {});
  }
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}