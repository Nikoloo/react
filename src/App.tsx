import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Store
import { store, persistor, useAppDispatch, useAppSelector } from './store/store';
import { setUser, setToken } from './store/slices/authSlice';

// Styles
import './styles/global.scss';

// Components
import AppLayout from './components/Layout/AppLayout';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/UI/ErrorBoundary';
import ThemeProvider from './components/UI/ThemeProvider';

// Pages (lazy loaded for performance)
const DiscoveryPage = React.lazy(() => import('./pages/Discovery/DiscoveryPage'));
const LibraryPage = React.lazy(() => import('./pages/Library/LibraryPage'));
const SearchPage = React.lazy(() => import('./pages/Search/SearchPage'));
const PlayerPage = React.lazy(() => import('./pages/Player/PlayerPage'));
const ContentPage = React.lazy(() => import('./pages/Content/ContentPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound/NotFoundPage'));
const CallbackPage = React.lazy(() => import('./pages/Auth/CallbackPage'));
const LoginPage = React.lazy(() => import('./components/Auth/LoginPage'));

// Authentication wrapper
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication on app start
    const initAuth = async () => {
      try {
        // Check for stored Spotify token and validate
        const token = localStorage.getItem('spotify_access_token');
        if (token) {
          // Import spotifyAuth dynamically to avoid circular imports
          const { spotifyAuth } = await import('./services/auth/spotifyAuth');
          
          // Check if token is still valid
          if (spotifyAuth.isAuthenticated()) {
            const userData = await spotifyAuth.getCurrentUser();
            dispatch(setUser(userData));
            dispatch(setToken(token));
          } else {
            // Token expired, clear storage
            spotifyAuth.logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid tokens
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_token_expiration');
      }
    };

    initAuth();
  }, [dispatch]);

  // Show loading while auth is initializing
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return <>{children}</>;
};

// Route configuration with optimized structure
const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* Authentication routes */}
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <LoginPage />
          </Suspense>
        } 
      />
      <Route 
        path="/callback" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            <CallbackPage />
          </Suspense>
        } 
      />
      
      {/* Public routes */}
      <Route 
        path="/" 
        element={
          <Suspense fallback={<LoadingSpinner />}>
            {isAuthenticated ? <DiscoveryPage /> : <LoginPage />}
          </Suspense>
        } 
      />
      
      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route 
            path="/discovery" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <DiscoveryPage />
              </Suspense>
            } 
          />
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