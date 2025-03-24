import axios, { InternalAxiosRequestConfig } from 'axios';
import { log } from 'console';

// Response interfaces
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    isCreator: boolean;
    creatorProfile?: CreatorProfile;
  };
}

interface CreatorProfile {
  contentCount: number;
  totalRevenue: number;
  subscriberCount: number;
  contentCategories: string[];
  featured: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

// Request interfaces
interface RegisterData {
  username: string;
  email: string;
  password: string;
  isCreator?: boolean;
}

interface LoginError {
  error: string;
}

// Token management
const TOKEN_KEY = 'token';
const USER_TYPE_KEY = 'user_type'; // 'user' or 'creator'

const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const removeToken = () => localStorage.removeItem(TOKEN_KEY);

const getUserType = () => localStorage.getItem(USER_TYPE_KEY);
const setUserType = (type: 'user' | 'creator') => localStorage.setItem(USER_TYPE_KEY, type);
const removeUserType = () => localStorage.removeItem(USER_TYPE_KEY);

// Get the API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API URL:', API_URL);

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header if token exists
API.interceptors.request.use((req: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  return req;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => {
    console.log('Response status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      removeToken();
      removeUserType();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// User Registration
export const register = async (userData: RegisterData): Promise<LoginResponse> => {
  try {
    // Validate input
    if (!userData.email || !userData.password || !userData.username) {
      throw new Error('All fields are required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    // Password validation
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    console.log('Sending registration request with data:', {
      username: userData.username,
      email: userData.email,
      isCreator: userData.isCreator || false,
      passwordLength: userData.password.length
    });

    // Try the request with proper error handling
    try {
      const response = await API.post<LoginResponse>('/users/register', userData);
      console.log('Registration successful. Response:', response);
      
      const { token, user } = response.data;
      console.log('Token received:', token ? 'Yes' : 'No');
      console.log('User data received:', user);

      // Store token and user type in localStorage
      if (token) {
        setToken(token);
        setUserType(user.isCreator ? 'creator' : 'user');
        console.log('Token stored in localStorage');
        console.log('User type stored:', user.isCreator ? 'creator' : 'user');
      } else {
        console.error('No token received from server');
      }
      
      return response.data;
    } catch (requestError) {
      console.error('Request error during registration:', requestError);
      if (axios.isAxiosError(requestError)) {
        console.error('Response status:', requestError.response?.status);
        console.error('Response data:', requestError.response?.data);
        
        // CORS errors won't have a response
        if (!requestError.response) {
          throw new Error('Network error - the server may be down or CORS is not enabled');
        }
        
        const errorMessage = requestError.response?.data?.error || 'Registration failed';
        console.error('Error message:', errorMessage);
        throw new Error(errorMessage);
      }
      throw requestError;
    }
  } catch (error: unknown) {
    console.error('Error in registration process:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// User Login (regular users)
export const userLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    validateLoginInput(email, password);
    const response = await API.post<LoginResponse>('/users/login', { email, password, type: 'user' });
    handleLoginResponse(response.data);
    return response.data;
  } catch (error) {
    handleLoginError(error);
    throw error;
  }
};

// Creator Login (content creators)
export const creatorLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    validateLoginInput(email, password);
    const response = await API.post<LoginResponse>('/users/creator-login', { email, password, type: 'creator' });
    handleLoginResponse(response.data);
    return response.data;
  } catch (error) {
    handleLoginError(error);
    throw error;
  }
};

// Generic login function that redirects to appropriate login based on user type
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    validateLoginInput(email, password);
    const response = await API.post<LoginResponse>('/users/login', { email, password });
    
    // Store token and set user type
    const { token, user } = response.data;
    setToken(token);
    setUserType(user.isCreator ? 'creator' : 'user');
    
    return response.data;
  } catch (error: unknown) {
    handleLoginError(error);
    throw error;
  }
};

// Input validation helper for login
function validateLoginInput(email: string, password: string) {
  // Validate input
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

// Helper to handle login response
function handleLoginResponse(data: LoginResponse) {
  const { token, user } = data;
  setToken(token);
  setUserType(user.isCreator ? 'creator' : 'user');
  console.log(`Logged in as ${user.isCreator ? 'creator' : 'user'}: ${user.username}`);
}

// Helper to handle login errors
function handleLoginError(error: unknown) {
  console.error('Login error:', error);
  if (axios.isAxiosError(error)) {
    // CORS errors won't have a response
    if (!error.response) {
      throw new Error('Network error - the server may be down or CORS is not enabled');
    }
    const errorMessage = error.response?.data?.error || 'Login failed';
    throw new Error(errorMessage);
  }
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('An unexpected error occurred');
}

export const logout = () => {
  removeToken();
  removeUserType();
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isCreator = (): boolean => {
  return getUserType() === 'creator';
};

export const getProfile = async (): Promise<any> => {
  try {
    console.log('Fetching user profile');
    const response = await API.get('/users/profile');
    console.log('Profile data:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching profile:', error);
    if (axios.isAxiosError(error)) {
      // CORS errors won't have a response
      if (!error.response) {
        throw new Error('Network error - the server may be down or CORS is not enabled');
      }
      const errorMessage = error.response?.data?.error || 'Failed to fetch profile';
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getUserStats = async (): Promise<any> => {
  try {
    console.log('Fetching user stats');
    // Different endpoints based on user type
    const endpoint = isCreator() ? '/users/creator-stats' : '/users/stats';
    const response = await API.get(endpoint);
    console.log('Stats data:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching stats:', error);
    if (axios.isAxiosError(error)) {
      // Return empty stats on error to avoid breaking the dashboard
      console.log('Returning default stats due to error');
      return {
        subscribers: 0,
        revenue: 0,
        activeSessions: 0,
        activities: []
      };
    }
    return {
      subscribers: 0,
      revenue: 0,
      activeSessions: 0,
      activities: []
    };
  }
};

export default API;