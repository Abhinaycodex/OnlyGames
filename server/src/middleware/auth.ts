import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
    
    // Attach the decoded user to the request
    (req as AuthRequest).user = decoded
    
    next()
  } catch (error) {
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