import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Addresses',
    icon: '📍',
    route: '/addresses/get-all',
  },
  {
    label: 'Customers',
    icon: '👤',
    route: '/customers/get-all',
  },
  {
    label: 'Invoices',
    icon: '📄',
    route: '/invoices/get-all',
  },
  {
    label: 'InvoiceItems',
    icon: '📦',
    route: '/invoice-items/get-all',
  },
];

/**
 * Sidebar Component
 * Fixed sidebar with simple vertical menu (no accordion)
 * Click on menu item → Navigate directly to list page
 */
export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMenuItemActive = (route: string): boolean => {
    return location.pathname.startsWith(route.split('/').slice(0, 2).join('/'));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Invoicing</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`menu-item ${isMenuItemActive(item.route) ? 'active' : ''}`}
            onClick={() => navigate(item.route)}
            title={item.label}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
