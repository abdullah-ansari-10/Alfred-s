import React from 'react';
import { Play, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BackButton } from './BackButton';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-800">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton to="/" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Movie Browser Card */}
          <div 
            className="bg-dark-700 rounded-xl p-6 cursor-pointer hover:bg-dark-600 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate('/watch')}
          >
            <div className="h-48 bg-dark-600 rounded-lg mb-4 flex items-center justify-center">
              <Play size={48} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Movie Browser</h2>
            <p className="text-dark-300">
              Browse our extensive collection of movies and TV shows. Find your next favorite entertainment with advanced search and filtering options.
            </p>
          </div>
          
          {/* Watch Party Card */}
          <div 
            className="bg-dark-700 rounded-xl p-6 cursor-pointer hover:bg-dark-600 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => navigate('/watch-party')}
          >
            <div className="h-48 bg-dark-600 rounded-lg mb-4 flex items-center justify-center">
              <Users size={48} className="text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Watch Party</h2>
            <p className="text-dark-300">
              Create or join a watch party to enjoy movies together with friends and family. Synchronized playback and live chat make it feel like you're all in the same room.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};