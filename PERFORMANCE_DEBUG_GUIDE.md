# Performance Debugging Guide

## Quick Start

The website editor now includes comprehensive performance optimizations and debugging tools.

## Using the Performance Debug Panel

To see live performance stats while editing, add the debug panel to your editor:

```tsx
import { PerformanceDebugPanel } from '@/components/global/grapejs-editor/performance-debug'

// In your editor component
function MyEditor() {
  return (
    &lt;&gt;
      {/* Your editor content */}
      
      {/* Add this for live performance stats */}
      {process.env.NODE_ENV === 'development' &amp;&amp; &lt;PerformanceDebugPanel /&gt;}
    &lt;/&gt;
  )
}
```

This will show:
- **FPS**: Current frame rate (should be 60fps)
- **Memory**: Current memory usage
- **Export Button**: Download detailed performance data

## Debugging Slow Components

### 1. Log Component Renders

```tsx
import { useRenderLogger } from '@/components/global/grapejs-editor/performance-debug'

function MyComponent(props) {
  // This will log every time the component renders
  useRenderLogger('MyComponent', props)
  
  return &lt;div&gt;...&lt;/div&gt;
}
```

**What to look for**:
- Components rendering more than expected
- Renders happening when props haven't changed

### 2. Track Memory Usage

```tsx
import { useMemoryTracker } from '@/components/global/grapejs-editor/performance-debug'

function EditorPage() {
  // Logs memory usage every 10 seconds
  useMemoryTracker(10000)
  
  return &lt;Editor /&gt;
}
```

**What to look for**:
- Memory continuously growing (indicates leak)
- Warnings about high memory usage

### 3. Monitor FPS

```tsx
import { useFPSMonitor } from '@/components/global/grapejs-editor/performance-debug'

function EditorCanvas() {
  // Enable FPS monitoring
  useFPSMonitor(true)
  
  return &lt;Canvas /&gt;
}
```

**What to look for**:
- FPS dropping below 30 (indicates performance issue)
- FPS drops during specific interactions

### 4. Detect Long Tasks

```tsx
import { useLongTaskDetector } from '@/components/global/grapejs-editor/performance-debug'

function App() {
  // Warns when JavaScript blocks for &gt;50ms
  useLongTaskDetector()
  
  return &lt;YourApp /&gt;
}
```

**What to look for**:
- Tasks taking longer than 50ms
- Specific operations causing blocks

## Performance Metrics

### View All Metrics

```tsx
import { PerformanceMonitor } from '@/components/global/grapejs-editor/performance-config'

// In browser console or component
PerformanceMonitor.logMetrics()
```

This shows average times for all measured operations.

### Measure Custom Operations

```tsx
import { PerformanceMonitor } from '@/components/global/grapejs-editor/performance-config'

function expensiveOperation() {
  PerformanceMonitor.mark('operation-start')
  
  // Your expensive code here
  
  PerformanceMonitor.mark('operation-end')
  PerformanceMonitor.measure('my-operation', 'operation-start', 'operation-end')
}
```

## Common Performance Issues

### Issue: Component Re-rendering Too Often

**Symptoms**:
- Lag when typing or dragging
- useRenderLogger shows many renders

**Solution**:
```tsx
// Wrap with React.memo
export default React.memo(MyComponent)

// Or with custom comparison
export default React.memo(MyComponent, (prev, next) =&gt; {
  return prev.id === next.id &amp;&amp; prev.data === next.data
})
```

### Issue: Memory Growing Over Time

**Symptoms**:
- useMemoryTracker shows increasing memory
- Editor slows down after 30+ minutes

**Solution**:
```tsx
// Ensure cleanup in useEffect
useEffect(() =&gt; {
  const subscription = subscribe()
  
  return () =&gt; {
    subscription.unsubscribe() // Always cleanup!
  }
}, [])
```

### Issue: Slow Event Handlers

**Symptoms**:
- useLongTaskDetector shows warnings
- Lag during interactions

**Solution**:
```tsx
import { debounce } from '@/components/global/grapejs-editor/performance-config'

// Debounce expensive operations
const debouncedSave = debounce(saveFunction, 1000)

// Or throttle frequent events
const throttledScroll = throttle(handleScroll, 16)
```

### Issue: Stuttering During Resize

**Symptoms**:
- FPS drops during window resize
- Choppy animations

**Solution**:
```tsx
import { rafThrottle } from '@/components/global/grapejs-editor/performance-config'

// Use RAF throttle for smooth 60fps
const handleResize = rafThrottle(() =&gt; {
  // Your resize logic
})
```

## Browser DevTools

### Performance Tab

1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with editor
5. Stop recording
6. Look for:
   - Long tasks (yellow/red bars)
   - Layout thrashing
   - Excessive re-renders

### Memory Tab

1. Open DevTools (F12)
2. Go to Memory tab
3. Take heap snapshot
4. Interact with editor
5. Take another snapshot
6. Compare to find leaks

### React DevTools

1. Install React DevTools extension
2. Open Profiler tab
3. Click Record
4. Interact with editor
5. Stop recording
6. Look for:
   - Components rendering unnecessarily
   - Slow render times
   - Cascading updates

## Performance Checklist

Before deploying changes, verify:

- [ ] FPS stays at 60 during interactions
- [ ] Memory doesn't grow beyond 200MB
- [ ] No long tasks (&gt;50ms) during normal use
- [ ] Components only re-render when needed
- [ ] Event handlers are debounced/throttled
- [ ] Cleanup functions are implemented
- [ ] No console warnings about performance

## Export Performance Data

To share performance data with the team:

```tsx
import { exportPerformanceData } from '@/components/global/grapejs-editor/performance-debug'

// Call this function
exportPerformanceData()
```

This downloads a JSON file with:
- All performance measurements
- Memory usage
- Timestamp

## Continuous Monitoring

For production monitoring, consider:

1. **Add analytics**:
```tsx
// Track slow operations
if (duration &gt; 100) {
  analytics.track('slow-operation', { operation, duration })
}
```

2. **Set performance budgets**:
```tsx
// Fail CI if bundle size exceeds limit
// Warn if FPS drops below 30
```

3. **User monitoring**:
```tsx
// Track real user metrics
window.addEventListener('load', () =&gt; {
  const perfData = performance.getEntriesByType('navigation')[0]
  analytics.track('page-load', { duration: perfData.duration })
})
```

## Need Help?

If you're still experiencing performance issues:

1. Check `PERFORMANCE_OPTIMIZATIONS.md` for detailed info
2. Use the debugging tools above to identify the issue
3. Check browser DevTools for specific problems
4. Review the performance checklist

## Best Practices

✅ **DO**:
- Use React.memo for expensive components
- Wrap event handlers with useCallback
- Debounce/throttle frequent operations
- Clean up subscriptions and listeners
- Monitor memory usage in development
- Profile before and after changes

❌ **DON'T**:
- Create functions inside render
- Use inline objects/arrays as props
- Forget cleanup in useEffect
- Block the main thread for &gt;50ms
- Ignore performance warnings
- Skip profiling

## Summary

The editor now has:
- ✅ Automatic performance optimizations
- ✅ Memory management
- ✅ Debugging tools
- ✅ Performance monitoring
- ✅ Best practices implemented

Use the tools above to maintain great performance as you add features!
