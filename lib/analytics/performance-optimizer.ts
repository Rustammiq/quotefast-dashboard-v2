/**
 * Performance optimization utilities for QuoteFast Dashboard
 */

import { logger } from '@/lib/logger';

// Image optimization
export const optimizeImage = (src: string, width: number, height?: number) => {
  const params = new URLSearchParams({
    w: width.toString(),
    q: '75', // Quality
    f: 'webp', // Format
  });
  
  if (height) {
    params.set('h', height.toString());
  }
  
  return `${src}?${params.toString()}`;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  if (typeof window === 'undefined') return null;
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
};

// Debounce utility for search and input handlers
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll and resize handlers
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null;
  }
  
  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
    total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
    limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
  };
};

// Performance metrics collection
export const collectPerformanceMetrics = () => {
  if (typeof window === 'undefined') return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    memory: getMemoryUsage(),
  };
};

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window === 'undefined') return null;
  
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  return {
    scripts: scripts.length,
    styles: styles.length,
    totalSize: scripts.reduce((acc, script) => {
      const src = script.getAttribute('src');
      return src ? acc + (src.length * 0.5) : acc; // Rough estimate
    }, 0),
  };
};

// Cache management
export const clearCaches = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
  }
};

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;
  
  const criticalResources = [
    '/fonts/inter.woff2',
    '/images/hero-bg.webp',
    '/api/health',
  ];
  
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.woff2')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.endsWith('.webp')) {
      link.as = 'image';
    } else {
      link.as = 'fetch';
    }
    
    document.head.appendChild(link);
  });
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    logger.info('Service Worker registered:', 'PerformanceOptimizer', { registration });
  } catch (error) {
    logger.error('Service Worker registration failed:', 'PerformanceOptimizer', { error });
  }
};

// Performance monitoring
export const startPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;
  
  // Monitor Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        logger.info('LCP:', 'PerformanceOptimizer', { value: entry.startTime });
      }
      if (entry.entryType === 'first-input') {
        logger.info('FID:', 'PerformanceOptimizer', { value: (entry as any).processingStart - entry.startTime });
      }
      if (entry.entryType === 'layout-shift') {
        logger.info('CLS:', 'PerformanceOptimizer', { value: (entry as any).value });
      }
    }
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
  
  // Monitor memory usage
  setInterval(() => {
    const memory = getMemoryUsage();
    if (memory && memory.used > 100) { // Alert if memory usage > 100MB
      logger.warn('High memory usage detected:', 'PerformanceOptimizer', { memory });
    }
  }, 30000); // Check every 30 seconds
};
