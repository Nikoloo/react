import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Performance monitoring (development only)
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance/monitor').then(({ initPerformanceMonitoring }) => {
    initPerformanceMonitoring();
  });
}

// Service Worker registration for offline support
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);