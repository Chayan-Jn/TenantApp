import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as billsService from '../../src/modules/bills/bills.service.js';

vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
      connect: vi.fn(),
    }
  }
});

describe('Bills Service', () => {
  let mockClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
      release: vi.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('createBill', () => {
    it('creates a basic unit utility bill successfully without splits', async () => {
      // 1. Ownership check mock (via pool.query)
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      
      const payload = {
        property_id: 1,
        unit_id: 2,
        type: 'Water',
        amount: 250,
        month: 5,
        year: 2025,
        split_type: 'unit'
      };

      const mockResult = { id: 10, ...payload };
      
      // Transaction queries (via client.query)
      mockClient.query.mockResolvedValue({ rows: [mockResult] });

      const result = await billsService.createBill(payload, 2); // Owner 2
      expect(result).toEqual(mockResult);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO bills'),
        expect.arrayContaining([2, 'Water', 250])
      );
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    });

    it('successfully processes equal splits amongst active tenants', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // ownership check
      
      const payload = {
        property_id: 1, unit_id: 2, type: 'Electricity', amount: 1000, month: 5, year: 2025,
        split_type: 'equal' 
      };

      // Mock transaction responses
      mockClient.query
        .mockResolvedValueOnce({}) // BEGIN
        .mockResolvedValueOnce({ rows: [{ id: 101 }, { id: 102 }] }) // Active tenants safety check
        .mockResolvedValueOnce({ rows: [{ id: 10, ...payload }] }) // Insert main bill
        .mockResolvedValueOnce({ rows: [{ id: 101 }, { id: 102 }] }) // Select tenants for split loop
        .mockResolvedValueOnce({}) // Insert split 1
        .mockResolvedValueOnce({}) // Insert split 2
        .mockResolvedValueOnce({}); // COMMIT

      const result = await billsService.createBill(payload, 2);
      expect(result.amount).toBe(1000);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO bill_splits'),
        expect.arrayContaining([10, 101, 500]) // 1000 / 2
      );
    });
  });
});
