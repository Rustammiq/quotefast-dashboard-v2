'use client'

import { useEffect, useState, useRef } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  fps: number
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window === 'undefined') return

      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0
      const renderTime = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      
      // Memory usage (if available)
      const memory = (performance as any).memory
      const memoryUsage = memory ? memory.usedJSHeapSize / 1024 / 1024 : 0

      // Simple FPS calculation with proper cleanup
      let fps = 0
      let lastTime = performance.now()
      let frameCount = 0

      const calculateFPS = () => {
        frameCount++
        const currentTime = performance.now()
        if (currentTime - lastTime >= 1000) {
          fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
          frameCount = 0
          lastTime = currentTime
          
          setMetrics({
            loadTime: Math.round(loadTime),
            renderTime: Math.round(renderTime),
            memoryUsage: Math.round(memoryUsage * 100) / 100,
            fps
          })
        }
        animationFrameRef.current = requestAnimationFrame(calculateFPS)
      }

      calculateFPS()
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  if (!metrics) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono hover:bg-black/90 transition-colors"
      >
        {isVisible ? 'Hide' : 'Perf'}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-black/90 text-white p-3 rounded-lg text-xs font-mono min-w-[200px]">
          <div className="space-y-1">
            <div>Load: {metrics.loadTime}ms</div>
            <div>Render: {metrics.renderTime}ms</div>
            <div>Memory: {metrics.memoryUsage}MB</div>
            <div>FPS: {metrics.fps}</div>
          </div>
        </div>
      )}
    </div>
  )
}
