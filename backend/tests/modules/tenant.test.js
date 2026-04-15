import { describe, it, expect, vi, beforeEach } from 'vitest';
import pool from '../../src/config/db.js';
import * as tenantService from '../../src/modules/tenant/tenant.service.js';

// Mock DB interactions
vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
      connect: vi.fn(),
    }
  }
});

describe('Tenant Service Tests', () => {
  let mockClient;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup transaction mock client
    mockClient = {
      query: vi.fn(),
      release: vi.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);
  });

  describe('getTenantById', () => {
    it('throws error if tenant not found or unauthorized', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); 
      await expect(tenantService.getTenantById(99, 1))
        .rejects.toThrow('Tenant not found or unauthorized');
    });

    it('returns tenant details when found', async () => {
      const mockRow = { id: 1, name: 'John Doe', property_name: 'Building A' };
      pool.query.mockResolvedValueOnce({ rows: [mockRow] }); 
      
      const result = await tenantService.getTenantById(1, 1);
      expect(result).toEqual(mockRow);
      expect(pool.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTenant', () => {
    it('executes within a database transaction', async () => {
      // 1. BEGIN
      mockClient.query.mockResolvedValueOnce({}); 
      // 2. Owner check
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); 
      // 3. Insert
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'New Tenant' }] }); 
      // 4. Update unit
      mockClient.query.mockResolvedValueOnce({}); 
      // 5. COMMIT
      mockClient.query.mockResolvedValueOnce({}); 

      const payload = { unit_id: 1, name: 'New Tenant', phone: '123', join_date: '2025-01-01', owner_id: 1 };
      const tenant = await tenantService.createTenant(payload);

      expect(tenant.name).toBe('New Tenant');
      expect(mockClient.query).toHaveBeenNthCalledWith(1, 'BEGIN');
      expect(mockClient.query).toHaveBeenLastCalledWith('COMMIT');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('rolls back transaction on error', async () => {
      mockClient.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(tenantService.createTenant({ owner_id: 1 }))
        .rejects.toThrow('DB failure');

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });
});
