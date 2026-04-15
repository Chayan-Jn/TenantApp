import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import pool from '../src/config/db.js';

// Setup before all tests
beforeAll(async () => {
  // For example: Run migrations, or seed database if using a test database.
  // Ensure you are using a TEST database URL in your environment!
});

// Teardown after all tests complete
afterAll(async () => {
  // Close database pool to prevent active handles from hanging the test runner
  if (pool) {
    await pool.end();
  }
});

// Run after each individual test
afterEach(() => {
  // Clear all mocks
  vi.clearAllMocks();
});
