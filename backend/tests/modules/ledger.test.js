import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as ledgerService from '../../src/modules/ledger/ledger.service.js';

// Mock DB interactions
vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
    }
  }
});

describe('Ledger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateLedger', () => {
    it('accurately parses ledger mappings for vacant and occupied units', async () => {
      // Setup complex test data mirroring DB joins
      const mockUnits = [
        { unit_id: 1, unit_label: '1A', property_name: 'Building A', tenant_id: 101, tenant_name: 'John Doe' },
        { unit_id: 2, unit_label: '1B', property_name: 'Building A', tenant_id: null, tenant_name: null }
      ];
      
      const mockRents = [
        { id: 1, tenant_id: 101, unit_id: 1, amount: 1500, status: 'paid', due_date: '2025-01-01', month: 1, year: 2025 }
      ];

      const mockSplits = [
        { id: 1, tenant_id: 101, unit_id: 1, amount: 200, status: 'pending', type: 'Electricity' }
      ];

      const mockUnitBills = []; // Exclude for brevity

      // Mock in order: 1. units limit, 2. rents, 3. splits, 4. unitbills
      pool.query
        .mockResolvedValueOnce({ rows: mockUnits })
        .mockResolvedValueOnce({ rows: mockRents })
        .mockResolvedValueOnce({ rows: mockSplits })
        .mockResolvedValueOnce({ rows: mockUnitBills });

      const result = await ledgerService.generateLedger('all', 'all', 2025, 1);

      // Verify complex financial math derivation
      expect(result.collected).toBe(1500); // 1500 rent was paid
      expect(result.pending).toBe(200);    // 200 bill split is pending

      expect(result.tenants).toHaveLength(1); // Vacant unit without bills is filtered out
      
      // Check John Doe block
      const johnBlock = result.tenants.find(t => t.tenant_id === 101);
      expect(johnBlock.tenant_name).toBe('John Doe');
      expect(johnBlock.total_collected).toBe(1500);
      expect(johnBlock.total_pending).toBe(200);
      expect(johnBlock.dues).toHaveLength(2); // Rent + Bill split
    });

    it('handles shared reference resolution properly for multiple tenants in one unit', async () => {
      const mockUnits = [
        { unit_id: 1, tenant_id: 101, tenant_name: 'Alice' },
        { unit_id: 1, tenant_id: 102, tenant_name: 'Bob' }
      ];
      
      // A unit-wide flat bill
      const mockUnitBills = [
        { id: 5, unit_id: 1, amount: 1000, status: 'pending', type: 'Water' }
      ];

      pool.query
        .mockResolvedValueOnce({ rows: mockUnits })
        .mockResolvedValueOnce({ rows: [] }) // rents
        .mockResolvedValueOnce({ rows: [] }) // splits
        .mockResolvedValueOnce({ rows: mockUnitBills }); // unit bills

      const result = await ledgerService.generateLedger('all', 'all', 2025, 1);

      // Verify the math applies strictly to primary to avoid duplicate math!
      expect(result.pending).toBe(1000); // And not 2000!

      const alice = result.tenants.find(t => t.tenant_id === 101);
      const bob = result.tenants.find(t => t.tenant_id === 102);
      
      expect(alice.dues[0].is_shared_reference).toBe(false);
      expect(bob.dues[0].is_shared_reference).toBe(true); // Flagged for UI rendering duplicate
    });
  });
});
