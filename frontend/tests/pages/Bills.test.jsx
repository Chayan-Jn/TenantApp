import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Bills from '../../src/pages/bills/Bills';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn().mockReturnValue({ // Base payload
      properties: [
        { id: '1', name: 'Building A' }
      ]
    }),
    Link: ({ to, children }) => <a href={to}>{children}</a>
  };
});

const queryClient = new QueryClient();

describe('Bills Page', () => {
  const renderBills = () => render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Bills />
      </MemoryRouter>
    </QueryClientProvider>
  );

  it('renders the bills table/view strictly with no critical router crashes', () => {
    renderBills();
    
    // We expect the word bills or add bill to exist. Using regex for flexibility.
    expect(screen.getAllByText(/Bills/i)[0]).toBeInTheDocument();
  });
});
