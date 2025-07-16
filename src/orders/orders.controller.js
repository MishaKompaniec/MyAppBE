import express from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import { createOrder, getAllOrders, getOrdersByUser } from './orders.service.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const { products } = req.body

    const savedOrder = await createOrder(userId, products)
    res.status(201).json(savedOrder)
  } catch (err) {
    console.error(err)
    const status = err.statusCode || 500
    res.status(status).json({ error: err.message || 'Failed to create order' })
  }
})

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await getAllOrders()
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const orders = await getOrdersByUser(userId)
    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch your orders' })
  }
})

export default router
