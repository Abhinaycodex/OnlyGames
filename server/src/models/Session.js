import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  game: {
    type: String,
    required: true,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // minutes
    required: true,
    min: 30,
    max: 180
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  meetingLink: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 🔍 Indexes for faster queries
sessionSchema.index({ creator: 1, status: 1 })
sessionSchema.index({ student: 1, status: 1 })

const Session = mongoose.model('Session', sessionSchema)
export default Session
