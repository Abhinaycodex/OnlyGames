import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IUser, UserContextType, LoginData, CreateUserData } from '../Types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication logic
      console.log('Attempting login with:', data.email);
      
      // Mock user data for demonstration
      const mockUser: IUser = {
        id: '1',
        username: 'testuser',
        email: data.email,
        isCreator: false,
        profilePicture: '',
        bio: '',
        games: [],
        subscriptionPrice: 0,
        subscribers: [],
        createdAt: new Date()
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: CreateUserData): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting registration with:', data);
      
      // Mock registration - replace with actual API call
      const newUser: IUser = {
        id: Date.now().toString(),
        username: data.username,
        email: data.email,
        isCreator: data.isCreator || false,
        profilePicture: '',
        bio: '',
        games: [],
        subscriptionPrice: data.isCreator ? 9.99 : 0,
        subscribers: [],
        createdAt: new Date(),
        creatorProfile: data.isCreator ? {
          contentCount: 0,
          totalRevenue: 0,
          subscriberCount: 0,
          contentCategories: [],
          featured: false,
          verificationStatus: 'pending'
        } : undefined
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<IUser>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
