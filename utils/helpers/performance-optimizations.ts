/**
 * Performance Optimization Utilities
 * Collection of performance optimization functions and hooks
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Memoization utility
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark);
    const end = endMark ? this.marks.get(endMark) : performance.now();
    
    if (start === undefined) {
      console.warn(`Start mark "${startMark}" not found`);
      return 0;
    }
    
    if (end === undefined) {
      console.warn(`End mark "${endMark}" not found`);
      return 0;
    }
    
    const duration = end - start;
    this.measures.set(name, duration);
    return duration;
  }

  getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }
}

// React performance hooks
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
}

export function useMemoizedValue<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
}

// Image optimization
export function optimizeImage(
  src: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // This would integrate with your image optimization service
  // For now, return the original src
  return src;
}

// Bundle size optimization
export function lazyLoad<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

// Memory management
export function cleanupMemory(): void {
  if (typeof window !== 'undefined' && 'gc' in window) {
    (window as any).gc();
  }
}

// Performance metrics collection
export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  bundleSize: number;
  memoryUsage: number;
}

export function collectPerformanceMetrics(): PerformanceMetrics {
  const metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    timeToInteractive: 0,
    bundleSize: 0,
    memoryUsage: 0,
  };

  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metrics.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
    }

    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    });

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }
  }

  return metrics;
}

// Export default performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Import React for hooks
import React, { useState } from 'react';
