import React from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightAction,
}) => {
  return (
    <header className="header">
      {showBackButton && (
        <button className="back-button" onClick={onBackClick}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
      )}
      <h1 className="header-title">{title}</h1>
      {rightAction && <div className="header-right">{rightAction}</div>}
    </header>
  );
};

export default Header;