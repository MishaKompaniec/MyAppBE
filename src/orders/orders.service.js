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

  if (address.length > 70) {
    const error = new Error('Address must be 70 characters or fewer');
    error.statusCode = 400;
    throw error;
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

export const markOrderAsCompleted = async (orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  order.status = 'completed';
  await order.save();
  return order;
};

export const deleteOrderById = async (orderId) => {
  const result = await Order.findByIdAndDelete(orderId);
  if (!result) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  return result;
};

export async function getAllOrders() {
  return await Order.find().populate('userId', 'email name')
}

export async function getOrdersByUser(userId) {
  return await Order.find({ userId })
}
