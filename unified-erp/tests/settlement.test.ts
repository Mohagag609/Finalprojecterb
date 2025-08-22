import { describe, it, expect } from 'vitest';
import { buildSettlementPlan } from '@/services/settlements/partner';

describe('partner settlement', () => {
  it('example (1000, 3000) -> transfer 1000 from p1 to p2', () => {
    const plan = buildSettlementPlan([
      { partnerId: 'p1', amount: 1000 },
      { partnerId: 'p2', amount: 3000 }
    ]);
    expect(plan).toHaveLength(1);
    expect(plan[0]).toEqual({ fromPartnerId: 'p1', toPartnerId: 'p2', amount: 1000 });
  });
});