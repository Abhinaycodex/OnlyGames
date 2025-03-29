import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import userRoutes from './services/routes/userRoutes'

// Load environment variables - must be first!
dotenv.config()

// Environment variables
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/OnlyGames'
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
const NODE_ENV = process.env.NODE_ENV || 'development'

console.log(`Server starting in ${NODE_ENV} mode`)

const app = express()
const httpServer = createServer(app)

// Configure CORS based on environment
const corsOrigin = NODE_ENV === 'production' 
  ? CLIENT_URL  // Strict in production
  : [CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173']; // Multiple origins in development

console.log(`CORS configured for origins:`, corsOrigin);

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
})

// Configure CORS for Express
const corsOptions = {
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}

// Apply CORS middleware first
app.use(cors(corsOptions))

// Pre-flight OPTIONS requests
app.options('*', cors(corsOptions))

// Other middleware
app.use(express.json())

// Security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Add timestamp to logs
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB with URI:', MONGODB_URI.replace(
      /mongodb(\+srv)?:\/\/[^:]+:[^@]+@/,
      'mongodb$1://***:***@'
    ))
    
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log('Database Name:', conn.connection.name)
    
    if (NODE_ENV === 'development') {
      // Only in development - list collections
      const collections = await conn.connection.db.listCollections().toArray()
      console.log('Available collections:', collections.map(col => col.name))
    }
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/users', userRoutes)

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// CORS test endpoint
app.get('/api/cors-test', cors(corsOptions), (req, res) => {
  res.status(200).json({
    message: 'CORS is working properly',
    timestamp: new Date().toISOString(),
    headers: req.headers.origin ? { origin: req.headers.origin } : {}
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`CORS enabled for origin(s):`, corsOrigin)
}) 