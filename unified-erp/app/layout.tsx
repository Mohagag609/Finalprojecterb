import '@/app/globals.css';
import { ReactNode } from 'react';
import { Metadata } from 'next';
import { ensureDailyBackup } from '@/lib/backup';

export const metadata: Metadata = {
  title: 'Unified Real Estate & Treasury ERP',
  description: 'ERP عقاري وخزينة - RTL',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureDailyBackup().catch(() => {});
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}