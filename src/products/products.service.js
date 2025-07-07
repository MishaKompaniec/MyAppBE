import { ProductItem } from './products.model.js'

export async function fetchProductItems() {
  return await ProductItem.find()
}

export async function createProductItem(data) {
  const flower = new ProductItem(data)
  return await flower.save()
}

export async function deleteProductItemById(customId) {
  return await ProductItem.findOneAndDelete({ id: customId })
}
