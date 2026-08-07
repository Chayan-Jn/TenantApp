import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useLoaderData } from 'react-router';
import Dashboard from '../../src/pages/dashboard/Dashboard';
import { CURRENCY_SYMBOL } from '../../src/utils/currency';

// Mock react-router components and hooks (Dashboard imports from 'react-router')
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
    Link: ({ to, children, className }) => <a href={to} className={className}>{children}</a>
  };
});
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

// Mock react-icons to speed up tests and avoid SVG issues in JSDOM
vi.mock('react-icons/md', () => ({
  MdOutlineDomain: () => <svg data-testid="icon-domain" />,
  MdOutlineMeetingRoom: () => <svg data-testid="icon-room" />,
  MdOutlinePeopleAlt: () => <svg data-testid="icon-people" />,
  MdOutlineKey: () => <svg data-testid="icon-key" />,
  MdOutlineWarningAmber: () => <svg data-testid="icon-warning" />,
  MdArrowRightAlt: () => <svg data-testid="icon-arrow" />,
  MdOutlineAccountBalanceWallet: () => <svg data-testid="icon-wallet" />
}));

const mockDashboardData = {
  stats: {
    total_properties: 2,
    total_units: 10,
    occupied_units: 8,
    vacant_units: 2,
    overdue_count: 1,
    properties: [
      { id: 1, name: 'Skyline Build', type: 'commercial', total_units: 5, occupied_units: 4 },
      { id: 2, name: 'Ocean PG', type: 'pg', total_units: 5, occupied_units: 4 }
    ],
    financials: {
      collected: 80000,
      pending: 20000,
      total: 100000
    }
  }
};

describe('Dashboard Page', () => {
  const renderDashboard = () => render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

  it('renders loading state when no data', () => {
    useLoaderData.mockReturnValueOnce(null);
    renderDashboard();
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders top stats grid accurately', () => {
    useLoaderData.mockReturnValueOnce(mockDashboardData);
    renderDashboard();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check specific stats values from mock
    expect(screen.getByText('Total Properties')).toBeInTheDocument();
    expect(screen.getAllByText('2')[0]).toBeInTheDocument();

    expect(screen.getByText('Total Units')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Overdue Rent')).toBeInTheDocument();
    expect(screen.getAllByText('1')[0]).toBeInTheDocument(); // The overdue_count value
  });

  it('renders financial snapshot properly', () => {
    useLoaderData.mockReturnValueOnce(mockDashboardData);
    renderDashboard();

    expect(screen.getByText(/Collection Performance/)).toBeInTheDocument();
    expect(screen.getByText(`${CURRENCY_SYMBOL}80,000`)).toBeInTheDocument(); // Collected
    expect(screen.getByText(`${CURRENCY_SYMBOL}20,000`)).toBeInTheDocument(); // Pending
    expect(screen.getByText(/80% Achieved/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Target: \\${CURRENCY_SYMBOL}1,00,000`))).toBeInTheDocument();
  });

  it('renders property overviews correctly categorized', () => {
    useLoaderData.mockReturnValueOnce(mockDashboardData);
    renderDashboard();

    expect(screen.getByText('Skyline Build')).toBeInTheDocument();
    expect(screen.getByText('Ocean PG')).toBeInTheDocument();
    
    // Ensure types are parsed
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('PGs')).toBeInTheDocument();
  });
});
