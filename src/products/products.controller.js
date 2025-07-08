import express from 'express'
import { fetchProductItems, createProductItem, deleteProductItemById } from './products.service.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  try {
    const items = await fetchProductItems()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product items' })
  }
})

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const newItem = await createProductItem(req.body)
    res.status(201).json(newItem)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ errors })
    }

    res.status(500).json({ error: 'Failed to create product item' })
  }
})

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await deleteProductItemById(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product item' })
  }
})

export default router
