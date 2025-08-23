import Link from 'next/link';
import { LayoutDashboard, Users, Boxes, Wallet, ReceiptText, ArrowLeftRight, FileSpreadsheet, Building2, FolderTree, Package, MoveRight, Handshake, BarChart3, Settings } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/real-estate/clients', label: 'العملاء', icon: Users },
  { href: '/real-estate/units', label: 'الوحدات', icon: Boxes },
  { href: '/accounting/cashboxes', label: 'الخزن', icon: Wallet },
  { href: '/accounting/vouchers', label: 'السندات', icon: ReceiptText },
  { href: '/accounting/transfers', label: 'تحويلات', icon: ArrowLeftRight },
  { href: '/accounting/invoices', label: 'الفواتير', icon: FileSpreadsheet },
  { href: '/accounting/bank-imports', label: 'كشف البنك', icon: FileSpreadsheet },
  { href: '/accounting/journal', label: 'دفتر القيود', icon: ReceiptText },
  { href: '/projects/projects', label: 'المشروعات', icon: Building2 },
  { href: '/projects/phases', label: 'المراحل', icon: FolderTree },
  { href: '/projects/materials', label: 'المواد', icon: Package },
  { href: '/projects/material-moves', label: 'حركات مواد', icon: MoveRight },
  { href: '/settlements/partner', label: 'تسوية شركاء', icon: Handshake },
  { href: '/reports', label: 'التقارير', icon: BarChart3 },
  { href: '/settings', label: 'الإعدادات', icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-l h-screen sticky top-0">
      <nav className="p-4 space-y-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted">
            <l.icon className="w-4 h-4" />
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}