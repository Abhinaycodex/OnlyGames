import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: any
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' })
  }
}

export const isCreator = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isCreator) {
      return res.status(403).json({ message: 'Access denied. Creator privileges required.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
} 