import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import userRoutes from './routes/userRoutes'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
})

// Configure CORS for Express
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? 'with body' : 'no body');
  next();
});

// MongoDB Connection with options
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/OnlyGames'
    console.log('Attempting to connect to MongoDB with URI:', mongoURI)
    
    const conn = await mongoose.connect(mongoURI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log('Database Name:', conn.connection.name)
    
    // Test the connection by listing collections
    const collections = await conn.connection.db.listCollections().toArray()
    console.log('Available collections:', collections.map(col => col.name))
    
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/users', userRoutes)

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
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`CORS enabled for origins: ${corsOptions.origin}`)
}) 