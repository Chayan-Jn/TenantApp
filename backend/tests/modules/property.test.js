import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as propertyService from '../../src/modules/property/property.service.js';

// Mock DB interactions
vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
    }
  }
});

describe('Property Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProperty', () => {
    it('creates a new property and returns it', async () => {
      const mockResult = { id: 1, name: 'Ocean View', owner_id: 2, type: 'residential' };
      pool.query.mockResolvedValueOnce({ rows: [mockResult] });

      const property = await propertyService.createProperty({ 
        owner_id: 2, name: 'Ocean View', address: '123 Beach', type: 'residential' 
      });

      expect(property).toEqual(mockResult);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO properties'),
        [2, 'Ocean View', '123 Beach', 'residential']
      );
    });

    it('throws database error on constraint failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('Unique constraint failed'));
      await expect(propertyService.createProperty({}))
        .rejects.toThrow('Unique constraint failed');
    });
  });

  describe('getPropertiesByOwner', () => {
    it('returns an array of properties for owner', async () => {
      const mockRows = [{ id: 1, name: 'Prop 1' }, { id: 2, name: 'Prop 2' }];
      pool.query.mockResolvedValueOnce({ rows: mockRows });

      const properties = await propertyService.getPropertiesByOwner(1);

      expect(properties).toEqual(mockRows);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM properties WHERE owner_id = $1'),
        [1]
      );
    });
  });

  describe('updateProperty', () => {
    it('throws error if property not found or unauthorized', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });
      await expect(propertyService.updateProperty(99, { name: 'New' }, 2))
        .rejects.toThrow('Property not found or unauthorized');
    });

    it('updates property and returns updated rows', async () => {
      const updatedMock = { id: 1, name: 'Updated Name', address: 'New Addr', type: 'PG' };
      pool.query.mockResolvedValueOnce({ rows: [updatedMock] });

      const result = await propertyService.updateProperty(1, { name: 'Updated Name', address: 'New Addr', type: 'PG' }, 2);

      expect(result).toEqual(updatedMock);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE properties SET name = $1, address = $2, type = $3'),
        ['Updated Name', 'New Addr', 'PG', 1, 2]
      );
    });
  });

  describe('deleteProperty', () => {
    it('deletes properly resolving returned row to confirm', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
      const result = await propertyService.deleteProperty(1, 2);
      expect(result.id).toBe(1);
    });
  });
});
