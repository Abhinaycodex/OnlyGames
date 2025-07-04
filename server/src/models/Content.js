import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'photo'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  game: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  purchases: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    purchasedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// 🔍 Enable text search on title, description, and tags
contentSchema.index({ title: 'text', description: 'text', tags: 'text' })

const Content = mongoose.model('Content', contentSchema)
export default Content
