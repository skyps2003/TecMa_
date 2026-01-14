import express from 'express';
import { getNotifications, deleteNotification, clearNotifications } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getNotifications).delete(protect, clearNotifications);
router.route('/:id').delete(protect, deleteNotification);

export default router;
