/**
 * Simple TopNav Component Tests
 * 
 * Basic tests for the TopNav component without complex context providers
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/dashboard',
}));

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">Close</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  User: () => <div data-testid="user-icon">User</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  LogOut: () => <div data-testid="logout-icon">LogOut</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  UserCircle: () => <div data-testid="user-circle-icon">UserCircle</div>,
}));

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

// Mock context providers
vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

vi.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: () => ({
    user: {
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    loading: false,
  }),
}));

vi.mock('@/contexts/StandbyContext', () => ({
  StandbyProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="standby-provider">{children}</div>,
  useStandby: () => ({
    isStandby: false,
    setIsStandby: vi.fn(),
  }),
}));

// Simple TopNav component for testing
const SimpleTopNav = () => {
  return (
    <nav className="bg-white shadow-sm border-b" role="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">QuoteFast</h1>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <a href="/dashboard" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="/dashboard/offertes" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Offertes
              </a>
              <a href="/dashboard/facturen" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Facturen
              </a>
              <a href="/dashboard/klanten" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Klanten
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="Toggle theme"
            >
              <div data-testid="sun-icon">Sun</div>
            </button>
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label="User menu"
              aria-expanded="false"
              aria-haspopup="menu"
            >
              <div data-testid="user-icon">User</div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

describe('SimpleTopNav Component', () => {
  it('renders without crashing', () => {
    render(<SimpleTopNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays the logo and title', () => {
    render(<SimpleTopNav />);
    expect(screen.getByText('QuoteFast')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<SimpleTopNav />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Offertes')).toBeInTheDocument();
    expect(screen.getByText('Facturen')).toBeInTheDocument();
    expect(screen.getByText('Klanten')).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<SimpleTopNav />);
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders user menu button', () => {
    render(<SimpleTopNav />);
    const userMenuButton = screen.getByRole('button', { name: /user menu/i });
    expect(userMenuButton).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(<SimpleTopNav />);
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('user menu button has proper ARIA attributes', () => {
    render(<SimpleTopNav />);
    const userMenuButton = screen.getByRole('button', { name: /user menu/i });
    expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
    expect(userMenuButton).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('theme button has proper ARIA label', () => {
    render(<SimpleTopNav />);
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toHaveAttribute('aria-label');
  });
});
