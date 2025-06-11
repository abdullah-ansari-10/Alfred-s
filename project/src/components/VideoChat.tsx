import React, { useState, useRef, useEffect } from 'react';
import { X, Maximize2, Minimize2, Video, VideoOff, Mic, MicOff, UserPlus, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export const VideoChat: React.FC = () => {
  const { toggleVideoChat } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'You', isLocal: true, stream: null },
  ]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    startLocalStream();
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to get local stream:', error);
    }
  };

  const toggleVideo = () => {
    const newVideoEnabled = !videoEnabled;
    setVideoEnabled(newVideoEnabled);
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = newVideoEnabled;
      }
    }
  };

  const toggleMic = () => {
    const newMicEnabled = !micEnabled;
    setMicEnabled(newMicEnabled);
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = newMicEnabled;
      }
    }
  };

  const inviteFriend = () => {
    // Simulate adding a friend
    const newParticipant = {
      id: Date.now().toString(),
      name: `Friend ${participants.length}`,
      isLocal: false,
      stream: null
    };
    setParticipants([...participants, newParticipant]);
  };
  
  return (
    <motion.div 
      className="fixed bottom-4 right-4 bg-dark-800 rounded-lg shadow-xl border border-dark-600 overflow-hidden z-50"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        width: isExpanded ? '500px' : '350px',
        height: isExpanded ? '500px' : '250px',
      }}
    >
      {/* Header */}
      <div className="p-3 bg-dark-700 flex items-center justify-between border-b border-dark-600">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-medium text-white">Video Chat ({participants.length})</h3>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1.5 hover:bg-dark-600 rounded-md text-dark-300 hover:text-white transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button 
            className="p-1.5 hover:bg-dark-600 rounded-md text-dark-300 hover:text-white transition-colors"
            onClick={toggleVideoChat}
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      {/* Video Grid */}
      <div className="relative w-full flex-1">
        <div className={`grid gap-1 p-2 h-full ${
          participants.length === 1 ? 'grid-cols-1' : 
          participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {participants.map((participant) => (
            <div key={participant.id} className="relative bg-dark-600 rounded-lg overflow-hidden">
              {participant.isLocal ? (
                <div className="w-full h-full relative">
                  {videoEnabled ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-600">
                      <VideoOff size={24} className="text-dark-300" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-dark-500 flex items-center justify-center">
                  <img 
                    src={`https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2`} 
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Participant Info */}
              <div className="absolute bottom-1 left-1 bg-dark-900/80 px-2 py-0.5 rounded text-xs text-white">
                {participant.name}
              </div>
              
              {/* Mic Status */}
              {participant.isLocal && !micEnabled && (
                <div className="absolute top-1 right-1 bg-error-600 p-1 rounded-full">
                  <MicOff size={12} className="text-white" />
                </div>
              )}
            </div>
          ))}
          
          {/* Add Friend Slot */}
          {participants.length < 4 && (
            <button
              onClick={inviteFriend}
              className="bg-dark-600 border-2 border-dashed border-dark-500 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-dark-500 transition-colors"
            >
              <UserPlus size={24} className="text-dark-300 mb-1" />
              <span className="text-xs text-dark-300">Invite</span>
            </button>
          )}
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-2 left-2 right-2 bg-dark-700/90 backdrop-blur-sm rounded-lg p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                className={`p-2 rounded-full transition-colors ${
                  videoEnabled 
                    ? 'bg-dark-600 hover:bg-dark-500 text-white' 
                    : 'bg-error-600 hover:bg-error-700 text-white'
                }`}
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
              <button 
                className={`p-2 rounded-full transition-colors ${
                  micEnabled 
                    ? 'bg-dark-600 hover:bg-dark-500 text-white' 
                    : 'bg-error-600 hover:bg-error-700 text-white'
                }`}
                onClick={toggleMic}
              >
                {micEnabled ? <Mic size={16} /> : <MicOff size={16} />}
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={inviteFriend}
                className="p-2 rounded-full bg-primary-600 hover:bg-primary-700 text-white transition-colors"
              >
                <UserPlus size={16} />
              </button>
              <button 
                onClick={toggleVideoChat}
                className="p-2 rounded-full bg-error-600 hover:bg-error-700 text-white transition-colors"
              >
                <Phone size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};