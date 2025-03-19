import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import {
  FiMenu, FiX, FiHome, FiDatabase, FiFileText, FiSettings, FiLogOut
} from 'react-icons/fi';
// @ts-ignore
import defaultAvatar from '../assets/icons/default-avatar.png';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <FiDatabase size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FiFileText size={20} /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings size={20} /> },
    { path: '/about', label: 'About', icon: <FiFileText size={20} /> },
  ];

  // You can pick something smaller than 20vw (e.g. 15vw).
  // If you still want "collapsed" vs "expanded," you can do so dynamically:
  const expandedWidth = '15vw';
  const collapsedWidth = '5vw';

  return (
    <div
      className="fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg z-10"
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
    >
      <div className="flex items-center p-4 border-b border-gray-800 justify-between">
        {!collapsed && <h1 className="text-xl font-bold">FraudGuard</h1>}
        <button
          className="p-1 rounded-md hover:bg-gray-800 transition-colors"
          onClick={toggleSidebar}
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 ${
                    location.pathname === item.path 
                      ? 'bg-blue-600' 
                      : 'hover:bg-gray-800'
                  } transition-colors`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`border-t border-gray-800 p-4 ${collapsed ? 'items-center justify-center' : ''} flex`}>
        {!collapsed ? (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-700">
              <img 
                src={user?.profilePicture || defaultAvatar} 
                alt="User avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatar;
                }}
              />
            </div>
            <div>
              <p className="font-medium">{user?.name || 'User'}</p>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-white flex items-center mt-1"
              >
                <FiLogOut className="mr-1" size={14} />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={logout} 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
