import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Film, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-yellow-500 mb-4 md:mb-0">
          <Film className="w-6 h-6" />
          <span>MovieReviews</span>
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-4 md:space-x-6">
          <Link to="/" className="hover:text-yellow-500 transition">Home</Link>
          <Link to="/movies" className="hover:text-yellow-500 transition">Movies</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-yellow-500 transition text-red-400">Admin</Link>
          )}
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-yellow-500 transition flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span className="hidden md:inline">{user?.username}</span>
              </Link>
              <button onClick={handleLogout} className="hover:text-red-500 transition flex items-center space-x-1">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-yellow-500 transition">Login</Link>
              <Link to="/register" className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition font-medium">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
