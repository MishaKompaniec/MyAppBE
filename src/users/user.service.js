import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from './user.model.js'

export async function registerUser(email, password, role = 'user') {
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = new User({ email, password: hashedPassword, role })
  await newUser.save()

  return newUser
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid password')

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )

  return { token, email: user.email, role: user.role }
}

export async function updateUser(userId, updates) {
  const allowedFields = ['email', 'fullName', 'phoneNumber']
  const filteredUpdates = {}

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key]
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, filteredUpdates, { new: true })
  if (!updatedUser) throw new Error('User not found')

  return {
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    phoneNumber: updatedUser.phoneNumber,
    role: updatedUser.role,
    id: updatedUser._id
  }
}

export async function getUserById(userId) {
  return await User.findById(userId)
}
