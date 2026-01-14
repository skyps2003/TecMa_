import express from 'express';
import { getInventory, createInventoryItem, deleteInventoryItem, updateInventoryItem, exportInventory } from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });


const router = express.Router();

router.get('/export', protect, exportInventory);
router.route('/').get(protect, getInventory).post(protect, admin, upload.single('image'), createInventoryItem);
router.route('/:id').delete(protect, admin, deleteInventoryItem).put(protect, admin, upload.single('image'), updateInventoryItem);

export default router;
