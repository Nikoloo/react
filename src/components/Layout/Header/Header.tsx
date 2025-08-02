import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__search">
          {/* Search component will go here */}
          <div className="search-placeholder">🔍 Search for music...</div>
        </div>
        
        <div className="header__actions">
          {/* User actions and theme toggle */}
          <div className="user-actions-placeholder">👤 User Menu</div>
        </div>
      </div>
    </header>
  );
};

export default Header;