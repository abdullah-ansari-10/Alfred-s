import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Play, UserPlus, Video } from 'lucide-react';
import { Navbar } from './Navbar';
import { BackButton } from './BackButton';

export const WatchPartyRoom: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLiveStream = () => {
    navigate('/live-stream');
  };

  const handleJoinLiveStream = () => {
    navigate('/live-stream');
  };

  return (
    <div className="min-h-screen bg-dark-800">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton to="/home" />
        </div>
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Watch Party</h1>
          <p className="text-xl text-dark-300 max-w-2xl mx-auto">
            Create or join a live streaming room with secure WebRTC technology. 
            Watch together, chat together, stay connected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Live Stream Card */}
          <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-dark-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video size={24} className="text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Live Stream</h2>
              <p className="text-dark-300">Start or join a live video streaming room with up to 4 participants</p>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-600 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Features:</h3>
                <ul className="text-sm text-dark-300 space-y-1">
                  <li>• Live video & audio streaming</li>
                  <li>• Secure WebRTC connection</li>
                  <li>• Google OAuth2 authentication</li>
                  <li>• Room-based access control</li>
                </ul>
              </div>

              <button
                onClick={handleStartLiveStream}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Enter Live Stream
              </button>
            </div>
          </div>

          {/* Traditional Watch Party Card */}
          <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-dark-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play size={24} className="text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Movie Theater</h2>
              <p className="text-dark-300">Browse and watch movies together with synchronized playback</p>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-600 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Features:</h3>
                <ul className="text-sm text-dark-300 space-y-1">
                  <li>• Synchronized movie playback</li>
                  <li>• AI assistant (Alfred)</li>
                  <li>• Movie highlights & insights</li>
                  <li>• Chat & video calling</li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/watch')}
                className="w-full py-3 px-4 border border-dark-500 rounded-lg shadow-sm text-sm font-medium text-white bg-dark-600 hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-400 transition-colors"
              >
                Enter Movie Theater
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-dark-700 rounded-lg p-6 border border-primary-600/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">🔒 Security & Privacy</h3>
            <p className="text-sm text-dark-300 max-w-3xl mx-auto">
              Your privacy and security are our top priorities. All live streams use end-to-end encrypted WebRTC connections. 
              Only authenticated users can create or join rooms. No personal data is logged or stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};