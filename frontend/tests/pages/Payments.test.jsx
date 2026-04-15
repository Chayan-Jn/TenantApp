import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Payments from '../../src/pages/payments/Payments';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue({ // Base payload
      payments: [
        { id: 1, amount: 2000, tenant_name: 'John Doe', property_name: 'Building A', status: 'paid', due_date: '2025-01-01' }
      ],
      properties: [
        { id: '1', name: 'Building A' }
      ]
    }),
    Link: ({ to, children }) => <a href={to}>{children}</a>
  };
});

const queryClient = new QueryClient();

describe('Payments Page', () => {
  const renderPayments = () => render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Payments />
      </MemoryRouter>
    </QueryClientProvider>
  );

  it('renders the payments table/view properly', () => {
    renderPayments();
    
    // Test base DOM resolution
    expect(screen.getByText('Payments & Ledger')).toBeInTheDocument();
  });
});
