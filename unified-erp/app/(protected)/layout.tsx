import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import { ReactNode } from 'react';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <div className="flex-1 p-4">{children}</div>
        <Sidebar />
      </div>
    </div>
  );
}