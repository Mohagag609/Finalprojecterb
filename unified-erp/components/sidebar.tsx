import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'لوحة التحكم' },
  { href: '/reports', label: 'التقارير' },
  { href: '/settings', label: 'الإعدادات' }
];

export default function Sidebar() {
  return (
    <aside className="w-56 border-l h-screen sticky top-0 hidden md:block">
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