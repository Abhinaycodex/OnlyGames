import jwt from 'jsonwebtoken'

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-key-change-in-production'

// Authentication middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < currentTime) {
        return res.status(401).json({ error: 'Token expired' })
      }

      // Attach decoded user payload to request
      req.user = decoded

      next()
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' })
      }
      return res.status(401).json({ error: 'Token verification failed' })
    }
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Please authenticate.' })
  }
}

// Middleware to check if user is a creator
export const isCreator = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isCreator) {
      return res.status(403).json({ message: 'Access denied. Creator privileges required.' })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
