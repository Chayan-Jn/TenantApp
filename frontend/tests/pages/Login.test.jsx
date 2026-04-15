import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../src/pages/auth/Login';
import * as authApi from '../../src/api/auth.api.js';

// Mock the API calls
vi.mock('../../src/api/auth.api.js', () => ({
  login: vi.fn(),
  googleLogin: vi.fn(),
}));

// Mock the Google Login container
vi.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }) => (
    <button onClick={() => onSuccess({ credential: 'mock_google_token' })}>
      Mock Google Login
    </button>
  ),
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderLogin = () => render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  it('renders login form elements appropriately', () => {
    renderLogin();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Welcome back');
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles standard login failure', async () => {
    authApi.login.mockRejectedValueOnce(new Error('Invalid username or password'));
    renderLogin();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrong' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
    // Ensure we did not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles standard login success and navigates', async () => {
    authApi.login.mockResolvedValueOnce({});
    renderLogin();

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'correct' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({ username: 'correct', password: 'password' });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles successful Google login', async () => {
    authApi.googleLogin.mockResolvedValueOnce({});
    renderLogin();

    fireEvent.click(screen.getByText('Mock Google Login'));

    await waitFor(() => {
      expect(authApi.googleLogin).toHaveBeenCalledWith('mock_google_token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
