import express from 'express'
import { auth } from '../../middleware/auth.js'

import {
  register,
  login,
  creatorLogin,
  getProfile,
  updateProfile,
  subscribeToCreator,
  getUserStats,
  getCreatorStats
} from '../controllers/userController.js'

const router = express.Router()

// Helper to convert request with user (added by middleware)
const withAuth = (fn) => {
  return (req, res) => fn(req, res)
}

// Public auth routes
router.post('/register', register)
router.post('/login', login)
router.post('/creator-login', creatorLogin)

// Protected user routes
router.get('/profile', auth, withAuth(getProfile))
router.patch('/profile', auth, withAuth(updateProfile))
router.post('/subscribe/:creatorId', auth, withAuth(subscribeToCreator))

// Stats
router.get('/stats', auth, withAuth(getUserStats))
router.get('/creator-stats', auth, withAuth(getCreatorStats))

export default router
