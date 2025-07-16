import express from 'express'
import cors from 'cors'
import productRoutes from './products/products.controller.js'
import userRoutes from './users/user.controller.js'
import orderRoutes from './orders/orders.controller.js'

export function createApp() {
  const app = express()

  app.use(cors({
    origin: 'http://localhost:5173',
  }))
  app.use(express.json())
  app.use('/api/products', productRoutes)
  app.use('/api/user', userRoutes)
  app.use('/api/orders', orderRoutes)

  return app
}
