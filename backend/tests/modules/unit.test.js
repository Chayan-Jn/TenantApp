import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as unitService from '../../src/modules/unit/unit.service.js';

vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
    }
  }
});

describe('Unit Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUnit', () => {
    it('creates a unit successfully attached to a property', async () => {
      // 1. verifyPropertyOwner returns something
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      
      const mockResult = { id: 10, property_id: 1, label: 'A1', type: 'single', status: 'vacant' };
      // 2. actual insert returns row
      pool.query.mockResolvedValueOnce({ rows: [mockResult] });

      const result = await unitService.createUnit({ property_id: 1, label: 'A1', rent: 1000, owner_id: 2 });
      
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUnitsByProperty', () => {
    it('returns a list of units for a given property', async () => {
      // 1. verifyPropertyOwner returns something
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const mockRows = [{ id: 10, label: 'A1' }, { id: 11, label: 'A2' }];
      pool.query.mockResolvedValueOnce({ rows: mockRows });

      const result = await unitService.getUnitsByProperty(1, 2); // prop 1, owner 2

      expect(result).toEqual(mockRows);
    });
  });

  describe('updateUnit', () => {
    it('throws error if unit not found or unauthorized to update', async () => {
      // 1. verifyPropertyOwner_byUnit fails
      pool.query.mockResolvedValueOnce({ rows: [] });
      
      await expect(unitService.updateUnit(99, { label: 'B1' }, 2))
        .rejects.toThrow('Unit not found or unauthorized');
    });

    it('updates unit fields successfully', async () => {
      // 1. verifyPropertyOwner_byUnit succeeds
      pool.query.mockResolvedValueOnce({ rows: [{ id: 10 }] });
      
      const updatedMock = { id: 10, label: 'Modified Label' };
      // 2. actual update succeeds
      pool.query.mockResolvedValueOnce({ rows: [updatedMock] });

      const result = await unitService.updateUnit(10, { label: 'Modified Label', rent: 1500 }, 2);
      
      expect(result).toEqual(updatedMock);
    });
  });
});
