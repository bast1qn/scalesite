# Performance Optimization Guide

## 📚 Table of Contents

1. [Core Web Vitals Monitoring](#core-web-vitals-monitoring)
2. [Virtual Scrolling](#virtual-scrolling)
3. [Web Workers](#web-workers)
4. [Context Optimization](#context-optimization)
5. [Progressive Image Loading](#progressive-image-loading)
6. [Idle Task Scheduling](#idle-task-scheduling)
7. [Performance Hooks](#performance-hooks)

---

## Core Web Vitals Monitoring

### Setup

Performance monitoring is automatically initialized in `App.tsx` for production builds.

```typescript
import { initPerformanceMonitoring } from '@/lib/performance/monitoring';

// Automatic initialization in App.tsx
useEffect(() => {
  if (import.meta.env.PROD) {
    initPerformanceMonitoring().then((vitals) => {
      console.log('Core Web Vitals:', vitals);
    });
  }
}, []);
```

### Metrics Tracked

- **LCP** (Largest Contentful Paint): Loading performance
- **FID** (First Input Delay): Interactivity
- **CLS** (Cumulative Layout Shift): Visual stability
- **INP** (Interaction to Next Paint): Responsiveness
- **FCP** (First Contentful Paint): First paint
- **TTFB** (Time to First Byte): Server response time

### Performance Summary

```typescript
import { getPerformanceSummary } from '@/lib/performance/monitoring';

const vitals = await initPerformanceMonitoring();
const summary = getPerformanceSummary(vitals);

console.log('Performance Score:', summary.score);
console.log('Issues:', summary.issues);
console.log('Recommendations:', summary.recommendations);
```

---

## Virtual Scrolling

### Basic Usage

For large lists (1000+ items), use `VirtualList` to render only visible items:

```typescript
import { VirtualList } from '@/lib/performance/virtualScroll';

<VirtualList
  items={largeDataset}           // Array of 1000+ items
  itemHeight={60}                // Height of each item in px
  height={600}                   // Container height
  overscan={3}                   // Extra items to render above/below
  renderItem={(item, index) => (  // Render function
    <div key={index}>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  )}
/>
```

### Virtual Grid

For 2D layouts:

```typescript
import { VirtualGrid } from '@/lib/performance/virtualScroll';

<VirtualGrid
  items={dataset}
  itemWidth={300}
  itemHeight={200}
  height={600}
  columns={3}
  renderItem={(item, index) => <Card data={item} />}
/>
```

### Custom Hook

```typescript
import { useVirtualScroll } from '@/lib/performance/virtualScroll';

function MyList() {
  const { scrollTop, setScrollTop, visibleRange, totalHeight } = useVirtualScroll({
    itemCount: 10000,
    itemHeight: 50,
    containerHeight: 600,
    overscan: 3
  });

  return (
    <div onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
      <div style={{ height: totalHeight }}>
        {items.slice(visibleRange.startIndex, visibleRange.endIndex).map(...)}
      </div>
    </div>
  );
}
```

---

## Web Workers

### PDF Generation

Offload PDF generation to background thread:

```typescript
import { usePDFWorker } from '@/lib/performance/webWorker';

function PDFGenerator() {
  const { pdfBlob, isGenerating, error, generatePDF, downloadPDF } = usePDFWorker();

  const handleGenerate = () => {
    generatePDF(
      {
        title: 'My Report',
        text: 'Content here...'
      },
      { format: 'a4', orientation: 'portrait' }
    );
  };

  return (
    <>
      <button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate PDF'}
      </button>
      {pdfBlob && (
        <button onClick={() => downloadPDF('report.pdf')}>
          Download
        </button>
      )}
    </>
  );
}
```

### Chart Data Processing

Process large datasets in background:

```typescript
import { useChartWorker } from '@/lib/performance/webWorker';

function AnalyticsChart() {
  const { processedData, isProcessing, error, processData } = useChartWorker();

  useEffect(() => {
    // Process 10K+ records without blocking UI
    processData(largeDataset, 'monthly');
  }, [largeDataset]);

  if (isProcessing) return <Skeleton />;
  if (error) return <Error message={error.message} />;

  return <Chart data={processedData} />;
}
```

### Custom Worker

```typescript
import { useWebWorker } from '@/lib/performance/webWorker';

function HeavyComputation() {
  const { result, error, isProcessing, execute } = useWebWorker(
    (data: number[]) => {
      // This runs in Web Worker
      return data.reduce((sum, n) => sum + n, 0);
    }
  );

  return (
    <button onClick={() => execute([1, 2, 3, 4, 5])}>
      Calculate in Worker
    </button>
  );
}
```

---

## Context Optimization

### Split Large Contexts

Instead of one large context:

```typescript
// ❌ BEFORE: Single large context
const AuthContext = {
  user,
  loading,
  login,
  logout,
  register
}
```

Split into focused contexts:

```typescript
// ✅ AFTER: Split contexts
<UserProvider>
  <AuthLoadingProvider>
    <AuthActionsProvider>
      <App />
    </AuthActionsProvider>
  </AuthLoadingProvider>
</UserProvider>
```

### Context Selector

Only re-render when selected value changes:

```typescript
import { useContextSelector } from '@/lib/performance/contextOptimization';

// Only re-renders when user changes, not other context values
const user = useContextSelector(AuthContext, state => state.user);
```

### Optimized Store

Fine-grained subscriptions:

```typescript
import { createOptimizedStore } from '@/lib/performance/contextOptimization';

const { StoreProvider, useStore, useStoreValue } = createOptimizedStore({
  user: null,
  loading: false,
  theme: 'light'
});

// Only subscribe to 'user' key
const user = useStore('user');
const [user, setUser] = useStoreValue('user');
```

### Atom Pattern

Smallest re-render scope:

```typescript
import { createAtom } from '@/lib/performance/contextOptimization';

const { AtomProvider, useAtom, useAtomValue, useSetAtom } = createAtom(null);

function Component() {
  const [value, setValue] = useAtom();           // Both getter & setter
  const value = useAtomValue();                  // Read-only
  const setValue = useSetAtom();                 // Write-only
}
```

---

## Progressive Image Loading

### Blur-Up Technique

```typescript
import { ProgressiveImage } from '@/lib/performance/imageOptimization';

<ProgressiveImage
  src="/hero-image.jpg"
  placeholder="/hero-image-tiny.jpg"    // 2KB blurry version
  width={1920}
  height={1080}
  blurAmount={10}                       // Blur strength
  alt="Hero section"
  loading="lazy"                        // Lazy loading
  onLoad={() => console.log('Loaded!')}
/>
```

### Responsive Images

```typescript
import { ResponsiveImage } from '@/lib/performance/imageOptimization';

<ResponsiveImage
  src={{
    mobile: '/image-640w.jpg',
    tablet: '/image-960w.jpg',
    desktop: '/image-1920w.jpg'
  }}
  formats={{
    webp: '/image.webp',
    avif: '/image.avif'
  }}
  alt="Responsive image"
/>
```

### Critical Image Preloading

```typescript
import { useCriticalImages } from '@/lib/performance/imageOptimization';

function Hero() {
  // Preload critical images during idle time
  useCriticalImages([
    '/hero-image.jpg',
    '/logo.png'
  ]);

  return <img src="/hero-image.jpg" alt="Hero" />;
}
```

### Aspect Ratio Container

Prevent CLS with proper aspect ratio:

```typescript
import { AspectRatioContainer } from '@/lib/performance/imageOptimization';

<AspectRatioContainer aspectRatio={16/9}>
  <img src="/image.jpg" alt="16:9 image" />
</AspectRatioContainer>
```

---

## Idle Task Scheduling

### Schedule Idle Tasks

Run non-critical work during browser idle time:

```typescript
import { scheduleIdleTask } from '@/lib/performance/idleTasks';

// Run analytics when browser is idle
scheduleIdleTask(() => {
  analytics.track('pageview');
}, { timeout: 2000 });

// Schedule with priority
import { addIdleTask } from '@/lib/performance/idleTasks';

addIdleTask(analytics, { priority: 'low' });
addIdleTask(criticalUpdate, { priority: 'high' });
```

### React Hook

```typescript
import { useIdleCallback } from '@/lib/performance/idleTasks';

function Component() {
  const { scheduleTask } = useIdleCallback();

  const handleClick = () => {
    // Schedule work during idle time
    scheduleTask(() => {
      heavyComputation();
    });
  };
}
```

### Idle Effect

```typescript
import { useIdleEffect } from '@/lib/performance/idleTasks';

useIdleEffect(() => {
  // Runs during idle time, not on mount
  initializeHeavyLibrary();

  return () => {
    // Cleanup also runs during idle time
    cleanup();
  };
}, []);
```

### Lazy Load Resources

```typescript
import { lazyLoadResources } from '@/lib/performance/idleTasks';

useEffect(() => {
  lazyLoadResources({
    scripts: ['/analytics.js'],
    stylesheets: ['/fonts.css'],
    images: ['/background.jpg']
  });
}, []);
```

### Progressive Hydration

Hydrate components gradually:

```typescript
import { useProgressiveHydration } from '@/lib/performance/idleTasks';

const components = {
  Header: <Header />,
  Hero: <Hero />,
  Features: <Features />,
  Footer: <Footer />
};

const hydrated = useProgressiveHydration(
  components,
  ['Header', 'Hero', 'Features', 'Footer']
);

return (
  <>
    {hydrated.Header}
    {hydrated.Hero}
    {hydrated.Features}
    {hydrated.Footer}
  </>
);
```

### Process in Chunks

Process large datasets without blocking:

```typescript
import { processInChunks } from '@/lib/performance/idleTasks';

const results = await processInChunks(
  largeDataset,
  async (item) => {
    return await processItem(item);
  },
  10  // Process 10 items per chunk
);
```

---

## Performance Hooks

### Network Status

```typescript
import { useNetworkStatus } from '@/lib/performance/hooks';

function Component() {
  const { isOnline, effectiveType, isSlowConnection } = useNetworkStatus();

  if (isSlowConnection) {
    // Use low-res images
    // Skip animations
  }

  return <div>Connection: {effectiveType}</div>;
}
```

### Viewport Loading

```typescript
import { useInViewport } from '@/lib/performance/hooks';

function LazyComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(ref);

  return (
    <div ref={ref}>
      {isInViewport && <ExpensiveChart />}
    </div>
  );
}
```

### Prefers Reduced Motion

```typescript
import { usePrefersReducedMotion } from '@/lib/performance/hooks';

function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      style={{
        transition: prefersReducedMotion ? 'none' : 'all 0.3s'
      }}
    >
      Content
    </div>
  );
}
```

### Throttled Value

```typescript
import { useThrottledValue } from '@/lib/performance/hooks';

function ScrollComponent() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Throttle updates to 100ms
  const throttledScroll = useThrottledValue(scrollPosition, 100);

  useEffect(() => {
    // Only runs when throttled value changes
    fetchData(throttledScroll);
  }, [throttledScroll]);
}
```

### Lazy Initialization

```typescript
import { useLazyInit } from '@/lib/performance/hooks';

function Component() {
  // Initialize during idle time, not on mount
  const heavyLibrary = useLazyInit(() => {
    return initializeHeavyLibrary();
  });

  if (!heavyLibrary) return <Skeleton />;

  return <ComponentUsingLibrary lib={heavyLibrary} />;
}
```

### RAF Loop

```typescript
import { useRAFLoop } from '@/lib/performance/hooks';

function Animation() {
  const [position, setPosition] = useState(0);

  useRAFLoop(() => {
    setPosition(prev => prev + 1);
  }, true); // isActive

  return <div style={{ transform: `translateX(${position}px)` }} />;
}
```

---

## Performance Best Practices

### 1. Code Splitting

```typescript
// ✅ Good: Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));

// ✅ Good: Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// ❌ Bad: Import everything up-front
import Dashboard from './pages/Dashboard';
import HeavyChart from './components/HeavyChart';
```

### 2. Memoization

```typescript
// ✅ Good: Memoize expensive computations
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.value - b.value);
}, [items]);

// ✅ Good: Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ Bad: Recreate on every render
const sortedList = items.sort((a, b) => a.value - b.value);
const handleClick = () => doSomething(id);
```

### 3. Component Memo

```typescript
// ✅ Good: Memoize expensive components
const ExpensiveRow = memo(({ data }) => {
  return <div>{calculateExpensiveValue(data)}</div>;
});

// ❌ Bad: Re-render on every parent update
const ExpensiveRow = ({ data }) => {
  return <div>{calculateExpensiveValue(data)}</div>;
};
```

### 4. Virtual Scrolling

```typescript
// ✅ Good: Virtual scroll for large lists
<VirtualList items={10000items} ... />

// ❌ Bad: Render all items
{items.map(item => <Row key={item.id} data={item} />)}
```

### 5. Image Optimization

```typescript
// ✅ Good: Progressive loading
<ProgressiveImage src="/img.jpg" placeholder="/img-tiny.jpg" width={1920} height={1080} />

// ❌ Bad: No dimensions, causes CLS
<img src="/img.jpg" alt="Image" />

// ✅ Good: Lazy load below-fold
<img src="/img.jpg" loading="lazy" />

// ❌ Bad: Load all images immediately
<img src="/img.jpg" />
```

---

## Performance Monitoring

### Development Mode

Enable render tracking:

```typescript
import { useRenderCount } from '@/lib/performance/hooks';

function MyComponent() {
  const { count } = useRenderCount('MyComponent');
  // Logs: [Render Count] MyComponent: 5
}
```

### Production Mode

Core Web Vitals are automatically tracked in production.

Check browser console for performance metrics:
```
[Performance] LCP: 1200ms ✅
[Performance] FID: 45ms ✅
[Performance] CLS: 0.02 ✅
```

---

## Resources

- [web.dev/vitals](https://web.dev/vitals/)
- [web.dev/fast](https://web.dev/fast/)
- [vite.dev/guide/build.html](https://vite.dev/guide/build.html)
- [react.dev/reference/react](https://react.dev/reference/react)

---

## Summary

These performance optimizations aim to achieve:

- **LCP < 2.5s** (GOOD)
- **FID < 100ms** (GOOD)
- **CLS < 0.1** (GOOD)
- **INP < 200ms** (GOOD)

All optimizations are:
- ✅ Non-breaking
- ✅ Backward compatible
- ✅ Incremental adoption
- ✅ Production ready
