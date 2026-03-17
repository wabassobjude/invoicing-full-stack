import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

interface MenuItem {
  label: string;
  icon: string;
  subItems: {
    label: string;
    route: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Addresses',
    icon: '📍',
    subItems: [
      { label: 'Save', route: '/addresses/create' },
      { label: 'List all', route: '/addresses/get-all' },
    ],
  },
  {
    label: 'Customers',
    icon: '👤',
    subItems: [
      { label: 'Save', route: '/customers/create' },
      { label: 'List all', route: '/customers/get-all' },
    ],
  },
  {
    label: 'Invoices',
    icon: '📄',
    subItems: [
      { label: 'Save', route: '/invoices/create' },
      { label: 'List all', route: '/invoices/get-all' },
    ],
  },
  {
    label: 'InvoiceItems',
    icon: '📦',
    subItems: [
      { label: 'Save', route: '/invoice-items/create' },
      { label: 'List all', route: '/invoice-items/get-all' },
    ],
  },
];

/**
 * Sidebar Component
 * Fixed sidebar with collapsible menu items
 */
export const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Invoices']);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isSubItemActive = (route: string): boolean => {
    return location.pathname === route;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Invoicing</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.label} className="menu-item">
            <button
              className={`menu-label ${expandedItems.includes(item.label) ? 'expanded' : ''}`}
              onClick={() => toggleExpand(item.label)}
              aria-expanded={expandedItems.includes(item.label)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.label}</span>
              <span className="menu-arrow">›</span>
            </button>

            {expandedItems.includes(item.label) && (
              <ul className="submenu">
                {item.subItems.map((subItem) => (
                  <li key={subItem.route}>
                    <button
                      className={`submenu-link ${isSubItemActive(subItem.route) ? 'active' : ''}`}
                      onClick={() => navigate(subItem.route)}
                    >
                      {subItem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-version">v1.0.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
