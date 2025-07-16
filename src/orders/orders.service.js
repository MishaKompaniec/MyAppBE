import { Order } from './orders.model.js'

export async function createOrder(userId, products) {
  if (!Array.isArray(products) || products.length === 0) {
    const error = new Error('Products list cannot be empty')
    error.statusCode = 400
    throw error
  }

  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  const order = new Order({
    userId,
    products,
    totalPrice,
  })

  return await order.save()
}

export async function getAllOrders() {
  return await Order.find().populate('userId', 'email name')
}

export async function getOrdersByUser(userId) {
  return await Order.find({ userId })
}
