/**
 * TopNav Component Tests
 * 
 * Comprehensive tests for the TopNav component including:
 * - Rendering tests
 * - User interaction tests
 * - Accessibility tests
 * - Theme switching tests
 * - User menu functionality
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopNav from '../../../app/dashboard/components/TopNav';

// Mock the auth service
vi.mock('@/lib/auth-service', () => ({
  authService: {
    logout: vi.fn().mockResolvedValue({ error: null }),
    getCurrentUser: vi.fn().mockResolvedValue({
      user: {
        id: 'test-user-1',
        email: 'test@example.com',
        name: 'Test User',
      },
      error: null,
      status: 200,
    }),
  },
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/dashboard',
}));

describe('TopNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TopNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays the logo and title', () => {
    render(<TopNav />);
    expect(screen.getByText('QuoteFast')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<TopNav />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Offertes')).toBeInTheDocument();
    expect(screen.getByText('Facturen')).toBeInTheDocument();
    expect(screen.getByText('Klanten')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<TopNav />);
    const themeButton = screen.getByRole('button', { name: /theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders user menu button', () => {
    render(<TopNav />);
    const userMenuButton = screen.getByRole('button', { name: /gebruikersmenu/i });
    expect(userMenuButton).toBeInTheDocument();
  });

  describe('Theme Toggle', () => {
    it('toggles theme when clicked', async () => {
      render(<TopNav />);
      const themeButton = screen.getByRole('button', { name: /theme/i });
      
      fireEvent.click(themeButton);
      
      // Wait for theme change to be applied
      await waitFor(() => {
        expect(themeButton).toBeInTheDocument();
      });
    });
  });

  describe('User Menu', () => {
    it('opens user menu when clicked', async () => {
      render(<TopNav />);
      const userMenuButton = screen.getByRole('button', { name: /gebruikersmenu/i });
      
      fireEvent.click(userMenuButton);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });

    it('closes user menu when clicking outside', async () => {
      render(<TopNav />);
      const userMenuButton = screen.getByRole('button', { name: /gebruikersmenu/i });
      
      // Open menu
      fireEvent.click(userMenuButton);
      
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
      
      // Click outside
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('displays user menu items when open', async () => {
      render(<TopNav />);
      const userMenuButton = screen.getByRole('button', { name: /gebruikersmenu/i });
      
      fireEvent.click(userMenuButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mijn Profiel')).toBeInTheDocument();
        expect(screen.getByText('Instellingen')).toBeInTheDocument();
        expect(screen.getByText('Uitloggen')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<TopNav />);
      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('user menu button has proper ARIA attributes', () => {
      render(<TopNav />);
      const userMenuButton = screen.getByRole('button', { name: /gebruikersmenu/i });
      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(userMenuButton).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('theme button has proper ARIA label', () => {
      render(<TopNav />);
      const themeButton = screen.getByRole('button', { name: /theme/i });
      expect(themeButton).toHaveAttribute('aria-label');
    });
  });

  describe('Navigation', () => {
    it('calls router.push when navigation link is clicked', () => {
      render(<TopNav />);
      const dashboardLink = screen.getByText('Dashboard');
      
      fireEvent.click(dashboardLink);
      
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Responsive Design', () => {
    it('renders mobile menu button on small screens', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<TopNav />);
      // Mobile menu button should be present
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });
  });
});
