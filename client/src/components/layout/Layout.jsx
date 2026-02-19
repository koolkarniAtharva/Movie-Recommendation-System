import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-gray-400 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Movie Review Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
