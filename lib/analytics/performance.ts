import { useState, useEffect } from 'react';
import { logger } from './logger';

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  tti: number;
}

export const usePerformanceMonitoring = (): PerformanceMetrics | null => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fcp: 0,
    tti: 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observation not supported:', e);
    }

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        setMetrics(prev => ({ 
          ...prev, 
          fid: entry.processingStart - entry.startTime 
        }));
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observation not supported:', e);
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setMetrics(prev => ({ ...prev, cls: clsValue }));
        }
      });
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observation not supported:', e);
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics(prev => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP observation not supported:', e);
    }

    // Time to First Byte
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
      setMetrics(prev => ({ 
        ...prev, 
        ttfb: navEntry.responseStart - navEntry.requestStart 
      }));
    }

    return () => {
      observer.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  return metrics;
};

// Performance monitoring for development
export const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info('Performance Metrics', 'performance', {
      lcp: `${metrics.lcp.toFixed(0)}ms ${metrics.lcp > 2500 ? '❌' : '✅'}`,
      fid: `${metrics.fid.toFixed(0)}ms ${metrics.fid > 100 ? '❌' : '✅'}`,
      cls: `${metrics.cls.toFixed(3)} ${metrics.cls > 0.1 ? '❌' : '✅'}`,
      fcp: `${metrics.fcp.toFixed(0)}ms ${metrics.fcp > 1800 ? '❌' : '✅'}`,
      ttfb: `${metrics.ttfb.toFixed(0)}ms ${metrics.ttfb > 800 ? '❌' : '✅'}`
    });
  }
};

// Performance budget checker
export const checkPerformanceBudget = (metrics: PerformanceMetrics) => {
  const budgets = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    fcp: 1800,
    ttfb: 800
  };

  const results = {
    lcp: metrics.lcp <= budgets.lcp,
    fid: metrics.fid <= budgets.fid,
    cls: metrics.cls <= budgets.cls,
    fcp: metrics.fcp <= budgets.fcp,
    ttfb: metrics.ttfb <= budgets.ttfb
  };

  const allPassed = Object.values(results).every(Boolean);
  
  return {
    results,
    allPassed,
    score: Object.values(results).filter(Boolean).length / Object.keys(results).length * 100
  };
};

// Memory usage monitoring
export const useMemoryMonitoring = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(performance as any).memory) return;

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      });
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Network performance monitoring
export const useNetworkMonitoring = () => {
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !(navigator as any).connection) return;

    const connection = (navigator as any).connection;
    
    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      });
    };

    updateNetworkInfo();
    connection.addEventListener('change', updateNetworkInfo);

    return () => {
      connection.removeEventListener('change', updateNetworkInfo);
    };
  }, []);

  return networkInfo;
};

// Performance mode detection
export const usePerformanceMode = () => {
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect low-end devices
    const connection = (navigator as any).connection;
    const isSlowConnection = connection && (
      connection.saveData || 
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    );

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Detect hardware concurrency (CPU cores)
    const isLowEndCPU = navigator.hardwareConcurrency <= 2;

    // Detect memory constraints
    const isLowMemory = (performance as any).memory && 
      (performance as any).memory.jsHeapSizeLimit < 1073741824; // 1GB

    setIsLowEnd(isSlowConnection || isLowEndCPU || isLowMemory);
    setReducedMotion(prefersReducedMotion);
  }, []);

  return { isLowEnd, reducedMotion };
};

// Performance tracking utility
export const trackPerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      const duration = end - start;
      logger.debug(`${name}: ${duration.toFixed(2)}ms`, 'performance');
      
      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // gtag('event', 'performance_metric', {
        //   metric_name: name,
        //   metric_value: Math.round(duration)
        // });
      }
    });
  } else {
    const end = performance.now();
    const duration = end - start;
    logger.debug(`${name}: ${duration.toFixed(2)}ms`, 'performance');
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      // gtag('event', 'performance_metric', {
      //   metric_name: name,
      //   metric_value: Math.round(duration)
      // });
    }
  }
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};