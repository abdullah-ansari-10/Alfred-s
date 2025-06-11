import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { MainContent } from './MainContent';
import { Sidebar } from './Sidebar';
import { VideoChat } from './VideoChat';
import { WatchPartyRoom } from './WatchPartyRoom';
import { LiveStreamRoom } from './LiveStreamRoom';
import { ProfilePage } from './ProfilePage';
import { PreferencesPage } from './PreferencesPage';
import { Modal } from './Modal';
import { useStore } from '../store';

interface AuthenticatedAppProps {
  user: any;
  token: string;
  onLogout: () => void;
}

export const AuthenticatedApp: React.FC<AuthenticatedAppProps> = ({ user, token, onLogout }) => {
  const { 
    isVideoChatOpen, 
    isProfileModalOpen,
    isPreferencesModalOpen,
    toggleProfileModal,
    togglePreferencesModal
  } = useStore();

  const [isInLiveRoom, setIsInLiveRoom] = useState(false);

  const handleLeaveLiveRoom = () => {
    setIsInLiveRoom(false);
  };

  if (isInLiveRoom) {
    return <LiveStreamRoom user={user} onLeave={handleLeaveLiveRoom} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/watch-party" element={<WatchPartyRoom />} />
        <Route path="/live-stream" element={<LiveStreamRoom user={user} onLeave={handleLeaveLiveRoom} />} />
        <Route
          path="/watch"
          element={
            <div className="flex h-screen overflow-hidden bg-dark-800">
              <div className="flex-1 flex flex-col overflow-hidden">
                <MainContent />
                {isVideoChatOpen && <VideoChat />}
              </div>
              <Sidebar />
            </div>
          }
        />
      </Routes>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={toggleProfileModal}
        title="Profile Settings"
      >
        <ProfilePage />
      </Modal>

      <Modal
        isOpen={isPreferencesModalOpen}
        onClose={togglePreferencesModal}
        title="Preferences"
      >
        <PreferencesPage />
      </Modal>
    </Router>
  );
};