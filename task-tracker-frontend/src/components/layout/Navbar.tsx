import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import ThemeContext from '../../context/theme/ThemeContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const location = useLocation();
  const { isAuthenticated, logout, user } = authContext;
  const { theme, setTheme, isDarkMode } = themeContext;
  
  const isActive = (path: string) => location.pathname === path;
  
  const onLogout = () => {
    logout();
  };

  const tabStyle = (path: string) => {
    const baseClasses = "relative px-6 py-3 font-medium text-lg transition-all duration-200 ease-in-out";
    const activeClasses = isActive(path) 
      ? "text-blue-800 dark:text-blue-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-blue-500 dark:after:bg-blue-400" 
      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-200";
    
    return `${baseClasses} ${activeClasses}`;
  };
  
  const tabShapeStyle = (path: string) => {
    if (!isActive(path)) return "";
    
    return `
      relative overflow-visible
      before:content-[''] before:absolute before:-left-5 before:top-0 before:w-5 before:h-full 
      before:bg-white dark:before:bg-gray-800 before:skew-x-[30deg] before:z-10
      after:content-[''] after:absolute after:-right-5 after:top-0 after:w-5 after:h-full 
      after:bg-white dark:after:bg-gray-800 after:skew-x-[-30deg] after:z-10
    `;
  };

  const authLinks = (
    <div className="flex items-center space-x-2">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-t-xl shadow-soft">
        <Link 
          to="/" 
          className={`${tabStyle("/")} ${tabShapeStyle("/")}`}
        >
          <span className="relative z-20">📋 Tasks</span>
        </Link>
        <Link 
          to="/valuerank" 
          className={`${tabStyle("/valuerank")} ${tabShapeStyle("/valuerank")}`}
        >
          <span className="relative z-20">🔢 Priority Array</span>
        </Link>
      </div>
      
      <div className="flex items-center ml-6">
        <span className="text-gray-700 dark:text-gray-300 mr-4">Hello, {user && user.name} 👋</span>
        <button
          onClick={onLogout}
          className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white rounded-xl py-1 px-3 transition-colors duration-200 ease-in-out shadow-soft"
        >
          Logout
        </button>
      </div>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link 
        to="/register" 
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl shadow-soft transition-colors duration-200"
      >
        Register
      </Link>
      <Link 
        to="/login" 
        className="bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white border border-blue-500 hover:border-transparent py-2 px-4 rounded-xl shadow-soft transition-colors duration-200"
      >
        Login
      </Link>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-4 shadow-lg backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold drop-shadow-md">
          <Link to="/" className="flex items-center">
            <span className="mr-2">✅</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">Task Tracker</span>
          </Link>
        </h1>
        
        <div className="flex items-center">
          {isAuthenticated ? authLinks : guestLinks}
          
          {/* Theme toggle */}
          <div className="ml-6 flex items-center space-x-2">
            <button 
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full ${theme === 'light' ? 'bg-yellow-200 text-yellow-600' : 'text-gray-400 hover:text-yellow-400'}`}
              title="Light mode"
            >
              <span className="text-xl">☀️</span>
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'text-gray-400 hover:text-blue-400'}`}
              title="Dark mode"
            >
              <span className="text-xl">🌙</span>
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`p-2 rounded-full ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="System preference"
            >
              <span className="text-xl">🖥️</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
