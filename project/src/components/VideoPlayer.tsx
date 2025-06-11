import React from 'react';
import { Search, Menu } from 'lucide-react';
import { MoviePlayer } from './MoviePlayer';
import { Highlights } from './Highlights';
import { useStore } from '../store';
import { VideoSearch } from './VideoSearch';

export const VideoPlayer: React.FC = () => {
  const { 
    isPlaying, setPlaying, 
    currentTime, setCurrentTime, 
    currentVideoId, setCurrentVideoId,
    toggleSidebar
  } = useStore();
  
  const [showSearch, setShowSearch] = React.useState(false);

  const handleVideoSelect = (videoUrl: string) => {
    setCurrentVideoId(videoUrl);
    setShowSearch(false);
    setPlaying(false);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Mobile Alfred Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-white">Movie Theater</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn btn-primary flex items-center space-x-2 text-sm md:text-base"
          >
            <Search size={16} className="md:hidden" />
            <Search size={18} className="hidden md:block" />
            <span className="hidden sm:inline">{showSearch ? 'Hide Browser' : 'Browse Movies'}</span>
            <span className="sm:hidden">Browse</span>
          </button>
          
          {/* Mobile Alfred Toggle */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
            aria-label="Open Alfred Assistant"
          >
            <Menu size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Video Search */}
      {showSearch && (
        <div className="card">
          <VideoSearch onVideoSelect={handleVideoSelect} />
        </div>
      )}

      {/* Movie Player - Responsive aspect ratio */}
      <div className="aspect-video w-full">
        <MoviePlayer
          videoUrl={currentVideoId || undefined}
          title={currentVideoId ? "Selected Movie" : "Movie Player"}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          className="w-full h-full"
        />
      </div>

      {/* Highlights Section - Hidden on small screens when sidebar is open */}
      <div className="block">
        <Highlights />
      </div>
    </div>
  );
};