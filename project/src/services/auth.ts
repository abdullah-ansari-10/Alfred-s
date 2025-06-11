export interface User {
  email: string;
  name: string;
  picture: string;
  isOwner: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

class AuthService {
  async verifyGoogleToken(token: string): Promise<AuthResponse> {
    try {
      // For demo mode, return success immediately
      if (token === 'demo-token') {
        return {
          success: true,
          user: {
            email: 'demo@example.com',
            name: 'Demo User',
            picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            isOwner: true
          }
        };
      }

      // For actual Google tokens, you would verify with your backend
      // For now, we'll simulate a successful response
      return {
        success: true,
        user: {
          email: 'user@example.com',
          name: 'User',
          picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          isOwner: false
        }
      };
    } catch (error) {
      console.error('Auth verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  async getRoomInfo() {
    try {
      // Return mock room info for demo
      return { room: null };
    } catch (error) {
      console.error('Room info error:', error);
      return { room: null };
    }
  }
}

export const authService = new AuthService();