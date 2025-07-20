import express from 'express'
import cors from 'cors'
import productRoutes from './products/products.routes.js'
import userRoutes from './users/user.routes.js'
import orderRoutes from './orders/orders.routes.js';

export function createApp() {
  const app = express()

  app.use(cors({
    origin: ['http://localhost:5173', 'https://flower-shop-fe.vercel.app'],
  }))
  app.use(express.json())
  app.use('/api/products', productRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/orders', orderRoutes)

  return app
}
