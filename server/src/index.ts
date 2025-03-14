import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlygames')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to OnlyGames API' })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
}) 