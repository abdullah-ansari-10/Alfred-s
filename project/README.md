# Watch Together - Secure Live Streaming App

A secure live video streaming watch-party application built with WebRTC, Node.js, and Google OAuth2 authentication.

## 🚀 Features

- **Secure Authentication**: Google OAuth2 with server-side token verification
- **Live Video Streaming**: WebRTC-based peer-to-peer video/audio streaming
- **Room Management**: Unique 6-character room codes with owner privileges
- **Privacy First**: No personal data logging, end-to-end encrypted connections
- **Rate Limited**: Built-in security measures and input validation
- **Responsive Design**: Works on desktop and mobile devices

## 🔒 Security Features

- Server-side Google OAuth2 token verification
- Owner-only room creation (hardcoded email authorization)
- Input sanitization and validation
- Rate limiting on API endpoints
- HTTPS support for local development
- WebRTC STUN/TURN server configuration
- No personal information logging

## 🛠 Setup Instructions

### 1. Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth2 credentials:
   - Application type: Web application
   - Authorized origins: `http://localhost:5173`, `https://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`, `https://localhost:5173`
5. Copy the Client ID and Client Secret

### 2. Environment Configuration

Create `.env` file in the root directory:

```env
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Owner Configuration (replace with your Gmail)
OWNER_EMAIL=your-email@gmail.com

# Server Configuration
PORT=3001
NODE_ENV=development
```

Create `.env.local` file in the root directory:

```env
# Frontend Environment Variables
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server (runs both frontend and backend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 4. HTTPS Setup (Optional but Recommended)

For full WebRTC functionality, HTTPS is recommended:

#### Option A: Using mkcert (Local Development)

```bash
# Install mkcert
brew install mkcert  # macOS
# or
choco install mkcert  # Windows
# or
sudo apt install libnss3-tools && wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64 && chmod +x mkcert && sudo mv mkcert /usr/local/bin/  # Linux

# Create local CA
mkcert -install

# Generate certificates
mkdir certs
mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1
```

#### Option B: Using ngrok

```bash
# Install ngrok
npm install -g ngrok

# In one terminal, start the app
npm run dev

# In another terminal, expose with HTTPS
ngrok http 5173
```

## 🏗 Architecture

### Backend (Node.js + Socket.IO)
- Express.js server with security middleware
- Socket.IO for WebRTC signaling
- Google OAuth2 token verification
- Room management with owner privileges
- Rate limiting and input validation

### Frontend (React + TypeScript)
- React with TypeScript for type safety
- WebRTC service for peer-to-peer connections
- Google OAuth2 integration
- Responsive design with Tailwind CSS
- Real-time UI updates via Socket.IO

### Security Measures
- Server-side token verification
- Owner-only room creation
- Input sanitization
- Rate limiting
- HTTPS enforcement
- No personal data logging

## 📱 Usage

### For Room Owners
1. Sign in with Google OAuth2
2. Click "Enter Live Stream"
3. Click "Start Live Stream" to create a room
4. Share the 6-character room code with friends
5. Control the room and manage participants

### For Participants
1. Sign in with Google OAuth2
2. Click "Enter Live Stream"
3. Enter the room code provided by the owner
4. Join the live video stream

## 🔧 Configuration

### Room Settings
- Maximum 4 participants per room
- One active room at a time
- Owner controls room lifecycle
- Automatic cleanup on disconnect

### WebRTC Configuration
- Google STUN servers for ICE
- Prepared for TURN server integration
- Automatic peer connection management
- Video/audio toggle controls

## 🚀 Production Deployment

1. Set up HTTPS certificates
2. Configure TURN servers for better connectivity
3. Update CORS origins in server configuration
4. Set `NODE_ENV=production`
5. Configure proper domain in Google OAuth2 settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- Only the hardcoded owner email can create rooms
- All connections are peer-to-peer via WebRTC
- No video/audio data passes through the server
- Room codes are automatically generated and unique
- Rooms are automatically closed when the owner leaves