import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'لوحة التحكم' },
  { href: '/real-estate/clients', label: 'العملاء' },
  { href: '/real-estate/units', label: 'الوحدات' },
  { href: '/accounting/cashboxes', label: 'الخزن' },
  { href: '/accounting/vouchers', label: 'السندات' },
  { href: '/accounting/transfers', label: 'تحويلات' },
  { href: '/accounting/invoices', label: 'الفواتير' },
  { href: '/accounting/bank-imports', label: 'كشف البنك' },
  { href: '/accounting/journal', label: 'دفتر القيود' },
  { href: '/projects/projects', label: 'المشروعات' },
  { href: '/projects/phases', label: 'المراحل' },
  { href: '/projects/materials', label: 'المواد' },
  { href: '/projects/material-moves', label: 'حركات مواد' },
  { href: '/settlements/partner', label: 'تسوية شركاء' },
  { href: '/reports', label: 'التقارير' },
  { href: '/settings', label: 'الإعدادات' }
];

export default function Sidebar() {
  return (
    <aside className="w-56 border-l h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="block px-3 py-2 rounded hover:bg-muted">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}