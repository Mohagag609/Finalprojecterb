import Decimal from 'decimal.js-light';

export function toDecimal(n: Decimal.Value): Decimal {
  return new Decimal(n);
}

export function sum(values: Decimal.Value[]): Decimal {
  return values.reduce((acc, v) => acc.add(v), new Decimal(0));
}

export function isZero(n: Decimal.Value): boolean {
  return new Decimal(n).abs().lt(0.005);
}

export function ensureBalanced(debits: Decimal.Value[], credits: Decimal.Value[]) {
  const d = sum(debits);
  const c = sum(credits);
  if (!d.sub(c).abs().lt(0.005)) {
    throw new Error(`Unbalanced entry: debit=${d.toFixed(2)} credit=${c.toFixed(2)}`);
  }
}

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}