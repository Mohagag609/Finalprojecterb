import { ReactNode } from 'react';

export default function SettlementsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto p-6">
      {children}
    </div>
  );
}