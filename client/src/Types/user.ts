
export interface IUser {
  id: string;
  username: string;
  email: string;
  isCreator: boolean;
  profilePicture: string;
  bio: string;
  games: string[];
  subscriptionPrice: number;
  subscribers: string[];
  createdAt: Date;
  creatorProfile?: {
    contentCount: number;
    totalRevenue: number;
    subscriberCount: number;
    contentCategories: string[];
    featured: boolean;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  isCreator?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserContextType {
  user: IUser | null;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: CreateUserData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<IUser>) => Promise<boolean>;
  isLoading: boolean;
}
