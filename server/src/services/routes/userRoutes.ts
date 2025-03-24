import express, { Request, Response } from 'express'
import { auth, AuthRequest } from '../../middleware/auth'
import {
  register,
  login,
  creatorLogin,
  getProfile,
  updateProfile,
  subscribeToCreator,
  getUserStats,
  getCreatorStats
} from '../controllers/userController'

const router = express.Router()

// Helper to convert AuthRequest controllers to standard Express handlers
const withAuth = (fn: (req: AuthRequest, res: Response) => Promise<any>) => {
  return (req: Request, res: Response) => fn(req as AuthRequest, res)
}

// Authentication routes
router.post('/register', register)
router.post('/login', login)
router.post('/creator-login', creatorLogin)

// Protected user routes
router.get('/profile', auth, withAuth(getProfile))
router.patch('/profile', auth, withAuth(updateProfile))
router.post('/subscribe/:creatorId', auth, withAuth(subscribeToCreator))

// Stats routes
router.get('/stats', auth, withAuth(getUserStats))
router.get('/creator-stats', auth, withAuth(getCreatorStats))

export default router 