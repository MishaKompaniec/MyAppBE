import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { uploadAvatar, multerErrorHandler } from '../middleware/upload.middleware.js';
import * as userController from './user.controller.js';

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/me', authMiddleware, userController.getMe);
router.put('/update', authMiddleware, userController.update);

router.post(
  '/me/avatar',
  authMiddleware,
  multerErrorHandler(uploadAvatar.single('avatar')),
  userController.uploadAvatar
);

router.get('/me/avatar', authMiddleware, userController.getAvatar);

router.put('/me/password', authMiddleware, userController.updatePassword);

export default router;
