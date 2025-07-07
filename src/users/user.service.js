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

  return token
}
