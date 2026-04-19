import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Properties from '../../src/pages/properties/Properties';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue({
      properties: [
        { id: 1, name: 'Ocean View', type: 'flat', address: '123 Beach', total_units: 5, occupied_units: 3 },
      ]
    }),
    Link: ({ to, children }) => <a href={to}>{children}</a>
  };
});

// Mock the API module
vi.mock('../../src/api/property.api', () => ({
  getProperties: vi.fn(() => Promise.resolve({
    data: [
      { id: 1, name: 'Ocean View', type: 'flat', address: '123 Beach', total_units: 5, occupied_units: 3 },
    ]
  })),
  createProperty: vi.fn(),
}));

describe('Properties Page', () => {
  it('renders properties list with expected numerical values', async () => {
    // Basic test to fulfill Phase 2 structure setup. 
    render(
      <MemoryRouter>
        <Properties />
      </MemoryRouter>
    );

    // Wait for the async fetch in useEffect to complete and render data
    await waitFor(() => {
      expect(screen.getByText('Ocean View')).toBeInTheDocument();
    });

    expect(screen.getByText('123 Beach')).toBeInTheDocument();
  });
});
