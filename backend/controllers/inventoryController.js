import asyncHandler from 'express-async-handler';
import Inventory from '../models/Inventory.js';
import Transaction from '../models/Transaction.js';

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.find({})
        .populate('category_id', 'name')
        .populate('supplier_id', 'business_name');
    res.json(inventory);
});

import { createNotification } from './notificationController.js';

// ... (existing imports)

// ... (getInventory function - unchanged)

// @desc    Create an inventory item
const createInventoryItem = asyncHandler(async (req, res) => {
    // ... (existing logic)
    const { item_type, name, category_id, supplier_id, stock, min_stock, purchase_price, sale_price, brand, status } = req.body;
    const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';

    // ... (validation)

    const item = await Inventory.create({
        item_type, name, category_id, supplier_id, stock, min_stock, purchase_price, sale_price, brand, image, status
    });

    if (item) {
        await Transaction.create({
            item_id: item._id, user_id: req.user._id, type: 'entrada', quantity: stock, total_value: item_type === 'repuesto' ? stock * purchase_price : 0
        });

        // NOTIFICATION
        await createNotification(`Nuevo producto registrado: ${name} (${stock} unidades)`, 'success');

        res.status(201).json(item);
    } else {
        res.status(400);
        throw new Error('Invalid inventory data');
    }
});

// @desc    Update an inventory item
const updateInventoryItem = asyncHandler(async (req, res) => {
    const { item_type, name, category_id, supplier_id, stock, min_stock, purchase_price, sale_price, brand, status } = req.body;
    const item = await Inventory.findById(req.params.id);

    if (item) {
        const oldStock = item.stock;

        item.item_type = item_type || item.item_type;
        item.name = name || item.name;
        item.category_id = category_id || item.category_id;
        item.supplier_id = supplier_id || item.supplier_id;
        item.stock = stock !== undefined ? stock : item.stock;
        item.min_stock = min_stock !== undefined ? min_stock : item.min_stock;
        item.purchase_price = purchase_price || item.purchase_price;
        item.sale_price = sale_price || item.sale_price;
        item.brand = brand || item.brand;
        item.status = status || item.status;

        if (req.file) item.image = `http://localhost:5000/uploads/${req.file.filename}`;

        const updatedItem = await item.save();

        // Stock Change Notification
        if (stock !== undefined && stock !== oldStock) {
            const diff = stock - oldStock;
            const type = diff > 0 ? 'success' : 'warning';
            await createNotification(`Stock actualizado para ${item.name}: ${diff > 0 ? '+' : ''}${diff} unidades`, type);
        }

        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Delete an item
const deleteInventoryItem = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id);

    if (item) {
        const itemName = item.name;
        await item.deleteOne();

        // NOTIFICATION
        await createNotification(`Producto eliminado: ${itemName}`, 'error');

        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Export inventory to CSV
// @route   GET /api/inventory/export
// @access  Private
const exportInventory = asyncHandler(async (req, res) => {
    const inventory = await Inventory.find({})
        .populate('category_id', 'name')
        .populate('supplier_id', 'business_name');

    const fields = ['Name', 'Category', 'Brand', 'Type', 'Stock', 'Price', 'Status', 'Supplier'];
    const csvContent = [
        fields.join(','), // Header
        ...inventory.map(item => {
            return [
                `"${item.name}"`,
                `"${item.category_id?.name || ''}"`,
                `"${item.brand || ''}"`,
                item.item_type,
                item.stock,
                item.sale_price || 0,
                item.status,
                `"${item.supplier_id?.business_name || ''}"`
            ].join(',');
        })
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="inventario.csv"');
    res.send(csvContent);
});

export { getInventory, createInventoryItem, deleteInventoryItem, updateInventoryItem, exportInventory };
