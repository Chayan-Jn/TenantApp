import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as paymentsService from '../../src/modules/payments/payments.service.js';

vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
    }
  }
});

describe('Payments Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPayments', () => {
    it('accurately parses rent and bills into a unified payment projection', async () => {
      const mockRows = [
        { id: 10, payment_type: 'rent', description: 'Rent', amount: 2000, status: 'paid' },
        { id: 20, payment_type: 'unit_bill', description: 'Water', amount: 500, status: 'pending' },
      ];

      pool.query.mockResolvedValueOnce({ rows: mockRows });

      const result = await paymentsService.getPayments({ owner_id: 1, month: 1, year: 2025, property_id: 'all' });
      
      expect(result.payments).toHaveLength(2);
      expect(result.collected).toBe(2000);   // The paid rent
      expect(result.pending).toBe(500);      // The pending water bill
      expect(pool.query).toHaveBeenCalled();
    });
  });
});
