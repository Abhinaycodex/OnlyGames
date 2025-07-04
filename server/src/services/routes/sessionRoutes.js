import express from 'express'
import { auth } from '../../middleware/auth.js'
import {
  bookSession,
  getUserSessions,
  updateSessionStatus
} from '../controllers/sessionController.js'

const router = express.Router()

router.post('/book', auth, bookSession)
router.get('/my-sessions', auth, getUserSessions)
router.patch('/:sessionId/status', auth, updateSessionStatus)

export default router
