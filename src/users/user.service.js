import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from './user.model.js'

export async function registerUser(email, password) {
  const existing = await User.findOne({ email })
  if (existing) throw new Error('User already exists')

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hashedPassword })
  return await user.save()
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email })
  if (!user) throw new Error('User not found')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Invalid password')

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
  return token
}
