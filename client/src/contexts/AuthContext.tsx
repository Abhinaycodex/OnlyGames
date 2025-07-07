import React, { createContext, useContext, useState, useEffect } from 'react';
import { GamerProfile } from '../data/dummyData';

// Define a user type that works with our API
export interface User {
  id: string;
  username: string;
  email: string;
  isCreator: boolean;
  name?: string;
  avatar?: string;
  bio?: string;
  followers?: number;
  rating?: number;
  games?: string[];
  socialLinks?: Record<string, string>;
  [key: string]: any; // For additional dynamic fields
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  isCreator?: boolean;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

interface AuthContextType {
  user: GamerProfile | User | null;
  loading: boolean;
  isInitialized: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  socialLogin: (provider: 'google' | 'facebook') => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User | GamerProfile) => void;
  updateProfile: (updates: Partial<User>) => Promise<AuthResponse>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token management utilities
const getToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const setToken = (token: string): void => {
  try {
    localStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

const removeToken = (): void => {
  try {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

// API request helper with token
const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    removeToken();
    // Don't redirect here, let the component handle it
  }

  return response;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GamerProfile | User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getToken();
        const storedUser = localStorage.getItem('user');
        
        if (!token && !storedUser) {
          setIsInitialized(true);
          return;
        }

        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Invalid stored user data:', error);
            removeToken();
          }
        }

        // Verify token with backend if available
        if (token) {
          try {
            const response = await makeAuthenticatedRequest('/api/auth/verify');
            if (response.ok) {
              const result = await response.json();
              if (result.user) {
                setUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
              }
            } else {
              removeToken();
              setUser(null);
            }
          } catch (error) {
            console.warn('Token verification failed:', error);
            // Keep user data but token might be invalid
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        removeToken();
        setUser(null);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Login failed. Please check your credentials.',
        };
      }

      if (result.token) {
        setToken(result.token);
      }
      
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));

      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error('Login error:', errorMessage);
      return {
        success: false,
        error: 'Unable to connect to server. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Registration failed. Please try again.',
        };
      }

      if (result.token) {
        setToken(result.token);
      }
      
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));

      return { success: true, user: result.user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error('Registration error:', errorMessage);
      return {
        success: false,
        error: 'Unable to connect to server. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'facebook'): Promise<AuthResponse> => {
    setLoading(true);
    try {
      // For production, this would redirect to OAuth provider
      // For now, using dummy data for development
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        // Simulate OAuth login with dummy data
        const dummyUser: User = {
          id: `${provider}_${Date.now()}`,
          name: provider === 'google' ? 'John Doe' : 'Jane Smith',
          username: provider === 'google' ? 'johndoe' : 'janesmith',
          email: provider === 'google' ? 'john@gmail.com' : 'jane@facebook.com',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider}`,
          bio: 'Gaming Enthusiast | Content Creator',
          followers: 0,
          rating: 0,
          isCreator: false,
          games: [],
          socialLinks: {}
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(dummyUser);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        
        return { success: true, user: dummyUser };
      } else {
        // Production OAuth flow
        const response = await fetch(`/api/auth/${provider}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: result.message || `${provider} login failed`,
          };
        }

        if (result.token) {
          setToken(result.token);
        }
        
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));

        return { success: true, user: result.user };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error(`${provider} login error:`, errorMessage);
      return {
        success: false,
        error: `Unable to login with ${provider}. Please try again.`,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    try {
      const response = await makeAuthenticatedRequest(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || 'Profile update failed',
        };
      }

      const updatedUser = { ...user, ...result };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      console.error('Profile update error:', errorMessage);
      return {
        success: false,
        error: 'Unable to update profile. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await makeAuthenticatedRequest('/api/auth/refresh', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.token) {
          setToken(result.token);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    removeToken();
    
    // Optional: Notify backend to invalidate token
    try {
      const token = getToken();
      if (token) {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // Silent fail for logout endpoint
        });
      }
    } catch (error) {
      console.warn('Failed to notify server of logout:', error);
    }
  };

  // Auto-refresh token before expiry
  useEffect(() => {
    const token = getToken();
    if (!token || !user) return;

    const interval = setInterval(() => {
      refreshToken().then(success => {
        if (!success) {
          logout();
        }
      });
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    loading,
    isInitialized,
    login,
    register,
    socialLogin,
    logout,
    isAuthenticated: !!user,
    setUser,
    updateProfile,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}