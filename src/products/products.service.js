import { ProductItem } from './products.model.js'
import { s3 } from '../middleware/upload.middleware.js'

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
    try {

      const url = new URL(product.image)
      const Key = decodeURIComponent(url.pathname.substring(1))

      await s3.deleteObject({
        Bucket: 'flower-product-images',
        Key,
      }).promise()

    } catch (err) {
      console.error('Failed to delete image from S3:', err)
    }
  }

  return await ProductItem.findOneAndDelete({ id: customId })
}
