import React from 'react';
import { useAppSelector } from '../../store/store';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import PlayingBar from './PlayingBar/PlayingBar';
import './AppLayout.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isLibraryCollapsed } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="app-layout">
      {/* Header with search and user controls */}
      <Header />
      
      <div className="app-layout__main">
        {/* Sidebar for navigation and library */}
        {isAuthenticated && (
          <Sidebar collapsed={isLibraryCollapsed} />
        )}
        
        {/* Main content area */}
        <main 
          className={`app-layout__content ${
            isAuthenticated && !isLibraryCollapsed ? 'with-sidebar' : ''
          }`}
        >
          {children}
        </main>
      </div>
      
      {/* Player controls at bottom */}
      {isAuthenticated && <PlayingBar />}
    </div>
  );
};

export default AppLayout;