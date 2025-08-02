// Performance monitoring utilities for development

export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV !== 'development') return;

  // Monitor Core Web Vitals
  const reportWebVital = (metric: any) => {
    console.log(`[Performance] ${metric.name}:`, metric.value);
  };

  // Largest Contentful Paint
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      reportWebVital({
        name: 'LCP',
        value: entry.startTime,
        entries: [entry],
      });
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      reportWebVital({
        name: 'FID',
        value: (entry as any).processingStart - entry.startTime,
        entries: [entry],
      });
    }
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        reportWebVital({
          name: 'CLS',
          value: clsValue,
          entries: [entry],
        });
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });

  // Monitor bundle size
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log(`[Performance] Network: ${connection.effectiveType}`);
  }

  // Monitor React renders
  console.log('[Performance] Monitoring initialized');
};