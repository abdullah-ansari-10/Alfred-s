import React from 'react';
import { Search, Menu, Video } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { Highlights } from './Highlights';
import { BackButton } from './BackButton';
import { useStore } from '../store';

export const MainContent: React.FC = () => {
  const { toggleSidebar, toggleVideoChat, isVideoChatOpen } = useStore();

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <BackButton to="/home" />
        
        <div className="flex items-center space-x-2">
          {/* Video Chat Toggle */}
          <button
            onClick={toggleVideoChat}
            className={`p-2 rounded-full transition-colors ${
              isVideoChatOpen 
                ? 'bg-primary-600 hover:bg-primary-700 text-white' 
                : 'bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white'
            }`}
            aria-label="Toggle Video Chat"
          >
            <Video size={20} />
          </button>
          
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
            aria-label="Toggle Alfred Assistant"
          >
            <Menu size={20} className="text-white" />
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-3xl mx-auto">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search" 
            className="search-input pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-300" size={20} />
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto">
        <VideoPlayer />
      </div>
      
      <div className="w-full max-w-5xl mx-auto">
        <Highlights />
      </div>
    </div>
  );
};