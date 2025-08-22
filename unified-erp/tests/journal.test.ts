import { describe, it, expect } from 'vitest';
import { createJournalEntry } from '@/services/accounting/journal';

// NOTE: These tests assume a test database and prisma setup; here we only validate function behavior shape.
describe('journal', () => {
  it('rejects unbalanced entries', async () => {
    await expect(
      createJournalEntry({
        date: new Date(),
        createdBy: 'tester',
        lines: [
          { accountId: 'A', debit: 100 },
          { accountId: 'B', credit: 90 }
        ]
      } as any)
    ).rejects.toThrowError();
  });
});