import express from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import { createOrder, getAllOrders, getOrdersByUser, markOrderAsCompleted, deleteOrderById } from './orders.service.js'

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId
    const { products, phone, address } = req.body

    const savedOrder = await createOrder(userId, products, phone, address)
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

router.patch('/:id/complete', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedOrder = await markOrderAsCompleted(id);
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Failed to update order status' });
  }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orderId = req.params.id;
    await deleteOrderById(orderId);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Failed to delete order' });
  }
});

export default router
