import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Performance monitoring hook
export const usePerformance = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;

    return () => {
      const renderTime = performance.now() - renderStartTime.current;
      
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        const metrics: PerformanceMetrics = {
          renderTime,
          componentName,
          timestamp: Date.now()
        };
        
        console.log(`[Performance] ${componentName}:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: renderCount.current
        });

        // Warn if render time is too high
        if (renderTime > 16) { // 60fps threshold
          console.warn(`[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render (target: <16ms)`);
        }
      }
    };
  });

  return {
    renderCount: renderCount.current
  };
};

// Hook for measuring API call performance
export const useApiPerformance = () => {
  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API Performance] ${operationName}: ${duration.toFixed(2)}ms`);
        
        // Warn if API call is too slow
        if (duration > 1000) {
          console.warn(`[API Performance Warning] ${operationName} took ${duration.toFixed(2)}ms (target: <1000ms)`);
        }
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`[API Performance] ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  };

  return { measureApiCall };
};

// Hook for monitoring memory usage (development only)
export const useMemoryMonitor = (componentName: string) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        if (memory) {
          const usedMB = (memory.usedJSHeapSize / 1048576).toFixed(2);
          const totalMB = (memory.totalJSHeapSize / 1048576).toFixed(2);
          const limitMB = (memory.jsHeapSizeLimit / 1048576).toFixed(2);
          
          console.log(`[Memory] ${componentName}:`, {
            used: `${usedMB}MB`,
            total: `${totalMB}MB`,
            limit: `${limitMB}MB`,
            usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
          });
          
          // Warn if memory usage is high
          if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
            console.warn(`[Memory Warning] ${componentName} using ${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}% of available memory`);
          }
        }
      };
      
      // Check memory on mount
      checkMemory();
      
      // Check memory every 30 seconds
      const interval = setInterval(checkMemory, 30000);
      
      return () => clearInterval(interval);
    }
  }, [componentName]);
};
