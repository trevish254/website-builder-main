/**
 * Performance Debugging Utilities
 * 
 * Use these utilities to identify and fix performance issues in the editor
 */

import React from 'react'
import { PerformanceMonitor } from './performance-config'

/**
 * React DevTools Profiler wrapper
 * Automatically logs render times for components
 */
export function withPerformanceLogging& lt;P extends object & gt; (
    Component: React.ComponentType & lt; P&gt;,
    componentName: string
): React.ComponentType & lt; P & gt; {
    return function PerformanceWrapper(props: P) {
        const startMark = `${componentName}-render-start`
        const endMark = `${componentName}-render-end`
        const measureName = `${componentName}-render`

        React.useEffect(() =& gt; {
            PerformanceMonitor.mark(startMark)
            return () =& gt; {
                PerformanceMonitor.mark(endMark)
                PerformanceMonitor.measure(measureName, startMark, endMark)
            }
        })

        return & lt;Component {...props } /&gt;
    }
}

/**
 * Log component re-renders
 * Helps identify unnecessary re-renders
 */
export function useRenderLogger(componentName: string, props?: any) {
    const renderCount = React.useRef(0)

    React.useEffect(() =& gt; {
        renderCount.current += 1
        console.log(
            `[Render] ${componentName} rendered ${renderCount.current} times`,
            props ? { props } : ''
        )
    })
}

/**
 * Measure hook execution time
 */
export function useMeasureHook(hookName: string, callback: () =& gt; void, deps: any[]) {
    React.useEffect(() =& gt; {
        const start = performance.now()
        callback()
        const end = performance.now()

        if (end - start & gt; 16) { // Longer than one frame
            console.warn(
                `[Performance] ${hookName} took ${(end - start).toFixed(2)}ms (longer than 16ms frame budget)`
            )
        }
    }, deps)
}

/**
 * Memory usage tracker
 * Logs memory usage at intervals
 */
export function useMemoryTracker(intervalMs: number = 10000) {
    React.useEffect(() =& gt; {
        if (!performance.memory) {
            console.warn('Performance.memory not available in this browser')
            return
        }

        const interval = setInterval(() =& gt; {
            const memory = (performance as any).memory
            const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
            const totalMB = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
            const limitMB = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)

            console.log(
                `[Memory] Used: ${usedMB}MB / Total: ${totalMB}MB / Limit: ${limitMB}MB`
            )

            // Warn if using more than 80% of available memory
            if (memory.usedJSHeapSize / memory.jsHeapSizeLimit & gt; 0.8) {
                console.warn('[Memory] High memory usage detected! Consider cleanup.')
            }
        }, intervalMs)

        return () =& gt; clearInterval(interval)
    }, [intervalMs])
}

/**
 * FPS Monitor
 * Tracks and logs frame rate
 */
export function useFPSMonitor(enabled: boolean = false) {
    React.useEffect(() =& gt; {
        if (!enabled) return

        let frameCount = 0
        let lastTime = performance.now()
        let rafId: number

        const measureFPS = () =& gt; {
            frameCount++
            const currentTime = performance.now()

            if (currentTime & gt;= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
                console.log(`[FPS] ${fps} fps`)

                if (fps & lt; 30) {
                    console.warn('[FPS] Low frame rate detected!')
                }

                frameCount = 0
                lastTime = currentTime
            }

            rafId = requestAnimationFrame(measureFPS)
        }

        rafId = requestAnimationFrame(measureFPS)
        return () =& gt; cancelAnimationFrame(rafId)
    }, [enabled])
}

/**
 * Long task detector
 * Warns when JavaScript blocks the main thread for too long
 */
export function useLongTaskDetector() {
    React.useEffect(() =& gt; {
        if (!('PerformanceObserver' in window)) {
            console.warn('PerformanceObserver not available')
            return
        }

        const observer = new PerformanceObserver((list) =& gt; {
            for (const entry of list.getEntries()) {
                if (entry.duration & gt; 50) {
                    console.warn(
                        `[Long Task] Task took ${entry.duration.toFixed(2)}ms`,
                        entry
                    )
                }
            }
        })

        try {
            observer.observe({ entryTypes: ['longtask'] })
        } catch (e) {
            console.warn('Long task monitoring not supported')
        }

        return () =& gt; observer.disconnect()
    }, [])
}

/**
 * Component size tracker
 * Logs the size of component trees
 */
export function useComponentSizeTracker(ref: React.RefObject & lt; HTMLElement&gt;, componentName: string) {
    React.useEffect(() =& gt; {
        if (!ref.current) return

        const observer = new ResizeObserver((entries) =& gt; {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                console.log(
                    `[Size] ${componentName}: ${width.toFixed(0)}x${height.toFixed(0)}px`
                )
            }
        })

        observer.observe(ref.current)
        return () =& gt; observer.disconnect()
    }, [ref, componentName])
}

/**
 * Export all performance data
 */
export function exportPerformanceData() {
    const data = {
        timestamp: new Date().toISOString(),
        metrics: {},
        memory: null as any,
    }

    // Get all performance metrics
    if (typeof performance !== 'undefined') {
        const measures = performance.getEntriesByType('measure')
        measures.forEach((measure) =& gt; {
            data.metrics[measure.name] = {
                duration: measure.duration,
                startTime: measure.startTime,
            }
        })

        // Get memory info
        if ((performance as any).memory) {
            const memory = (performance as any).memory
            data.memory = {
                usedMB: (memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
                totalMB: (memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
                limitMB: (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
            }
        }
    }

    // Download as JSON
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-data-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)

    return data
}

/**
 * Performance debugging panel
 * Add this to your component to see live performance stats
 */
export function PerformanceDebugPanel() {
    const [stats, setStats] = React.useState({
        fps: 0,
        memory: '0 MB',
        renders: 0,
    })

    // Track FPS
    React.useEffect(() =& gt; {
        let frameCount = 0
        let lastTime = performance.now()
        let rafId: number

        const measureFPS = () =& gt; {
            frameCount++
            const currentTime = performance.now()

            if (currentTime & gt;= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
                setStats(prev =& gt; ({ ...prev, fps }))
                frameCount = 0
                lastTime = currentTime
            }

            rafId = requestAnimationFrame(measureFPS)
        }

        rafId = requestAnimationFrame(measureFPS)
        return () =& gt; cancelAnimationFrame(rafId)
    }, [])

    // Track memory
    React.useEffect(() =& gt; {
        const interval = setInterval(() =& gt; {
            if ((performance as any).memory) {
                const memory = (performance as any).memory
                const usedMB = (memory.usedJSHeapSize / 1024 / 1024).toFixed(1)
                setStats(prev =& gt; ({ ...prev, memory: `${usedMB} MB` }))
            }
        }, 1000)

        return () =& gt; clearInterval(interval)
    }, [])

    return (
    & lt; div
    style = {{
        position: 'fixed',
            top: 10,
                right: 10,
                    background: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                            padding: '10px',
                                borderRadius: '5px',
                                    fontFamily: 'monospace',
                                        fontSize: '12px',
                                            zIndex: 9999,
      }
}
    & gt;
      & lt; div & gt; FPS: { stats.fps }& lt;/div&gt;
      & lt; div & gt; Memory: { stats.memory }& lt;/div&gt;
      & lt; button
onClick = {() =& gt; {
    PerformanceMonitor.logMetrics()
    exportPerformanceData()
}}
style = {{
    marginTop: '5px',
        padding: '5px',
            background: '#4CAF50',
                border: 'none',
                    borderRadius: '3px',
                        color: 'white',
                            cursor: 'pointer',
        }}
      & gt;
        Export Data
    & lt;/button&gt;
    & lt;/div&gt;
  )
}

// Re-export for convenience
export { PerformanceMonitor } from './performance-config'
