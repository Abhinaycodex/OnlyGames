import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isCreator: {
    type: Boolean,
    default: false
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  games: [{
    type: String,
    trim: true
  }],
  subscriptionPrice: {
    type: Number,
    default: 0
  },
  subscribers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  creatorProfile: {
    type: {
      contentCount: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      subscriberCount: { type: Number, default: 0 },
      contentCategories: [{ type: String }],
      featured: { type: Boolean, default: false },
      verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      }
    },
    default: null
  }
})

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// ⚙️ Initialize creatorProfile if user becomes creator
userSchema.pre('save', async function (next) {
  if (this.isModified('isCreator') && this.isCreator && !this.creatorProfile) {
    this.creatorProfile = {
      contentCount: 0,
      totalRevenue: 0,
      subscriberCount: 0,
      contentCategories: [],
      featured: false,
      verificationStatus: 'pending'
    }
  }
  next()
})

// 🔐 Compare entered password with hashed one
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

const User = mongoose.model('User', userSchema)
export default User
