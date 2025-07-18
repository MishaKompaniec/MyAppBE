import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware.js';
import * as orderController from './orders.controller.js';

const router = express.Router();

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, adminMiddleware, orderController.getAll);
router.get('/my', authMiddleware, orderController.getMine);
router.patch('/:id/complete', authMiddleware, adminMiddleware, orderController.markCompleted);
router.delete('/:id', authMiddleware, adminMiddleware, orderController.remove);

export default router;
