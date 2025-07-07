// ✅ Login input
export interface LoginData {
  email: string;
  password: string;
}

// ✅ Register input
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  isCreator?: boolean;
}

// ✅ Minimal User type based on backend — extend if needed
export interface User {
  id: string;
  username: string;
  email: string;
  isCreator?: boolean;
  [key: string]: any; // allows flexibility for future fields like profilePicture, bio, etc.
}

// ✅ Context type
export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}
