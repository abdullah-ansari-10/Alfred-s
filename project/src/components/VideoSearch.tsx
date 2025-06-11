import React, { useState } from 'react';
import { Search, Play, Clock, Eye } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
  url: string;
  description: string;
}

interface VideoSearchProps {
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoSearch: React.FC<VideoSearchProps> = ({ onVideoSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample videos with working URLs (these are public domain or creative commons)
  const sampleVideos: Video[] = [
    {
      id: '1',
      title: 'Big Buck Bunny - Animated Short Film',
      thumbnail: 'https://images.pexels.com/photos/1687147/pexels-photo-1687147.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Blender Foundation',
      duration: '9:56',
      views: '50M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'A delightful animated short film about a big bunny and his forest friends.'
    },
    {
      id: '2',
      title: 'Elephant Dream - CGI Animation',
      thumbnail: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Orange Open Movie Project',
      duration: '10:53',
      views: '25M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'A surreal journey through a mechanical world of strange creatures.'
    },
    {
      id: '3',
      title: 'Sintel - Fantasy Adventure',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Durian Open Movie Project',
      duration: '14:48',
      views: '40M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      description: 'An epic tale of a young warrior on a quest to find her lost dragon companion.'
    },
    {
      id: '4',
      title: 'Tears of Steel - Sci-Fi Short',
      thumbnail: 'https://images.pexels.com/photos/1687147/pexels-photo-1687147.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Mango Open Movie Project',
      duration: '12:14',
      views: '30M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: 'A futuristic story set in a post-apocalyptic world with stunning visual effects.'
    },
    {
      id: '5',
      title: 'For Bigger Blazes - Action Demo',
      thumbnail: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Demo Studio',
      duration: '0:15',
      views: '5M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'High-octane action sequence showcasing explosive visual effects.'
    },
    {
      id: '6',
      title: 'Subaru Outback On Street And Dirt',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
      channel: 'Automotive Channel',
      duration: '0:30',
      views: '8M views',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      description: 'Showcasing the versatility of the Subaru Outback on various terrains.'
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(sampleVideos);
      return;
    }

    setIsLoading(true);
    
    // Simulate search by filtering sample videos
    setTimeout(() => {
      const filtered = sampleVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.length > 0 ? filtered : sampleVideos);
      setIsLoading(false);
    }, 800);
  };

  // Show all videos by default
  React.useEffect(() => {
    setSearchResults(sampleVideos);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Browse Videos</h3>
        <p className="text-sm text-dark-300">Sample videos available for streaming</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="search-input pr-12"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-400 p-1"
        >
          <Search size={20} />
        </button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((video) => (
            <div
              key={video.id}
              className="bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-all duration-200 cursor-pointer group transform hover:-translate-y-1"
              onClick={() => onVideoSelect(video.url)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-primary-600 rounded-full p-3">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
                  <Clock size={12} className="mr-1" />
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-white line-clamp-2 mb-2 group-hover:text-primary-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-dark-300 mb-1">{video.channel}</p>
                <div className="flex items-center text-xs text-dark-400">
                  <Eye size={12} className="mr-1" />
                  {video.views}
                </div>
                <p className="text-xs text-dark-400 mt-2 line-clamp-2">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-dark-300">No videos found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};