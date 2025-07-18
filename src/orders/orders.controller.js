import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  markOrderAsCompleted,
  deleteOrderById
} from './orders.service.js';

export const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { products, phone, address } = req.body;
    const savedOrder = await createOrder(userId, products, phone, address);
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMine = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markCompleted = async (req, res) => {
  try {
    const updatedOrder = await markOrderAsCompleted(req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteOrderById(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};
