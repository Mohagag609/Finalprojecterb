'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Building2, 
  Calculator,
  Users,
  HandCoins
} from 'lucide-react';

const links = [
  { 
    href: '/dashboard', 
    label: 'لوحة التحكم',
    icon: LayoutDashboard
  },
  {
    href: '/real-estate',
    label: 'العقارات',
    icon: Building2,
    children: [
      { href: '/real-estate/projects', label: 'المشاريع' },
      { href: '/real-estate/units', label: 'الوحدات' },
      { href: '/real-estate/clients', label: 'العملاء' },
    ]
  },
  {
    href: '/accounting',
    label: 'المحاسبة',
    icon: Calculator,
    children: [
      { href: '/accounting/journal', label: 'دفتر اليومية' },
      { href: '/accounting/vouchers', label: 'السندات' },
      { href: '/accounting/chart', label: 'دليل الحسابات' },
    ]
  },
  {
    href: '/settlements',
    label: 'المخالصات',
    icon: HandCoins,
    children: [
      { href: '/settlements/partners', label: 'مخالصات الشركاء' },
      { href: '/settlements/partners/history', label: 'سجل المخالصات' },
    ]
  },
  { 
    href: '/reports', 
    label: 'التقارير',
    icon: FileText
  },
  { 
    href: '/settings', 
    label: 'الإعدادات',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l h-screen sticky top-0 hidden md:block bg-card">
      <nav className="p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <div key={link.href}>
              <Link 
                href={link.children ? link.children[0].href : link.href} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-muted",
                  isActive && "bg-muted font-medium"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
              
              {link.children && (
                <div className="mr-7 mt-1 space-y-1">
                  {link.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block px-3 py-1.5 text-sm rounded-md transition-colors",
                          "hover:bg-muted",
                          isChildActive && "bg-muted font-medium"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}