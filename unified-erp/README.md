# Unified Real Estate & Treasury ERP (RTL)

ERP عقاري وخزينة بالعربية (RTL) مبني بـ Next.js 14 + Prisma + PostgreSQL مع مصادقة اختيارية، تقارير PDF/Excel، وخدمات محاسبية مزدوجة القيد.

## Quick Start

1) إعداد البيئة

- أنشئ قاعدة بيانات PostgreSQL وضع المتغيرات في `.env` بناءً على `.env.example`.

2) تثبيت وتشغيل

```bash
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

يفترض المستخدم التجريبي:
- Email: `admin@demo.local`
- Password: `admin123`

عند `ENABLE_AUTH=false` سيتم تجاوز تسجيل الدخول.

## سكربتات
- dev, build, start, lint, format, typecheck
- db:generate, db:migrate, db:studio, seed
- test, backup:run

## ملاحظات
- جميع القيود اليومية متوازنة (Double-Entry) وإلا تُرفض.
- التحويل بين نفس الخزنة مرفوض.
- التصحيحات عبر Reversal فقط.
- نسخ احتياطي يومي تلقائي عبر `/api/backups/run`.

## بنية المشروع
راجع الشجرة في مجلد المشروع.