import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import User, { IUser } from '../../models/User'

// Get JWT configuration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'

// Extend the Express Request type to include user property
interface AuthRequest extends Request {
  user: {
    userId: string;
  };
}

// Define token payload type
interface TokenPayload {
  userId: string;
  isCreator?: boolean;
}

// Generate JWT token helper
const generateToken = (payload: TokenPayload): string => {
  const options: SignOptions = { 
    expiresIn: JWT_EXPIRY 
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, isCreator } = req.body

    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = new User({
      username,
      email,
      password,
      isCreator: isCreator || false
    })

    await user.save()

    const token = generateToken({ userId: user._id })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator,
        creatorProfile: user.creatorProfile
      }
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: 'Error creating user', details: error.message })
    } else {
      res.status(400).json({ error: 'Error creating user' })
    }
  }
}

// Regular user login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, type } = req.body
    
    // Find user
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Check if trying to login as creator but account is not a creator
    if (type === 'creator' && !user.isCreator) {
      return res.status(401).json({ error: 'This account is not a creator account' })
    }
    
    // Check password
    const isMatch = await (user as IUser).comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate JWT token
    const token = generateToken({ 
      userId: user._id,
      isCreator: user.isCreator
    })
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator,
        creatorProfile: user.isCreator ? user.creatorProfile : undefined
      }
    })
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' })
  }
}

// Creator-specific login
export const creatorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    
    // Find user who is a creator
    const user = await User.findOne({ email, isCreator: true })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid creator credentials' })
    }
    
    // Check password
    const isMatch = await (user as IUser).comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid creator credentials' })
    }
    
    // Check creator verification status
    if (user.creatorProfile?.verificationStatus === 'rejected') {
      return res.status(403).json({ error: 'Your creator account has been rejected. Please contact support.' })
    }
    
    // Generate JWT token with creator flag
    const token = generateToken({ 
      userId: user._id,
      isCreator: true 
    })
    
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator,
        creatorProfile: user.creatorProfile
      }
    })
  } catch (error) {
    res.status(400).json({ error: 'Error logging in as creator' })
  }
}

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['username', 'email', 'bio', 'games', 'subscriptionPrice']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' })
  }

  try {
    const user = await User.findById(req.user.userId) as IUser | null
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        (user as any)[update] = req.body[update]
      }
    })

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' })
  }
}

export const subscribeToCreator = async (req: AuthRequest, res: Response) => {
  try {
    const creator = await User.findById(req.params.creatorId)
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' })
    }

    if (!creator.isCreator) {
      return res.status(400).json({ error: 'User is not a creator' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.subscribers.includes(creator._id)) {
      return res.status(400).json({ error: 'Already subscribed' })
    }

    user.subscribers.push(creator._id)
    
    // Update the creator's subscriberCount in their profile
    if (creator.creatorProfile) {
      creator.creatorProfile.subscriberCount += 1;
      await creator.save();
    }
    
    await user.save()

    res.json({ message: 'Successfully subscribed' })
  } catch (error) {
    res.status(400).json({ error: 'Error subscribing' })
  }
}

// Regular user stats
export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Basic user stats
    const stats = {
      subscribers: user.subscribers?.length || 0,
      revenue: 0, 
      activeSessions: 0,
      
      // Generate some placeholder activities
      activities: [
        {
          id: '1',
          type: 'Activity',
          description: 'Your recent gameplay activity',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: {
            id: user._id,
            username: user.username,
            initials: user.username.slice(0, 2).toUpperCase()
          }
        }
      ]
    };
    
    res.json(stats);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user stats' });
  }
}

// Creator-specific stats
export const getCreatorStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    
    // Get creator data with populated subscribers
    const creator = await User.findById(userId)
      .populate('subscribers', 'username email');
      
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    
    if (!creator.isCreator) {
      return res.status(403).json({ error: 'Unauthorized: User is not a creator' });
    }
    
    const subscriberCount = creator.subscribers?.length || 0;
    const creatorProfile = creator.creatorProfile || {
      contentCount: 0,
      totalRevenue: 0,
      subscriberCount: 0,
      contentCategories: [],
      featured: false,
      verificationStatus: 'pending'
    };
    
    // Fetch real data from database
    const stats = {
      subscribers: subscriberCount,
      revenue: creatorProfile.totalRevenue || subscriberCount * 5, // $5 per subscriber
      contentCount: creatorProfile.contentCount || 0,
      verificationStatus: creatorProfile.verificationStatus,
      activeSessions: Math.floor(Math.random() * 20) + 1, // Random for demo
      
      // Generate some real subscriber activities
      activities: creator.subscribers.slice(0, 5).map((sub: any, index: number) => ({
        id: index.toString(),
        type: 'New Subscriber',
        description: `${sub.username} subscribed to your content`,
        timestamp: new Date(Date.now() - 1000 * 60 * (index + 1) * 30).toISOString(),
        user: {
          id: sub._id,
          username: sub.username,
          initials: sub.username.slice(0, 2).toUpperCase()
        }
      }))
    };
    
    if (stats.activities.length === 0) {
      stats.activities = [{
        id: '1',
        type: 'Creator Status',
        description: 'Your creator account is active',
        timestamp: new Date().toISOString(),
        user: {
          id: creator._id.toString(),
          username: creator.username,
          initials: creator.username.slice(0, 2).toUpperCase()
        }
      }];
    }
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching creator stats:', error);
    res.status(400).json({ error: 'Error fetching creator stats' });
  }
}; 