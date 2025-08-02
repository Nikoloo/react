import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/store';
import { setSystemTheme } from '../../store/slices/uiSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { currentTheme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    // Set initial theme based on system preference
    if (!localStorage.getItem('theme')) {
      dispatch(setSystemTheme());
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (!localStorage.getItem('theme')) {
        dispatch(setSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Store user preference
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
};

export default ThemeProvider;