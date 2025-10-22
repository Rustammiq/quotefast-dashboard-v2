// Test setup file for QuoteFast Dashboard
// Global test configuration and utilities

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Next.js link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      maybeSingle: jest.fn(),
    })),
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
process.env.EMAIL_PROVIDER = 'mock';
process.env.EMAIL_FROM = 'test@quotefast.nl';
process.env.EMAIL_FROM_NAME = 'QuoteFast Test';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => []),
    getEntriesByName: jest.fn(() => []),
    mark: jest.fn(),
    measure: jest.fn(),
    memory: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50MB
      totalJSHeapSize: 100 * 1024 * 1024, // 100MB
      jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
    },
  },
});

// Mock navigator
Object.defineProperty(navigator, 'userAgent', {
  writable: true,
  value: 'Mozilla/5.0 (compatible; TestAgent/1.0)',
});

Object.defineProperty(navigator, 'hardwareConcurrency', {
  writable: true,
  value: 8,
});

Object.defineProperty(navigator, 'connection', {
  writable: true,
  value: {
    effectiveType: '4g',
    rtt: 100,
    downlink: 10,
  },
});

// Mock crypto
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123'),
    getRandomValues: jest.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
});

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
        args[0].includes('componentWillMount'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveTextContent(text: string): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveDisplayValue(value: string | string[]): R;
      toHaveAccessibleDescription(description?: string): R;
      toHaveAccessibleName(name?: string): R;
    }
  }
}

// Custom matchers for QuoteFast specific testing
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    return {
      message: () =>
        pass
          ? `Expected ${received} not to be a valid email`
          : `Expected ${received} to be a valid email`,
      pass,
    };
  },
  
  toBeValidUrl(received: string) {
    try {
      new URL(received);
      return {
        message: () => `Expected ${received} not to be a valid URL`,
        pass: true,
      };
    } catch {
      return {
        message: () => `Expected ${received} to be a valid URL`,
        pass: false,
      };
    }
  },
  
  toBeValidDate(received: string | Date) {
    const date = new Date(received);
    const pass = !isNaN(date.getTime());
    
    return {
      message: () =>
        pass
          ? `Expected ${received} not to be a valid date`
          : `Expected ${received} to be a valid date`,
      pass,
    };
  },
});

// Export test utilities
export const testUtils = {
  // Mock user data
  mockUser: {
    id: 'test-user-123',
    email: 'test@quotefast.nl',
    name: 'Test User',
    companyName: 'Test Company',
    userType: 'small-business',
    industry: 'it',
    teamSize: '6-20',
  },
  
  // Mock onboarding data
  mockOnboardingData: {
    step: 1,
    completed: false,
    userType: 'small-business',
    industry: 'it',
    teamSize: '6-20',
    goals: [],
    usageGoals: ['offertes', 'factureren'],
    aiFeatureInterests: ['ai-offerte-generator'],
    workflowPreferences: {
      automationLevel: 'gemiddeld',
      integrationNeeds: ['email', 'boekhouding'],
      reportingFrequency: 'wekelijks',
    },
    preferences: {
      theme: 'system',
      notifications: true,
      language: 'nl',
      timezone: 'Europe/Amsterdam',
    },
    progress: {
      stepsCompleted: [],
      lastUpdated: new Date().toISOString(),
      timeSpent: 0,
    },
    analytics: {
      onboardingStartTime: new Date().toISOString(),
      skippedSteps: [],
      helpRequests: 0,
    },
  },
  
  // Mock performance metrics
  mockPerformanceMetrics: {
    lcp: 1500,
    fid: 50,
    cls: 0.05,
    fcp: 1200,
    ttfb: 300,
    renderTime: 100,
    bundleSize: 200000,
    memoryUsage: 30,
    networkLatency: 50,
    timestamp: new Date().toISOString(),
    url: 'http://localhost:3000',
    userAgent: 'Mozilla/5.0 (compatible; TestAgent/1.0)',
  },
  
  // Mock API responses
  mockApiResponse: <T>(data: T, success = true) => ({
    success,
    data: success ? data : undefined,
    error: success ? undefined : 'Test error',
  }),
  
  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock localStorage with data
  mockLocalStorage: (data: Record<string, any>) => {
    Object.keys(data).forEach(key => {
      localStorageMock.getItem.mockImplementation((k: string) => 
        k === key ? JSON.stringify(data[key]) : null
      );
    });
  },
  
  // Clear all mocks
  clearAllMocks: () => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  },
};

// Global test helpers
global.testUtils = testUtils;
