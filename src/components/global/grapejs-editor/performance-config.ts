/**
 * Performance Configuration for GrapesJS Editor
 * 
 * This module contains all performance-related configurations and utilities
 * to ensure smooth operation even with many elements and long sessions.
 */

export const PERFORMANCE_CONFIG = {
    // Debounce delays (in milliseconds)
    DEBOUNCE: {
        SAVE: 1000,           // Auto-save debounce
        STYLE_UPDATE: 300,    // Style panel updates
        CANVAS_ZOOM: 150,     // Canvas zoom recalculation
        COMPONENT_UPDATE: 100, // Component property updates
    },

    // Throttle delays (in milliseconds)
    THROTTLE: {
        SCROLL: 16,           // ~60fps
        RESIZE: 16,           // ~60fps
        MOUSE_MOVE: 16,       // ~60fps
    },

    // Memory management
    MEMORY: {
        MAX_UNDO_STEPS: 50,   // Limit undo history
        CLEANUP_INTERVAL: 60000, // Clean up every minute
        IMAGE_CACHE_SIZE: 50, // Max cached images
    },

    // Rendering optimizations
    RENDER: {
        BATCH_SIZE: 20,       // Number of components to render per batch
        LAZY_LOAD_THRESHOLD: 100, // Start lazy loading after this many elements
        VIRTUAL_SCROLL_BUFFER: 5, // Number of off-screen items to keep rendered
    },

    // GrapesJS specific
    GRAPESJS: {
        AVOID_INLINE_STYLE: false, // Keep inline styles for performance
        AVOID_FRAME_OFFSET: true,  // Reduce layout calculations
        NOTIFY_ON_CHANGES: false,  // Disable unnecessary notifications
        SHOW_OFFSETS: false,       // Hide offset indicators for performance
    }
}

/**
 * Debounce function - delays execution until after wait time has elapsed
 * since the last invocation
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

/**
 * Throttle function - ensures function is called at most once per wait period
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false
    let lastResult: ReturnType<T>

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            lastResult = func(...args)
            inThrottle = true
            setTimeout(() => {
                inThrottle = false
            }, wait)
        }
        return lastResult
    }
}

/**
 * Request Animation Frame wrapper for smooth animations
 */
export function rafThrottle<T extends (...args: any[]) => any>(
    func: T
): (...args: Parameters<T>) => void {
    let rafId: number | null = null

    return function executedFunction(...args: Parameters<T>) {
        if (rafId) {
            cancelAnimationFrame(rafId)
        }

        rafId = requestAnimationFrame(() => {
            func(...args)
            rafId = null
        })
    }
}

/**
 * Memory cleanup utilities
 */
export class MemoryManager {
    private static cleanupCallbacks: Set<() => void> = new Set()
    private static cleanupInterval: NodeJS.Timeout | null = null

    static registerCleanup(callback: () => void) {
        this.cleanupCallbacks.add(callback)

        // Start cleanup interval if not already running
        if (!this.cleanupInterval) {
            this.cleanupInterval = setInterval(() => {
                this.runCleanup()
            }, PERFORMANCE_CONFIG.MEMORY.CLEANUP_INTERVAL)
        }
    }

    static unregisterCleanup(callback: () => void) {
        this.cleanupCallbacks.delete(callback)

        // Stop interval if no callbacks remain
        if (this.cleanupCallbacks.size === 0 && this.cleanupInterval) {
            clearInterval(this.cleanupInterval)
            this.cleanupInterval = null
        }
    }

    static runCleanup() {
        console.log('[MemoryManager] Running cleanup...')
        this.cleanupCallbacks.forEach(callback => {
            try {
                callback()
            } catch (error) {
                console.error('[MemoryManager] Cleanup error:', error)
            }
        })
    }

    static destroy() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval)
            this.cleanupInterval = null
        }
        this.cleanupCallbacks.clear()
    }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
    private static metrics: Map<string, number[]> = new Map()

    static mark(label: string) {
        if (typeof performance !== 'undefined') {
            performance.mark(label)
        }
    }

    static measure(name: string, startMark: string, endMark: string) {
        if (typeof performance !== 'undefined') {
            try {
                performance.measure(name, startMark, endMark)
                const measure = performance.getEntriesByName(name)[0]

                if (measure) {
                    const times = this.metrics.get(name) || []
                    times.push(measure.duration)

                    // Keep only last 100 measurements
                    if (times.length > 100) {
                        times.shift()
                    }

                    this.metrics.set(name, times)
                }
            } catch (error) {
                // Silently fail if marks don't exist
            }
        }
    }

    static getAverageTime(name: string): number | null {
        const times = this.metrics.get(name)
        if (!times || times.length === 0) return null

        const sum = times.reduce((a, b) => a + b, 0)
        return sum / times.length
    }

    static logMetrics() {
        console.group('[Performance Metrics]')
        this.metrics.forEach((times, name) => {
            const avg = times.reduce((a, b) => a + b, 0) / times.length
            console.log(`${name}: ${avg.toFixed(2)}ms (avg over ${times.length} samples)`)
        })
        console.groupEnd()
    }

    static clear() {
        this.metrics.clear()
        if (typeof performance !== 'undefined') {
            performance.clearMarks()
            performance.clearMeasures()
        }
    }
}
