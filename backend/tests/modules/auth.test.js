import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../src/config/db.js';
import * as authService from '../../src/modules/auth/auth.service.js';

// Mock dependencies
vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../../src/config/db.js', () => {
  return {
    default: {
      query: vi.fn(),
    }
  }
});

vi.mock('google-auth-library', () => {
  return {
    OAuth2Client: vi.fn().mockImplementation(() => ({
      verifyIdToken: vi.fn().mockResolvedValue({
        getPayload: () => ({ email: 'test@google.com', name: 'Google User', sub: '12345' })
      })
    }))
  }
});

describe('Auth Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginOwner', () => {
    it('throws error if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] }); // No owner found
      await expect(authService.loginOwner({ username: 'fake', password: 'password' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('throws error if password mismatch', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, password_hash: 'hash' }] });
      bcrypt.compare.mockResolvedValueOnce(false); // Wrong password
      await expect(authService.loginOwner({ username: 'real', password: 'wrongpassword' }))
        .rejects.toThrow('Invalid credentials');
    });

    it('returns a token and owner details on success', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Owner', username: 'owner123', password_hash: 'hash', token_version: 1 }] });
      bcrypt.compare.mockResolvedValueOnce(true); 
      jwt.sign.mockReturnValueOnce('mocked_token');

      const result = await authService.loginOwner({ username: 'owner123', password: 'correctpassword' });
      
      expect(result.token).toBe('mocked_token');
      expect(result.owner).toEqual({ id: 1, name: 'Owner', username: 'owner123' });
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, username: 'owner123', token_version: 1 }), 
        expect.any(String), 
        { expiresIn: '7d' }
      );
    });
  });

  describe('revokeTokens', () => {
    it('increments token_version in db', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });
      await authService.revokeTokens(1);
      expect(pool.query).toHaveBeenCalledWith('UPDATE owners SET token_version = token_version + 1 WHERE id = $1', [1]);
    });
  });
});
