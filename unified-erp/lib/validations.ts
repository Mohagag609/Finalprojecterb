import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'بريد إلكتروني غير صالح' }),
  password: z.string().min(6, { message: 'كلمة المرور قصيرة' })
});

export const voucherSchema = z.object({
  kind: z.enum(['receipt', 'payment']),
  date: z.string(),
  cashboxId: z.string(),
  projectId: z.string().optional(),
  amount: z.coerce.number().positive(),
  clientId: z.string().optional(),
  supplierId: z.string().optional(),
  contractorId: z.string().optional(),
  partnerId: z.string().optional(),
  note: z.string().optional()
});

export const transferSchema = z.object({
  fromCashboxId: z.string(),
  toCashboxId: z.string(),
  date: z.string(),
  amount: z.coerce.number().positive(),
  note: z.string().optional()
});

export const invoiceSchema = z.object({
  projectId: z.string().optional(),
  type: z.enum(['customer', 'supplier', 'contractor']),
  number: z.string(),
  date: z.string(),
  dueDate: z.string().optional(),
  status: z.enum(['draft', 'posted', 'paid', 'partial']).default('draft'),
  lines: z
    .array(
      z.object({
        description: z.string(),
        materialId: z.string().optional(),
        qty: z.coerce.number().positive(),
        unitPrice: z.coerce.number().nonnegative(),
        accountId: z.string()
      })
    )
    .min(1)
});

export const contractSchema = z.object({
  clientId: z.string(),
  unitId: z.string(),
  startDate: z.string(),
  totalAmount: z.coerce.number().positive(),
  downPayment: z.coerce.number().nonnegative(),
  months: z.coerce.number().int().positive(),
  planType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  notes: z.string().optional()
});