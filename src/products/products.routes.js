import express from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js'
import { upload, multerErrorHandler } from '../middleware/upload.middleware.js'
import * as productController from './products.controller.js'

const router = express.Router()

router.get('/', productController.getAll)
router.post('/', authMiddleware, adminMiddleware, productController.create)
router.delete('/:id', authMiddleware, adminMiddleware, productController.remove)

router.post(
  '/:id/image',
  authMiddleware,
  adminMiddleware,
  multerErrorHandler(upload.single('image')),
  productController.uploadImage
)

router.patch('/:id', authMiddleware, adminMiddleware, productController.update)

export default router
