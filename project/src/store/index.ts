import { create } from 'zustand';

interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  currentVideoId: string | null;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  setCurrentVideoId: (videoId: string | null) => void;
}

interface UIState {
  isVideoChatOpen: boolean;
  isSidebarOpen: boolean;
  isProfileModalOpen: boolean;
  isPreferencesModalOpen: boolean;
  toggleVideoChat: () => void;
  toggleSidebar: () => void;
  toggleProfileModal: () => void;
  togglePreferencesModal: () => void;
}

interface ChatState {
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: number;
  }>;
  addMessage: (sender: string, content: string) => void;
}

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  setAuth: (isAuthenticated: boolean, user: AuthState['user']) => void;
}

interface Store extends VideoState, UIState, ChatState, AuthState {}

export const useStore = create<Store>((set) => ({
  // Video State
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  playbackRate: 1,
  currentVideoId: null,
  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  setCurrentVideoId: (currentVideoId) => set({ currentVideoId }),
  
  // UI State - Video chat enabled by default
  isVideoChatOpen: false,
  isSidebarOpen: false,
  isProfileModalOpen: false,
  isPreferencesModalOpen: false,
  toggleVideoChat: () => set((state) => ({ isVideoChatOpen: !state.isVideoChatOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleProfileModal: () => set((state) => ({ isProfileModalOpen: !state.isProfileModalOpen })),
  togglePreferencesModal: () => set((state) => ({ isPreferencesModalOpen: !state.isPreferencesModalOpen })),
  
  // Chat State
  messages: [],
  addMessage: (sender, content) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: Date.now().toString(),
        sender,
        content,
        timestamp: Date.now(),
      }
    ]
  })),

  // Auth State
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
}));