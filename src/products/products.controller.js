import express from 'express'
import { fetchProductItems, createProductItem, deleteProductItemById } from './products.service.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import { upload } from '../middleware/upload.middleware.js'
import { ProductItem } from './products.model.js'

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

router.post('/:id/image', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
  try {
    const product = await ProductItem.findOne({ id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })

    product.image = `/uploads/${req.file.filename}`
    await product.save()

    res.json({ message: 'Image uploaded', imagePath: product.image })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default router
