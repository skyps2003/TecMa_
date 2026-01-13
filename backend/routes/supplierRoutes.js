import express from 'express';
import { getSuppliers, createSupplier, deleteSupplier, searchSUNAT, updateSupplier } from '../controllers/supplierController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sunat', protect, searchSUNAT);

router.route('/').get(protect, getSuppliers).post(protect, admin, createSupplier);
router.route('/:id').delete(protect, admin, deleteSupplier).put(protect, admin, updateSupplier);

export default router;
