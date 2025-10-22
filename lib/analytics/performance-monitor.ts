/**
 * Performance Monitoring Utilities
 * Tracks and reports performance metrics
 */

import { logger } from '@/lib/logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'measure' | 'paint';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.recordMetric({
            name: 'page_load_time',
            value: navEntry.loadEventEnd - navEntry.loadEventStart,
            timestamp: Date.now(),
            type: 'navigation'
          });
        }
      }
    });
    navObserver.observe({ entryTypes: ['navigation'] });
    this.observers.push(navObserver);

    // Resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.recordMetric({
            name: `resource_${entry.name.split('/').pop()}`,
            value: resourceEntry.responseEnd - resourceEntry.requestStart,
            timestamp: Date.now(),
            type: 'resource'
          });
        }
      }
    });
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);

    // Paint timing
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          this.recordMetric({
            name: entry.name,
            value: entry.startTime,
            timestamp: Date.now(),
            type: 'paint'
          });
        }
      }
    });
    paintObserver.observe({ entryTypes: ['paint'] });
    this.observers.push(paintObserver);
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  public measure(name: string, fn: () => void): number {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMetric({
      name,
      value: duration,
      timestamp: Date.now(),
      type: 'measure'
    });

    return duration;
  }

  public async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    this.recordMetric({
      name,
      value: duration,
      timestamp: Date.now(),
      type: 'measure'
    });

    return result;
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name === name);
  }

  public getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  public getCoreWebVitals() {
    const fcp = this.getMetricsByName('first-contentful-paint')[0];
    const lcp = this.getMetricsByName('largest-contentful-paint')[0];
    const fid = this.getMetricsByName('first-input-delay')[0];
    const cls = this.getMetricsByName('cumulative-layout-shift')[0];

    return {
      fcp: fcp?.value || 0,
      lcp: lcp?.value || 0,
      fid: fid?.value || 0,
      cls: cls?.value || 0
    };
  }

  public reportMetrics() {
    const coreWebVitals = this.getCoreWebVitals();
    const avgPageLoad = this.getAverageMetric('page_load_time');
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      logger.info('📊 Performance Metrics:', 'PerformanceMonitor', {
        coreWebVitals,
        averagePageLoad: avgPageLoad,
        totalMetrics: this.metrics.length
      });
    }

    return {
      coreWebVitals,
      averagePageLoad: avgPageLoad,
      totalMetrics: this.metrics.length,
      allMetrics: this.metrics
    };
  }

  public cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    measure: performanceMonitor.measure.bind(performanceMonitor),
    measureAsync: performanceMonitor.measureAsync.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getCoreWebVitals: performanceMonitor.getCoreWebVitals.bind(performanceMonitor),
    reportMetrics: performanceMonitor.reportMetrics.bind(performanceMonitor)
  };
}
