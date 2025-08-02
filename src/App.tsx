import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Store
import { store, persistor, useAppDispatch, useAppSelector } from './store/store';

// Styles
import './styles/global.scss';

// Components
import AppLayout from './components/Layout/AppLayout';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages (lazy loaded for performance)
const DiscoveryPage = React.lazy(() => import('./pages/Discovery/DiscoveryPage'));
const LibraryPage = React.lazy(() => import('./pages/Library/LibraryPage'));
const SearchPage = React.lazy(() => import('./pages/Search/SearchPage'));
const PlayerPage = React.lazy(() => import('./pages/Player/PlayerPage'));
const ContentPage = React.lazy(() => import('./pages/Content/ContentPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound/NotFoundPage'));

// Error Boundary
import ErrorBoundary from './components/UI/ErrorBoundary';

// Theme Provider
import ThemeProvider from './components/UI/ThemeProvider';

// Authentication wrapper
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication on app start
    const initAuth = async () => {
      try {
        // Check for stored token and validate
        const token = localStorage.getItem('spotify_token');
        if (token) {
          // Dispatch action to validate token and get user
          // dispatch(validateToken(token));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };

    initAuth();
  }, [dispatch]);

  // Show loading while auth is initializing
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

// Route configuration with optimized structure
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <DiscoveryPage />
          </Suspense>
        } 
      />
      
      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route 
            path="/library" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LibraryPage />
              </Suspense>
            } 
          />
          <Route 
            path="/search" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SearchPage />
              </Suspense>
            } 
          />
          <Route 
            path="/player" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PlayerPage />
              </Suspense>
            } 
          />
        </>
      )}
      
      {/* Dynamic content routes */}
      <Route 
        path="/:type/:id" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <ContentPage />
          </Suspense>
        } 
      />
      
      {/* 404 page */}
      <Route 
        path="*" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        } 
      />
    </Routes>
  );
};

// Main App component
const AppContent: React.FC = () => {
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    // Set theme on document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthWrapper>
          <Router>
            <AppLayout>
              <AppRoutes />
            </AppLayout>
          </Router>
        </AuthWrapper>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

// Root App with providers
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;