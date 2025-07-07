  import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

  interface User {
    id: string;
    username: string;
    email: string;
    isCreator?: boolean;
    [key: string]: any; // dynamic fields like bio, games, etc.
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
  }

  interface UserContextType {
    user: User | null;
    isLoading: boolean;
    isInitialized: boolean;
    login: (data: LoginData) => Promise<AuthResponse>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => Promise<AuthResponse>;
    refreshToken: () => Promise<boolean>;
  }

  const UserContext = createContext<UserContextType | undefined>(undefined);

  export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
  };

  interface Props {
    children: ReactNode;
  }

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
      window.location.href = '/login'; // Redirect to login
    }

    return response;
  };

  export const UserProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize user on mount
    useEffect(() => {
      const initializeUser = async () => {
        try {
          const token = getToken();
          if (!token) {
            setIsInitialized(true);
            return;
          }

          // Verify token with backend
          const response = await makeAuthenticatedRequest('/api/auth/verify');
          
          if (response.ok) {
            const result = await response.json();
            setUser(result.user);
          } else {
            removeToken();
          }
        } catch (error) {
          console.error('Failed to initialize user:', error);
          removeToken();
        } finally {
          setIsInitialized(true);
        }
      };

      initializeUser();
    }, []);

    const login = async (data: LoginData): Promise<AuthResponse> => {
      setIsLoading(true);
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
        
        // Store minimal user data in localStorage (optional)
        try {
          localStorage.setItem('user', JSON.stringify(result.user));
        } catch (error) {
          console.warn('Failed to store user data:', error);
        }

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
        console.error('Login error:', errorMessage);
        return {
          success: false,
          error: 'Unable to connect to server. Please try again.',
        };
      } finally {
        setIsLoading(false);
      }
    };

    const register = async (data: RegisterData): Promise<AuthResponse> => {
      setIsLoading(true);
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
        
        // Store minimal user data in localStorage (optional)
        try {
          localStorage.setItem('user', JSON.stringify(result.user));
        } catch (error) {
          console.warn('Failed to store user data:', error);
        }

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
        console.error('Registration error:', errorMessage);
        return {
          success: false,
          error: 'Unable to connect to server. Please try again.',
        };
      } finally {
        setIsLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      removeToken();
      
      // Optional: Notify backend to invalidate token
      try {
        fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        }).catch(() => {
          // Silent fail for logout endpoint
        });
      } catch (error) {
        console.warn('Failed to notify server of logout:', error);
      }
    };

    const updateProfile = async (updates: Partial<User>): Promise<AuthResponse> => {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      setIsLoading(true);
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
        
        // Update localStorage
        try {
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
          console.warn('Failed to update stored user data:', error);
        }

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
        console.error('Profile update error:', errorMessage);
        return {
          success: false,
          error: 'Unable to update profile. Please try again.',
        };
      } finally {
        setIsLoading(false);
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
        
        // If refresh fails, logout user
        logout();
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
        return false;
      }
    };

    // Auto-refresh token before expiry (optional)
    useEffect(() => {
      const token = getToken();
      if (!token || !user) return;

      const interval = setInterval(() => {
        refreshToken();
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(interval);
    }, [user]);

    const contextValue: UserContextType = {
      user,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      updateProfile,
      refreshToken,
    };

    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
  };