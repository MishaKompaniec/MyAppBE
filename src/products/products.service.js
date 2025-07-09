import { ProductItem } from './products.model.js'
import path from 'path'
import fs from 'fs'

export async function fetchProductItems() {
  return await ProductItem.find()
}

export async function createProductItem(data) {
  const flower = new ProductItem(data)
  return await flower.save()
}

export async function deleteProductItemById(customId) {
  const product = await ProductItem.findOne({ id: customId })
  if (!product) return null

  if (product.image) {
    const imagePath = path.join(process.cwd(), product.image)

    try {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    } catch (err) {
      console.error('Failed to delete image file:', err)
    }
  }

  return await ProductItem.findOneAndDelete({ id: customId })
}
