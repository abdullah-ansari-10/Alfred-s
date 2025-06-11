import React from 'react';
import { ChevronRight } from 'lucide-react';

interface HighlightItem {
  id: string;
  title: string;
  timestamp: string;
  thumbnail: string;
}

export const Highlights: React.FC = () => {
  // Example data - in production this would come from your API
  const highlights: HighlightItem[] = [
    {
      id: '1',
      title: 'Epic car chase scene',
      timestamp: '01:23:45',
      thumbnail: 'https://images.pexels.com/photos/1687147/pexels-photo-1687147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      title: 'Dramatic plot twist',
      timestamp: '01:45:12',
      thumbnail: 'https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      title: 'Emotional farewell scene',
      timestamp: '02:12:38',
      thumbnail: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold">Highlights</h2>
        <button className="btn-icon text-dark-300 hover:text-white">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="relative group cursor-pointer">
            <div className="overflow-hidden rounded-md">
              <img 
                src={highlight.thumbnail} 
                alt={highlight.title} 
                className="w-full h-24 sm:h-32 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-2">
              <p className="text-xs sm:text-sm font-medium truncate">{highlight.title}</p>
              <p className="text-xs text-gray-400">{highlight.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};