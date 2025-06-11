import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-dark-700 border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <span className="text-xl font-semibold text-white">Alfred's</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 bg-dark-600 border border-dark-500 rounded-lg px-4 py-2 text-sm text-white placeholder-dark-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-300" size={18} />
            </div>
            
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
};