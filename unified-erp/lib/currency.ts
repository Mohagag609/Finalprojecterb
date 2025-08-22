export function formatCurrency(amount: number | string): string {
  const n = typeof amount === 'string' ? Number(amount) : amount;
  return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(n);
}