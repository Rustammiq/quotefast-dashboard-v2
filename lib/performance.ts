// Enhanced Performance Monitoring and Optimization for QuoteFast Dashboard
// Comprehensive performance tracking, Core Web Vitals monitoring, and optimization utilities

import { useState, useEffect, useCallback, useMemo } from 'react';
import { logger } from './logger';

// Performance metrics interfaces
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  
  // Custom metrics
  renderTime: number | null;
  bundleSize: number | null;
  memoryUsage: number | null;
  networkLatency: number | null;
  
  // Timestamps
  timestamp: string;
  url: string;
  userAgent: string;
}

export interface PerformanceThresholds {
  lcp: number; // 2.5s
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1.8s
  ttfb: number; // 600ms
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  thresholds: PerformanceThresholds;
  score: number; // 0-100
  recommendations: string[];
  isOptimal: boolean;
}

// Default performance thresholds (Core Web Vitals)
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  lcp: 2500, // 2.5 seconds
  fid: 100,  // 100 milliseconds
  cls: 0.1,  // 0.1
  fcp: 1800, // 1.8 seconds
  ttfb: 600  // 600 milliseconds
};

// Performance monitoring class
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics | null = null;
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      this.setupCoreWebVitals();
      this.setupCustomMetrics();
      this.setupMemoryMonitoring();
      this.setupNetworkMonitoring();
      
      this.isInitialized = true;
      logger.info('Performance monitoring initialized', 'performance');
    } catch (error) {
      logger.error('Failed to initialize performance monitoring', 'performance', error);
    }
  }

  private setupCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      
      if (this.metrics) {
        this.metrics.lcp = lastEntry.startTime;
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (this.metrics) {
          this.metrics.fid = entry.processingStart - entry.startTime;
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          if (this.metrics) {
            this.metrics.cls = clsValue;
          }
        }
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry && this.metrics) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(fcpObserver);
  }

  private setupCustomMetrics(): void {
    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry && this.metrics) {
      this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Bundle size estimation
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && !src.includes('data:')) {
        // Estimate size based on URL patterns
        totalSize += 50000; // Rough estimate
      }
    });
    
    if (this.metrics) {
      this.metrics.bundleSize = totalSize;
    }
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (this.metrics) {
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }
    }
  }

  private setupNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (this.metrics) {
        this.metrics.networkLatency = connection.rtt || 0;
      }
    }
  }

  public getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  public generateReport(thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS): PerformanceReport {
    if (!this.metrics) {
      throw new Error('No performance metrics available');
    }

    const recommendations: string[] = [];
    let score = 100;

    // LCP scoring
    if (this.metrics.lcp && this.metrics.lcp > thresholds.lcp) {
      score -= 20;
      recommendations.push(`LCP is ${this.metrics.lcp.toFixed(0)}ms (threshold: ${thresholds.lcp}ms). Optimize images and reduce render-blocking resources.`);
    }

    // FID scoring
    if (this.metrics.fid && this.metrics.fid > thresholds.fid) {
      score -= 20;
      recommendations.push(`FID is ${this.metrics.fid.toFixed(0)}ms (threshold: ${thresholds.fid}ms). Reduce JavaScript execution time.`);
    }

    // CLS scoring
    if (this.metrics.cls && this.metrics.cls > thresholds.cls) {
      score -= 20;
      recommendations.push(`CLS is ${this.metrics.cls.toFixed(3)} (threshold: ${thresholds.cls}). Reserve space for dynamic content.`);
    }

    // FCP scoring
    if (this.metrics.fcp && this.metrics.fcp > thresholds.fcp) {
      score -= 15;
      recommendations.push(`FCP is ${this.metrics.fcp.toFixed(0)}ms (threshold: ${thresholds.fcp}ms). Optimize critical rendering path.`);
    }

    // TTFB scoring
    if (this.metrics.ttfb && this.metrics.ttfb > thresholds.ttfb) {
      score -= 15;
      recommendations.push(`TTFB is ${this.metrics.ttfb.toFixed(0)}ms (threshold: ${thresholds.ttfb}ms). Optimize server response time.`);
    }

    // Bundle size recommendations
    if (this.metrics.bundleSize && this.metrics.bundleSize > 500000) { // 500KB
      recommendations.push(`Bundle size is ${(this.metrics.bundleSize / 1024).toFixed(0)}KB. Consider code splitting and lazy loading.`);
    }

    // Memory usage recommendations
    if (this.metrics.memoryUsage && this.metrics.memoryUsage > 50) { // 50MB
      recommendations.push(`Memory usage is ${this.metrics.memoryUsage.toFixed(0)}MB. Check for memory leaks.`);
    }

    return {
      metrics: this.metrics,
      thresholds,
      score: Math.max(0, score),
      recommendations,
      isOptimal: score >= 80
    };
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// React hooks for performance monitoring
export const usePerformanceMetrics = (): PerformanceMetrics | null => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    
    // Get initial metrics
    const initialMetrics = monitor.getMetrics();
    if (initialMetrics) {
      setMetrics(initialMetrics);
    }

    // Update metrics periodically
    const interval = setInterval(() => {
      const currentMetrics = monitor.getMetrics();
      if (currentMetrics) {
        setMetrics(currentMetrics);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const usePerformanceReport = (thresholds?: PerformanceThresholds): PerformanceReport | null => {
  const [report, setReport] = useState<PerformanceReport | null>(null);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    
    try {
      const performanceReport = monitor.generateReport(thresholds);
      setReport(performanceReport);
    } catch (error) {
      logger.error('Failed to generate performance report', 'performance', error);
    }
  }, [thresholds]);

  return report;
};

// Performance optimization utilities
export const measurePerformance = (name: string, fn: () => void): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  logger.info(`Performance measurement: ${name}`, 'performance', { duration });
  
  return duration;
};

export const measureAsyncPerformance = async <T>(
  name: string, 
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  const duration = end - start;
  
  logger.info(`Async performance measurement: ${name}`, 'performance', { duration });
  
  return { result, duration };
};

export const usePerformanceMode = (): boolean => {
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check device capabilities
    const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
    // Check connection speed
    const isSlowConnection = 'connection' in navigator && 
      (navigator as any).connection?.effectiveType === 'slow-2g' || 
      (navigator as any).connection?.effectiveType === '2g';
    
    setIsPerformanceMode(prefersReducedMotion || isLowEndDevice || isSlowConnection);
  }, []);

  return isPerformanceMode;
};

// Enhanced debounce with performance tracking
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean; maxWait?: number } = {}
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  let maxTimeout: NodeJS.Timeout;
  let lastCallTime = 0;
  let lastInvokeTime = 0;

  const invokeFunc = (...args: Parameters<T>) => {
    lastInvokeTime = Date.now();
    func(...args);
  };

  return (...args: Parameters<T>) => {
    const now = Date.now();
    lastCallTime = now;

    if (options.leading && now - lastInvokeTime > wait) {
      invokeFunc(...args);
    }

    clearTimeout(timeout);
    clearTimeout(maxTimeout);

    timeout = setTimeout(() => {
      if (options.trailing !== false) {
        invokeFunc(...args);
      }
    }, wait);

    if (options.maxWait && !maxTimeout) {
      maxTimeout = setTimeout(() => {
        invokeFunc(...args);
      }, options.maxWait);
    }
  };
};

// Enhanced throttle with performance tracking
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (!inThrottle || (options.trailing && now - lastCallTime >= limit)) {
      if (options.leading !== false) {
        func(...args);
      }
      inThrottle = true;
      lastCallTime = now;
      
      setTimeout(() => {
        inThrottle = false;
        if (options.trailing) {
          func(...args);
        }
      }, limit);
    }
  };
};

// Memoization utilities
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T => {
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
};

// Bundle size analyzer
export const analyzeBundleSize = (): { scripts: number; styles: number; total: number } => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  let scriptSize = 0;
  let styleSize = 0;
  
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src && !src.includes('data:')) {
      scriptSize += 50000; // Rough estimate
    }
  });
  
  styles.forEach((style) => {
    const href = style.getAttribute('href');
    if (href && !href.includes('data:')) {
      styleSize += 10000; // Rough estimate
    }
  });
  
  return {
    scripts: scriptSize,
    styles: styleSize,
    total: scriptSize + styleSize
  };
};

// Performance recommendations generator
export const generatePerformanceRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.lcp && metrics.lcp > 2500) {
    recommendations.push('Optimize images with WebP format and lazy loading');
    recommendations.push('Reduce render-blocking CSS and JavaScript');
    recommendations.push('Implement critical CSS inlining');
  }
  
  if (metrics.fid && metrics.fid > 100) {
    recommendations.push('Split large JavaScript bundles');
    recommendations.push('Use Web Workers for heavy computations');
    recommendations.push('Implement code splitting with dynamic imports');
  }
  
  if (metrics.cls && metrics.cls > 0.1) {
    recommendations.push('Reserve space for dynamic content');
    recommendations.push('Avoid inserting content above existing content');
    recommendations.push('Use aspect-ratio CSS property for images');
  }
  
  if (metrics.bundleSize && metrics.bundleSize > 500000) {
    recommendations.push('Implement tree shaking to remove unused code');
    recommendations.push('Use dynamic imports for route-based code splitting');
    recommendations.push('Optimize third-party library usage');
  }
  
  if (metrics.memoryUsage && metrics.memoryUsage > 50) {
    recommendations.push('Check for memory leaks in event listeners');
    recommendations.push('Implement proper cleanup in useEffect hooks');
    recommendations.push('Use WeakMap/WeakSet for object references');
  }
  
  return recommendations;
};

// Export default instance
export default PerformanceMonitor.getInstance();
