import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { setUser, setToken } from '../../store/slices/authSlice';
import { spotifyAuth } from '../../services/auth/spotifyAuth';
import SpotifyAuthService from '../../services/auth/spotifyAuth';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse callback parameters
        const { code, state, error: authError } = SpotifyAuthService.parseCallback();

        if (authError) {
          throw new Error(`Authentication failed: ${authError}`);
        }

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Exchange code for token
        const tokenData = await spotifyAuth.handleCallback(code, state);

        // Get user data
        const userData = await spotifyAuth.getCurrentUser();

        // Update Redux store
        dispatch(setToken(tokenData.access_token));
        dispatch(setUser(userData));

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Authentication callback failed:', error);
        setError(error instanceof Error ? error.message : 'Authentication failed');
        
        // Redirect to home after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <h1>🚫 Authentication Failed</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          {error}
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          Redirecting to home page...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)'
    }}>
      <LoadingSpinner 
        size="large" 
        text="Completing authentication..." 
        color="primary"
      />
    </div>
  );
};

export default CallbackPage;