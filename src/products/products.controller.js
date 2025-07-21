import { fetchProductItems, createProductItem, deleteProductItemById } from './products.service.js'
import { ProductItem } from './products.model.js'

export const getAll = async (req, res) => {
  try {
    const { sortBy = 'title', order = 'asc' } = req.query
    const sortOrder = order === 'desc' ? -1 : 1

    const validSortFields = ['title', 'price', 'category']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'title'

    const items = await ProductItem.find().sort({ [sortField]: sortOrder })

    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product items' })
  }
}

export const create = async (req, res) => {
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
}

export const remove = async (req, res) => {
  try {
    const deleted = await deleteProductItemById(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (err) {
    console.error('Error deleting product:', err)
    res.status(500).json({ error: 'Failed to delete product item' })
  }
}

export const uploadImage = async (req, res) => {
  try {
    const product = await ProductItem.findOne({ id: req.params.id })
    if (!product) return res.status(404).json({ error: 'Product not found' })

    product.image = req.file.location
    await product.save()

    res.json({ message: 'Image uploaded', imagePath: product.image })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upload image' })
  }
}

export const update = async (req, res) => {
  try {
    const updated = await ProductItem.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(updated)
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ errors })
    }

    console.error('Error updating product:', err)
    res.status(500).json({ error: 'Failed to update product' })
  }
}
