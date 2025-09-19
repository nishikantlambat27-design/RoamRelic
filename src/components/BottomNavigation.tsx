import React from 'react';
import { NavigationItem } from '../types';

interface BottomNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemClick: (item: NavigationItem) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
}) => {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
          onClick={() => onItemClick(item)}
        >
          <div className="nav-icon">
            {item.icon === 'home' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            )}
            {item.icon === 'audio' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            )}
            {item.icon === 'video' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
              </svg>
            )}
            {item.icon === 'civic' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            )}
            {item.icon === 'profile' && (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default BottomNavigation;