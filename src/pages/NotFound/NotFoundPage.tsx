import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      gap: '1rem'
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link 
        to="/" 
        style={{
          padding: '0.5rem 1rem',
          background: 'var(--spotify-green)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px'
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;