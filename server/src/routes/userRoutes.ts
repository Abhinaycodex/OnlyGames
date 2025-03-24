import express from 'express'
import jwt from 'jsonwebtoken'
import { Document, Types } from 'mongoose'
import User, { IUser } from '../models/User'
import { auth } from '../middleware/auth'

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body)
    const { username, email, password, isCreator } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      console.log('User already exists:', { email, username })
      return res.status(400).json({ error: 'User already exists' })
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      isCreator: isCreator || false
    })

    console.log('Attempting to save user:', { username, email, isCreator })
    await user.save()
    console.log('User saved successfully:', user._id)

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator
      }
    })
  } catch (error: unknown) {
    console.error('Error in registration:', error)
    if (error instanceof Error) {
      res.status(400).json({ error: 'Error creating user', details: error.message })
    } else {
      res.status(400).json({ error: 'Error creating user' })
    }
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await (user as IUser).comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: user.isCreator
      }
    })
  } catch (error) {
    res.status(400).json({ error: 'Error logging in' })
  }
})

// Get user profile
router.get('/profile', auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' })
  }
})

// Update user profile
router.patch('/profile', auth, async (req: any, res) => {
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
})

// Subscribe to a creator
router.post('/subscribe/:creatorId', auth, async (req: any, res) => {
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
    await user.save()

    res.json({ message: 'Successfully subscribed' })
  } catch (error) {
    res.status(400).json({ error: 'Error subscribing' })
  }
})

export default router 