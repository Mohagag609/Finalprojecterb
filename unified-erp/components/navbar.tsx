import { Building2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full h-12 bg-card border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5" />
        <div className="font-semibold">نظام موحّد للعقارات والخزينة</div>
      </div>
      <div className="text-sm text-muted-foreground">ERP</div>
    </nav>
  );
}