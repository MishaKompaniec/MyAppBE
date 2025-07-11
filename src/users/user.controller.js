import express from 'express'
import { registerUser, loginUser, updateUser, getUserById } from './user.service.js'
import { authMiddleware, } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body
    const user = await registerUser(email, password, role)
    res.status(201).json({ message: 'User registered', userId: user._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const { token, role, email: userEmail } = await loginUser(email, password)
    res.status(200).json({ token, email: userEmail, role })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    res.status(200).json({
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user._id
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body
    const updatedUser = await updateUser(req.user.userId, { email, fullName, phoneNumber })
    res.status(200).json({ message: 'User updated', user: updatedUser })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
