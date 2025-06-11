import React, { useState, useRef, useEffect } from 'react';
import { User, Bell, CreditCard, HelpCircle, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toggleProfileModal, togglePreferencesModal, setAuth } = useStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setAuth(false, null);
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-dark-600 transition-colors relative"
      >
        <User className="text-white" size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-dark-700 rounded-lg shadow-lg border border-dark-600 py-2 z-50">
          {/* Profile Header */}
          <div className="px-4 py-3 border-b border-dark-600">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-dark-300">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button 
              onClick={() => {
                setIsOpen(false);
                toggleProfileModal();
              }}
              className="w-full px-4 py-2 text-sm text-left text-white hover:bg-dark-600 flex items-center"
            >
              <User size={16} className="mr-3 text-dark-300" />
              View Profile
            </button>
            <button 
              onClick={() => {
                setIsOpen(false);
                togglePreferencesModal();
              }}
              className="w-full px-4 py-2 text-sm text-left text-white hover:bg-dark-600 flex items-center"
            >
              <Settings size={16} className="mr-3 text-dark-300" />
              Preferences
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-dark-600 flex items-center">
              <Bell size={16} className="mr-3 text-dark-300" />
              Notifications
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-dark-600 flex items-center">
              <CreditCard size={16} className="mr-3 text-dark-300" />
              Subscription / Billing
            </button>
            <button className="w-full px-4 py-2 text-sm text-left text-white hover:bg-dark-600 flex items-center">
              <HelpCircle size={16} className="mr-3 text-dark-300" />
              Help / Support
            </button>

            <div className="border-t border-dark-600 mt-1 pt-1">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm text-left text-error-500 hover:bg-dark-600 flex items-center"
              >
                <LogOut size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};