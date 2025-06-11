import React, { useEffect, useRef, useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Copy, 
  Share,
  Crown,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from './BackButton';

interface LiveStreamRoomProps {
  user: any;
  onLeave: () => void;
}

export const LiveStreamRoom: React.FC<LiveStreamRoomProps> = ({ user, onLeave }) => {
  const [roomCode, setRoomCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(!user.isOwner);
  const [participants, setParticipants] = useState([
    { id: '1', name: user.name, email: user.email, isOwner: user.isOwner }
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const startStream = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });
      
      setLocalStream(stream);
      
      if (user.isOwner) {
        const code = generateRoomCode();
        setRoomCode(code);
        setIsConnected(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start stream');
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!joinRoomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });
      
      setLocalStream(stream);
      setRoomCode(joinRoomCode.trim());
      setIsConnected(true);
      setShowJoinForm(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setIsConnected(false);
    setRoomCode('');
    setLocalStream(null);
    onLeave();
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

  const toggleAudio = () => {
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = newAudioEnabled;
      }
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const shareRoom = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join my Watch Party',
        text: `Join my live watch party with room code: ${roomCode}`,
        url: window.location.href
      });
    } else {
      copyRoomCode();
    }
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  if (!isConnected && !showJoinForm && user.isOwner) {
    return (
      <div className="min-h-screen bg-dark-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <BackButton to="/watch-party" />
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video size={40} className="text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Start Live Stream</h1>
            <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
              Create a live streaming room where you can watch content together with up to 3 friends. 
              As the owner, you can control the stream and invite others to join.
            </p>

            {error && (
              <div className="bg-error-500/10 text-error-500 p-4 rounded-lg mb-6 max-w-md mx-auto">
                {error}
              </div>
            )}

            <button
              onClick={startStream}
              disabled={isLoading}
              className="btn btn-primary text-lg px-8 py-4 disabled:opacity-50"
            >
              {isLoading ? 'Starting...' : 'Start Live Stream'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected && showJoinForm) {
    return (
      <div className="min-h-screen bg-dark-800 p-4">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <BackButton to="/watch-party" />
          </div>

          <div className="bg-dark-700 rounded-xl p-8 border border-dark-600">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Join Live Stream</h2>
              <p className="text-dark-300">Enter the room code to join the watch party</p>
            </div>

            {error && (
              <div className="bg-error-500/10 text-error-500 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="roomCode" className="block text-sm font-medium text-dark-200 mb-2">
                  Room Code
                </label>
                <input
                  id="roomCode"
                  type="text"
                  value={joinRoomCode}
                  onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors uppercase text-center text-lg font-mono tracking-wider"
                  maxLength={6}
                />
              </div>

              <button
                onClick={joinRoom}
                disabled={isLoading || joinRoomCode.length !== 6}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <BackButton to="/watch-party" />
            <div>
              <h1 className="text-2xl font-bold text-white">Live Stream Room</h1>
              <div className="flex items-center space-x-2 text-dark-300">
                <span>Room: {roomCode}</span>
                <button onClick={copyRoomCode} className="p-1 hover:text-white">
                  <Copy size={16} />
                </button>
                <button onClick={shareRoom} className="p-1 hover:text-white">
                  <Share size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-300">
              {participants.length}/4 participants
            </span>
            <button
              onClick={leaveRoom}
              className="btn bg-error-600 hover:bg-error-700 text-white flex items-center space-x-2"
            >
              <PhoneOff size={18} />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          {/* Local Video */}
          <div className="relative bg-dark-700 rounded-lg overflow-hidden aspect-video">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-dark-900/80 px-3 py-1 rounded-full">
              <div className="flex items-center space-x-2">
                {user.isOwner && <Crown size={16} className="text-yellow-500" />}
                <span className="text-white text-sm">You</span>
              </div>
            </div>
            {!videoEnabled && (
              <div className="absolute inset-0 bg-dark-600 flex items-center justify-center">
                <VideoOff size={48} className="text-dark-300" />
              </div>
            )}
          </div>

          {/* Empty slots */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-dark-700 rounded-lg border-2 border-dashed border-dark-500 aspect-video flex items-center justify-center">
              <div className="text-center text-dark-400">
                <UserX size={48} className="mx-auto mb-2" />
                <p className="text-sm">Waiting for participant...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              videoEnabled 
                ? 'bg-dark-600 hover:bg-dark-500 text-white' 
                : 'bg-error-600 hover:bg-error-700 text-white'
            }`}
          >
            {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-colors ${
              audioEnabled 
                ? 'bg-dark-600 hover:bg-dark-500 text-white' 
                : 'bg-error-600 hover:bg-error-700 text-white'
            }`}
          >
            {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
        </div>

        {/* Participants List */}
        <div className="mt-8 bg-dark-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center justify-between p-3 bg-dark-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  {participant.isOwner && <Crown size={20} className="text-yellow-500" />}
                  <div>
                    <p className="text-white font-medium">{participant.name}</p>
                    <p className="text-dark-300 text-sm">{participant.email}</p>
                  </div>
                </div>
                {participant.isOwner && (
                  <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-xs">
                    Owner
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};