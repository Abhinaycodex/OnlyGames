import jwt from 'jsonwebtoken'
import User from '../../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production'
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d'

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export const register = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({ error: 'Error creating user', details: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, type } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    if (type === 'creator' && !user.isCreator) {
      return res.status(401).json({ error: 'This account is not a creator' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const token = generateToken({ userId: user._id, isCreator: user.isCreator })

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
    res.status(400).json({ error: 'Error logging in' })
  }
}

export const creatorLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email, isCreator: true })
    if (!user) return res.status(401).json({ error: 'Invalid creator credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid creator credentials' })

    if (user.creatorProfile?.verificationStatus === 'rejected') {
      return res.status(403).json({ error: 'Your creator account was rejected' })
    }

    const token = generateToken({ userId: user._id, isCreator: true })

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isCreator: true,
        creatorProfile: user.creatorProfile
      }
    })
  } catch (error) {
    res.status(400).json({ error: 'Error logging in as creator' })
  }
}

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error fetching profile' })
  }
}

export const updateProfile = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['username', 'email', 'bio', 'games', 'subscriptionPrice']
  const isValid = updates.every(update => allowedUpdates.includes(update))

  if (!isValid) return res.status(400).json({ error: 'Invalid updates' })

  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    updates.forEach(key => {
      user[key] = req.body[key]
    })

    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: 'Error updating profile' })
  }
}

export const subscribeToCreator = async (req, res) => {
  try {
    const creator = await User.findById(req.params.creatorId)
    if (!creator || !creator.isCreator) {
      return res.status(400).json({ error: 'Invalid creator ID' })
    }

    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (user.subscribers.includes(creator._id)) {
      return res.status(400).json({ error: 'Already subscribed' })
    }

    user.subscribers.push(creator._id)

    if (creator.creatorProfile) {
      creator.creatorProfile.subscriberCount += 1
      await creator.save()
    }

    await user.save()
    res.json({ message: 'Subscribed successfully' })
  } catch (error) {
    res.status(400).json({ error: 'Error subscribing to creator' })
  }
}

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const stats = {
      subscribers: user.subscribers.length || 0,
      revenue: 0,
      activeSessions: 0,
      activities: [
        {
          id: '1',
          type: 'Activity',
          description: 'Recent activity',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          user: {
            id: user._id,
            username: user.username,
            initials: user.username.slice(0, 2).toUpperCase()
          }
        }
      ]
    }

    res.json(stats)
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user stats' })
  }
}

export const getCreatorStats = async (req, res) => {
  try {
    const creator = await User.findById(req.user.userId).populate('subscribers', 'username email')
    if (!creator) return res.status(404).json({ error: 'Creator not found' })
    if (!creator.isCreator) return res.status(403).json({ error: 'User is not a creator' })

    const subscriberCount = creator.subscribers.length
    const profile = creator.creatorProfile || {}

    const stats = {
      subscribers: subscriberCount,
      revenue: profile.totalRevenue || subscriberCount * 5,
      contentCount: profile.contentCount || 0,
      verificationStatus: profile.verificationStatus || 'pending',
      activeSessions: Math.floor(Math.random() * 20) + 1,
      activities: creator.subscribers.slice(0, 5).map((sub, index) => ({
        id: String(index),
        type: 'New Subscriber',
        description: `${sub.username} subscribed to your content`,
        timestamp: new Date(Date.now() - 1000 * 60 * (index + 1) * 30).toISOString(),
        user: {
          id: sub._id,
          username: sub.username,
          initials: sub.username.slice(0, 2).toUpperCase()
        }
      }))
    }

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
      }]
    }

    res.json(stats)
  } catch (error) {
    res.status(400).json({ error: 'Error fetching creator stats' })
  }
}
