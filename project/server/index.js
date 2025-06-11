import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const server = createServer(app);

// More permissive CORS for WebContainer environment
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost and WebContainer origins
    if (origin.includes('localhost') || 
        origin.includes('webcontainer') || 
        origin.includes('stackblitz') ||
        origin.includes('local-credentialless')) {
      return callback(null, true);
    }
    
    // Allow production domains
    const allowedOrigins = [
      'https://your-domain.com',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Security middleware with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://*.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "wss:", "ws:", "https:", "http:"],
      mediaSrc: ["'self'", "https:", "blob:"],
      frameSrc: ["'self'", "https://accounts.google.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Google OAuth2 client - make it optional for development
let oauth2Client = null;
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
}

// Owner email (hardcoded for security)
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'demo@example.com';

// Room state management
class RoomManager {
  constructor() {
    this.activeRoom = null;
    this.participants = new Map(); // socketId -> userInfo
    this.maxParticipants = 4;
  }

  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  createRoom(ownerSocketId, ownerInfo) {
    if (this.activeRoom) {
      throw new Error('A room is already active');
    }

    const roomCode = this.generateRoomCode();
    this.activeRoom = {
      code: roomCode,
      owner: ownerSocketId,
      createdAt: new Date(),
      participants: new Set([ownerSocketId])
    };

    this.participants.set(ownerSocketId, {
      ...ownerInfo,
      isOwner: true,
      joinedAt: new Date()
    });

    console.log(`Room created: ${roomCode} by ${ownerInfo.email}`);
    return roomCode;
  }

  joinRoom(socketId, userInfo, roomCode) {
    if (!this.activeRoom || this.activeRoom.code !== roomCode) {
      throw new Error('Invalid room code');
    }

    if (this.activeRoom.participants.size >= this.maxParticipants) {
      throw new Error('Room is full');
    }

    if (this.activeRoom.participants.has(socketId)) {
      throw new Error('Already in room');
    }

    this.activeRoom.participants.add(socketId);
    this.participants.set(socketId, {
      ...userInfo,
      isOwner: false,
      joinedAt: new Date()
    });

    console.log(`User ${userInfo.email} joined room ${roomCode}`);
    return true;
  }

  leaveRoom(socketId) {
    if (!this.activeRoom) return false;

    const userInfo = this.participants.get(socketId);
    if (!userInfo) return false;

    this.activeRoom.participants.delete(socketId);
    this.participants.delete(socketId);

    console.log(`User ${userInfo.email} left room`);

    // If owner leaves or room is empty, close the room
    if (userInfo.isOwner || this.activeRoom.participants.size === 0) {
      console.log(`Room ${this.activeRoom.code} closed`);
      this.activeRoom = null;
      this.participants.clear();
      return 'room_closed';
    }

    return 'user_left';
  }

  getRoomInfo() {
    if (!this.activeRoom) return null;

    return {
      code: this.activeRoom.code,
      participantCount: this.activeRoom.participants.size,
      maxParticipants: this.maxParticipants,
      participants: Array.from(this.participants.entries()).map(([socketId, info]) => ({
        socketId,
        name: info.name,
        email: info.email.substring(0, 3) + '***', // Anonymize email
        isOwner: info.isOwner,
        joinedAt: info.joinedAt
      }))
    };
  }

  isUserInRoom(socketId) {
    return this.activeRoom && this.activeRoom.participants.has(socketId);
  }

  isOwner(socketId) {
    const userInfo = this.participants.get(socketId);
    return userInfo && userInfo.isOwner;
  }
}

const roomManager = new RoomManager();

// Utility functions
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>\"'&]/g, '').trim().substring(0, 1000);
}

async function verifyGoogleToken(token) {
  try {
    if (!oauth2Client) {
      // For development without OAuth setup, return demo user
      console.log('OAuth not configured, using demo mode');
      return {
        email: 'demo@example.com',
        name: 'Demo User',
        picture: 'https://via.placeholder.com/150',
        verified: true
      };
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      verified: payload.email_verified
    };
  } catch (error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid token');
  }
}

// API Routes
app.post('/api/auth/verify', 
  body('token').isString().isLength({ min: 1, max: 2000 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      const { token } = req.body;
      const userInfo = await verifyGoogleToken(token);
      
      if (!userInfo.verified) {
        return res.status(401).json({ error: 'Email not verified' });
      }

      const isOwner = userInfo.email === OWNER_EMAIL;
      
      res.json({
        success: true,
        user: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          isOwner
        }
      });
    } catch (error) {
      console.error('Auth verification error:', error.message);
      res.status(401).json({ error: 'Authentication failed' });
    }
  }
);

app.get('/api/room/info', (req, res) => {
  const roomInfo = roomManager.getRoomInfo();
  res.json({ room: roomInfo });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Authenticate socket connection
  socket.on('authenticate', async (data) => {
    try {
      const { token } = data;
      if (!token) {
        socket.emit('auth_error', { error: 'No token provided' });
        return;
      }

      const userInfo = await verifyGoogleToken(token);
      if (!userInfo.verified) {
        socket.emit('auth_error', { error: 'Email not verified' });
        return;
      }

      socket.userInfo = {
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        isOwner: userInfo.email === OWNER_EMAIL
      };

      socket.authenticated = true;
      socket.emit('authenticated', { 
        user: socket.userInfo,
        room: roomManager.getRoomInfo()
      });

      console.log(`Socket authenticated: ${userInfo.email}`);
    } catch (error) {
      console.error('Socket auth error:', error.message);
      socket.emit('auth_error', { error: 'Authentication failed' });
    }
  });

  // Create room (owner only)
  socket.on('create_room', () => {
    try {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      if (!socket.userInfo.isOwner) {
        socket.emit('error', { message: 'Only the owner can create rooms' });
        return;
      }

      const roomCode = roomManager.createRoom(socket.id, socket.userInfo);
      socket.join(roomCode);
      
      socket.emit('room_created', { 
        roomCode,
        room: roomManager.getRoomInfo()
      });

      console.log(`Room created by owner: ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Join room
  socket.on('join_room', (data) => {
    try {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const { roomCode } = data;
      if (!roomCode || typeof roomCode !== 'string') {
        socket.emit('error', { message: 'Invalid room code' });
        return;
      }

      const sanitizedRoomCode = sanitizeInput(roomCode).toUpperCase();
      
      roomManager.joinRoom(socket.id, socket.userInfo, sanitizedRoomCode);
      socket.join(sanitizedRoomCode);
      
      const roomInfo = roomManager.getRoomInfo();
      
      // Notify all participants
      socket.to(sanitizedRoomCode).emit('user_joined', {
        user: {
          name: socket.userInfo.name,
          email: socket.userInfo.email.substring(0, 3) + '***'
        },
        room: roomInfo
      });

      socket.emit('room_joined', { 
        roomCode: sanitizedRoomCode,
        room: roomInfo
      });

    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // WebRTC signaling
  socket.on('webrtc_offer', (data) => {
    if (!socket.authenticated || !roomManager.isUserInRoom(socket.id)) {
      return;
    }

    const { targetSocketId, offer } = data;
    if (targetSocketId && offer) {
      socket.to(targetSocketId).emit('webrtc_offer', {
        fromSocketId: socket.id,
        offer: offer
      });
    }
  });

  socket.on('webrtc_answer', (data) => {
    if (!socket.authenticated || !roomManager.isUserInRoom(socket.id)) {
      return;
    }

    const { targetSocketId, answer } = data;
    if (targetSocketId && answer) {
      socket.to(targetSocketId).emit('webrtc_answer', {
        fromSocketId: socket.id,
        answer: answer
      });
    }
  });

  socket.on('webrtc_ice_candidate', (data) => {
    if (!socket.authenticated || !roomManager.isUserInRoom(socket.id)) {
      return;
    }

    const { targetSocketId, candidate } = data;
    if (targetSocketId && candidate) {
      socket.to(targetSocketId).emit('webrtc_ice_candidate', {
        fromSocketId: socket.id,
        candidate: candidate
      });
    }
  });

  // Leave room
  socket.on('leave_room', () => {
    handleUserLeave(socket);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    handleUserLeave(socket);
  });

  function handleUserLeave(socket) {
    if (!socket.authenticated || !roomManager.isUserInRoom(socket.id)) {
      return;
    }

    const roomInfo = roomManager.getRoomInfo();
    const result = roomManager.leaveRoom(socket.id);
    
    if (roomInfo) {
      if (result === 'room_closed') {
        // Notify all participants that room is closed
        io.to(roomInfo.code).emit('room_closed');
        io.in(roomInfo.code).socketsLeave(roomInfo.code);
      } else {
        // Notify remaining participants
        socket.to(roomInfo.code).emit('user_left', {
          user: {
            name: socket.userInfo?.name,
            email: socket.userInfo?.email?.substring(0, 3) + '***'
          },
          room: roomManager.getRoomInfo()
        });
      }
    }
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Owner email: ${OWNER_EMAIL}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server accessible at: http://localhost:${PORT}`);
});