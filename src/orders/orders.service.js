import { Order } from './orders.model.js'

export async function createOrder(userId, products, phone, address) {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error('Products list cannot be empty')
    error.statusCode = 400
    throw error
  }

  if (!phone || typeof phone !== 'string' || phone.trim() === '') {
    const error = new Error('Phone is required')
    error.statusCode = 400
    throw error
  }

  if (!address || typeof address !== 'string' || address.trim() === '') {
    const error = new Error('Address is required')
    error.statusCode = 400
    throw error
  }

  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const order = new Order({
    userId,
    products,
    totalPrice,
    phone,
    address
  })

  return await order.save()
}

export async function getAllOrders() {
  return await Order.find().populate('userId', 'email name')
}

export async function getOrdersByUser(userId) {
  return await Order.find({ userId })
}
