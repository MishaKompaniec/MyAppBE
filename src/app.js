import express from 'express'
import productRoutes from './products/products.controller.js'

export function createApp() {
  const app = express()

  app.use(express.json())

  app.use('/api/products', productRoutes)

  return app
}
