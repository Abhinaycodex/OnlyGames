import React, { createContext, useContext, useState, useEffect } from 'react';
import { GamerProfile } from '../data/dummyData';

interface AuthContextType {
  user: GamerProfile | null;
  loading: boolean;
  login: (provider: 'google' | 'facebook') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<GamerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      // Simulate OAuth login with dummy data
      const dummyUser = {
        id: "4",
        name: "John Doe",
        username: "johndoe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        bio: "Gaming Enthusiast | Content Creator",
        followers: 0,
        rating: 0,
        isCreator: false,
        games: [],
        socialLinks: {}
      };
      
      setUser(dummyUser);
      localStorage.setItem('user', JSON.stringify(dummyUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user
    }}>
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