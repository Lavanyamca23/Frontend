import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">Textile Logo</div>
      <nav className="space-x-6">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
