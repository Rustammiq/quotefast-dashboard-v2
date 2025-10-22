import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider  } from '../../contexts/ThemeContext';
import { AuthProvider  } from '../../contexts/AuthContext';
import { StandbyProvider  } from '../../contexts/StandbyContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StandbyProvider>{children}</StandbyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  company: 'Test Company',
  subscription: {
    plan: 'pro',
    status: 'active',
    expiresAt: '2025-12-31T23:59:59Z',
  },
  ...overrides,
});

export const createMockCustomer = (overrides = {}) => ({
  id: 'customer-1',
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '+31 20 123 4567',
  company: 'Customer Company',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockInvoice = (overrides = {}) => ({
  id: 'INV-2024-001',
  invoiceNumber: '2024-001',
  customerName: 'Test Customer',
  customerEmail: 'customer@example.com',
  client: 'Test Customer',
  description: 'Test Invoice',
  amount: 1000,
  total: 1210,
  status: 'draft',
  dueDate: '2024-02-01',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  items: [
    {
      id: 'item-1',
      description: 'Test Item',
      quantity: 1,
      price: 1000,
      total: 1000,
    },
  ],
  notes: 'Test notes',
  taxRate: 21,
  subtotal: 1000,
  taxAmount: 210,
  ...overrides,
});

// Accessibility testing helpers
export const getByRole = (container: HTMLElement, role: string) => {
  return container.querySelector(`[role="${role}"]`);
};

export const getAllByRole = (container: HTMLElement, role: string) => {
  return container.querySelectorAll(`[role="${role}"]`);
};

export const getByLabelText = (container: HTMLElement, label: string) => {
  return container.querySelector(`[aria-label="${label}"]`);
};

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  const end = performance.now();
  return end - start;
};

// Mock functions
export const createMockFunction = () => vi.fn();

// Wait utilities
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
