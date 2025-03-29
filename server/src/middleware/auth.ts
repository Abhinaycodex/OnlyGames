import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production'

// Define the decoded JWT token structure
interface JwtPayload {
  userId: string;
  isCreator?: boolean;
  iat?: number;
  exp?: number;
}

// Extend the Request type for auth
export interface AuthRequest extends Request {
  user: JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new Error('No token provided')
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
      
      // Check token expiration explicitly
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({ error: 'Token expired' })
      }
      
      // Attach the decoded user to the request
      (req as AuthRequest).user = decoded
      
      next()
    } catch (jwtError) {
      if ((jwtError as Error).name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      }
      if ((jwtError as Error).name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' })
      }
      throw jwtError
    }
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Please authenticate.' })
  }
}

export const isCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user.isCreator) {
      return res.status(403).json({ message: 'Access denied. Creator privileges required.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
} 