'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  UserPlus, 
  Building, 
  Receipt, 
  Calculator,
  HandCoins,
  DollarSign,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const quickActions = [
  {
    title: 'إضافة عميل جديد',
    description: 'تسجيل عميل جديد في النظام',
    icon: UserPlus,
    href: '/real-estate/clients/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'إنشاء سند قبض',
    description: 'إصدار سند قبض جديد',
    icon: Receipt,
    href: '/accounting/vouchers',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'إنشاء سند صرف',
    description: 'إصدار سند صرف جديد',
    icon: DollarSign,
    href: '/accounting/vouchers',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  {
    title: 'مخالصة شركاء',
    description: 'تنفيذ مخالصة بين الشركاء',
    icon: HandCoins,
    href: '/settlements/partners',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'إضافة وحدة',
    description: 'تسجيل وحدة عقارية جديدة',
    icon: Home,
    href: '/real-estate/units/new',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    title: 'قيد يومية',
    description: 'إنشاء قيد محاسبي جديد',
    icon: Calculator,
    href: '/accounting/journal/new',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    title: 'التقارير',
    description: 'عرض التقارير المختلفة',
    icon: FileText,
    href: '/reports',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    title: 'إضافة مشروع',
    description: 'إنشاء مشروع عقاري جديد',
    icon: Building,
    href: '/real-estate/projects/new',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  }
];

export default function QuickActions() {
  const router = useRouter();

  const handleAction = (href: string) => {
    router.push(href);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>الإجراءات السريعة</CardTitle>
        <CardDescription>اختصارات للعمليات الأكثر استخداماً</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleAction(action.href)}
                className="group relative flex flex-col items-center justify-center p-4 rounded-lg border hover:border-primary transition-all hover:shadow-md"
              >
                <div className={`p-3 rounded-full ${action.bgColor} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                </div>
                <h3 className="mt-3 font-medium text-sm text-center">{action.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground text-center">{action.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}