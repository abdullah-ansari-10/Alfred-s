import { io, Socket } from 'socket.io-client';

export interface Participant {
  socketId: string;
  name: string;
  email: string;
  isOwner: boolean;
  stream?: MediaStream;
}

export interface RoomInfo {
  code: string;
  participantCount: number;
  maxParticipants: number;
  participants: Participant[];
}

class WebRTCService {
  public socket: Socket | null = null;
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private participants: Map<string, Participant> = new Map();
  
  // ICE servers configuration
  private iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    // Add TURN servers for production
    // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
  ];

  // Event callbacks
  public onRoomCreated?: (roomCode: string, room: RoomInfo) => void;
  public onRoomJoined?: (roomCode: string, room: RoomInfo) => void;
  public onUserJoined?: (user: Participant, room: RoomInfo) => void;
  public onUserLeft?: (user: Participant, room: RoomInfo) => void;
  public onRoomClosed?: () => void;
  public onStreamReceived?: (socketId: string, stream: MediaStream) => void;
  public onError?: (error: string) => void;
  public onAuthenticated?: (user: any, room: RoomInfo | null) => void;

  connect(token: string) {
    // Get the current origin and construct server URL
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname;
    
    // For WebContainer, use the current origin
    let serverUrl = `${protocol}//${hostname}`;
    
    // If we're on localhost, try to use the backend port
    if (hostname === 'localhost') {
      serverUrl = 'http://localhost:3001';
    } else if (hostname.includes('webcontainer') || hostname.includes('stackblitz')) {
      // For WebContainer, replace the port in the URL
      const currentPort = window.location.port;
      if (currentPort) {
        serverUrl = window.location.origin.replace(`:${currentPort}`, ':3001');
      }
    }

    console.log('Connecting to server:', serverUrl);
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      timeout: 20000,
      forceNew: true
    });

    this.setupSocketListeners();
    
    // Authenticate immediately after connection
    this.socket.on('connect', () => {
      console.log('Connected to server, authenticating...');
      this.socket?.emit('authenticate', { token });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.onError?.('Failed to connect to server. Please try again.');
    });
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('authenticated', (data) => {
      console.log('Authenticated:', data.user);
      this.onAuthenticated?.(data.user, data.room);
    });

    this.socket.on('auth_error', (data) => {
      console.error('Auth error:', data.error);
      this.onError?.(data.error);
    });

    this.socket.on('room_created', (data) => {
      console.log('Room created:', data.roomCode);
      this.onRoomCreated?.(data.roomCode, data.room);
    });

    this.socket.on('room_joined', (data) => {
      console.log('Room joined:', data.roomCode);
      this.onRoomJoined?.(data.roomCode, data.room);
    });

    this.socket.on('user_joined', (data) => {
      console.log('User joined:', data.user);
      this.onUserJoined?.(data.user, data.room);
    });

    this.socket.on('user_left', (data) => {
      console.log('User left:', data.user);
      this.cleanupPeerConnection(data.user.socketId);
      this.onUserLeft?.(data.user, data.room);
    });

    this.socket.on('room_closed', () => {
      console.log('Room closed');
      this.cleanup();
      this.onRoomClosed?.();
    });

    this.socket.on('webrtc_offer', async (data) => {
      await this.handleOffer(data.fromSocketId, data.offer);
    });

    this.socket.on('webrtc_answer', async (data) => {
      await this.handleAnswer(data.fromSocketId, data.answer);
    });

    this.socket.on('webrtc_ice_candidate', async (data) => {
      await this.handleIceCandidate(data.fromSocketId, data.candidate);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data.message);
      this.onError?.(data.message);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.cleanup();
    });
  }

  async startLocalStream(video: boolean = true, audio: boolean = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { width: 1280, height: 720 } : false,
        audio: audio
      });
      
      console.log('Local stream started');
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw new Error('Failed to access camera/microphone');
    }
  }

  createRoom() {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('create_room');
  }

  joinRoom(roomCode: string) {
    if (!this.socket) {
      throw new Error('Not connected to server');
    }
    this.socket.emit('join_room', { roomCode: roomCode.toUpperCase() });
  }

  leaveRoom() {
    if (!this.socket) return;
    
    this.socket.emit('leave_room');
    this.cleanup();
  }

  private async createPeerConnection(socketId: string): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection({ iceServers: this.iceServers });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log('Received remote stream from:', socketId);
      const [remoteStream] = event.streams;
      this.onStreamReceived?.(socketId, remoteStream);
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.emit('webrtc_ice_candidate', {
          targetSocketId: socketId,
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${socketId}:`, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        this.cleanupPeerConnection(socketId);
      }
    };

    this.peerConnections.set(socketId, pc);
    return pc;
  }

  private async handleOffer(fromSocketId: string, offer: RTCSessionDescriptionInit) {
    try {
      const pc = await this.createPeerConnection(fromSocketId);
      
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (this.socket) {
        this.socket.emit('webrtc_answer', {
          targetSocketId: fromSocketId,
          answer: answer
        });
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  }

  private async handleAnswer(fromSocketId: string, answer: RTCSessionDescriptionInit) {
    try {
      const pc = this.peerConnections.get(fromSocketId);
      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  }

  private async handleIceCandidate(fromSocketId: string, candidate: RTCIceCandidateInit) {
    try {
      const pc = this.peerConnections.get(fromSocketId);
      if (pc) {
        await pc.addIceCandidate(candidate);
      }
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  }

  async initiateCall(targetSocketId: string) {
    try {
      const pc = await this.createPeerConnection(targetSocketId);
      
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (this.socket) {
        this.socket.emit('webrtc_offer', {
          targetSocketId: targetSocketId,
          offer: offer
        });
      }
    } catch (error) {
      console.error('Error initiating call:', error);
    }
  }

  private cleanupPeerConnection(socketId: string) {
    const pc = this.peerConnections.get(socketId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(socketId);
    }
    this.participants.delete(socketId);
  }

  private cleanup() {
    // Close all peer connections
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.participants.clear();

    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  disconnect() {
    this.cleanup();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getLocalStream() {
    return this.localStream;
  }

  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = enabled;
      }
    }
  }

  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = enabled;
      }
    }
  }
}

export const webrtcService = new WebRTCService();