import express from 'express'
import { registerUser, loginUser } from './user.service.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await registerUser(email, password)
    res.status(201).json({ message: 'User registered', userId: user._id })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await loginUser(email, password)
    res.status(200).json({ token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
