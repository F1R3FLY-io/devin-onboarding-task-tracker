import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user } = authContext;

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li className="mr-4">
        <Link to="/" className="text-white hover:text-gray-300">Tasks</Link>
      </li>
      <li className="mr-4">
        <Link to="/valuerank" className="text-white hover:text-gray-300">ValueRank</Link>
      </li>
      <li className="mr-4">Hello {user && user.name}</li>
      <li>
        <a onClick={onLogout} href="#!" className="text-white hover:text-gray-300">
          <i className="fas fa-sign-out-alt"></i> <span>Logout</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="mr-4">
        <Link to="/register" className="text-white hover:text-gray-300">Register</Link>
      </li>
      <li>
        <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
      </li>
    </>
  );

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">
          <Link to="/">Task Tracker</Link>
        </h1>
        <ul className="flex items-center">
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
