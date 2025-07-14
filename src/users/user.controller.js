import express from 'express'
import { registerUser, loginUser, updateUser, getUserById } from './user.service.js'
import { authMiddleware, } from '../middleware/auth.middleware.js'
import { uploadAvatar } from '../middleware/upload.middleware.js'
import { updateUserAvatar } from './user.service.js'
import { multerErrorHandler } from '../middleware/upload.middleware.js'

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

router.post(
  '/me/avatar',
  authMiddleware,
  multerErrorHandler(uploadAvatar.single('avatar')),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const result = await updateUserAvatar(req.user.userId, req.file.location);
      res.json({ message: 'Avatar uploaded', avatarUrl: result.avatar });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload avatar' });
    }
  }
);

router.get('/me/avatar', authMiddleware, async (req, res) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ avatarUrl: user.avatar || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve avatar' });
  }
});

export default router
