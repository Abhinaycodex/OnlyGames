import User, { IUser } from '../../models/User'
import jwt from 'jsonwebtoken'

export class UserService {
  static async createUser(userData: {
    username: string
    email: string
    password: string
    isCreator: boolean
  }) {
    const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = new User(userData)
    await user.save()
    return user
  }

  static async findUserByEmail(email: string) {
    return User.findOne({ email })
  }

  static async findUserById(id: string) {
    return User.findById(id)
  }

  static async updateUser(id: string, updates: Partial<IUser>) {
    const user = await User.findById(id)
    if (!user) {
      throw new Error('User not found')
    }

    Object.assign(user, updates)
    await user.save()
    return user
  }

  static async subscribeToCreator(userId: string, creatorId: string) {
    const [user, creator] = await Promise.all([
      User.findById(userId),
      User.findById(creatorId)
    ])

    if (!user || !creator) {
      throw new Error('User or creator not found')
    }

    if (!creator.isCreator) {
      throw new Error('User is not a creator')
    }

    if (user.subscribers.includes(creator._id)) {
      throw new Error('Already subscribed')
    }

    user.subscribers.push(creator._id)
    await user.save()
    return user
  }

  static generateToken(userId: string) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )
  }
} 