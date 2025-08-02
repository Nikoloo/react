import React from 'react';
import './Sidebar.scss';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__content">
        <nav className="sidebar__nav">
          <div className="nav-section">
            <div className="nav-item">🏠 Home</div>
            <div className="nav-item">🔍 Search</div>
            <div className="nav-item">📚 Your Library</div>
          </div>
          
          <div className="nav-section">
            <div className="nav-item">➕ Create Playlist</div>
            <div className="nav-item">❤️ Liked Songs</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;