import React from 'react';
import Sidebar from './Sidebar';
import '../styles/MainLayout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout Component
 * Provides the main layout structure with sidebar and content area
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
