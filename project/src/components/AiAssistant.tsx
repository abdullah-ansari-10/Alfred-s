import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '../store';

export const AiAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const { addMessage } = useStore();
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      addMessage('user', message);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        addMessage('alfred', 'I can help you with information about this movie. What would you like to know?');
      }, 1000);
    }
  };
  
  return (
    <div className="card border-primary-600/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-500 overflow-hidden flex items-center justify-center">
          <img 
            src="https://images.pexels.com/photos/8438951/pexels-photo-8438951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Alfred AI"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-base md:text-lg">Alfred</h3>
          <p className="text-xs md:text-sm text-gray-400">AI Butler</p>
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about the movie..."
          className="search-input pr-10 text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-400 p-1"
        >
          <Send size={16} className="md:hidden" />
          <Send size={18} className="hidden md:block" />
        </button>
      </form>
    </div>
  );
};