import express from 'express'
import { fetchProductItems, createProductItem, deleteProductItemById } from './products.service.js'

const router = express.Router()

// Получение всех товаров
router.get('/', async (req, res) => {
  try {
    const items = await fetchProductItems()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products items' })
  }
})

// Добавление нового товара
router.post('/', async (req, res) => {
  try {
    const data = req.body

    // Простая валидация
    if (!data.title || !data.price || !data.quantity) {
      return res.status(400).json({ error: 'Title, price and quantity are required' })
    }

    const newProducts = await createProductItem(data)
    res.status(201).json(newProducts)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create products item' })
  }
})

// Удаление по ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await deleteProductItemById(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Products item not found' })
    }

    res.json({ message: 'Products item deleted successfully' })
  } catch (err) {
    console.error('DELETE error:', err)
    res.status(500).json({ error: 'Failed to delete products item' })
  }
})

export default router
