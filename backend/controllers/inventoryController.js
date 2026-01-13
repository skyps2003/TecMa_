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

// @desc    Create an inventory item
// @route   POST /api/inventory
// @access  Private/Admin
const createInventoryItem = asyncHandler(async (req, res) => {
    const {
        item_type,
        name,
        category_id,
        supplier_id,
        stock,
        min_stock,
        purchase_price,
        sale_price,
        brand,
        status
    } = req.body;

    const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : '';


    // Validation based on type
    if (item_type === 'repuesto') {
        if (!purchase_price || !sale_price) {
            res.status(400);
            throw new Error('Repuestos require purchase and sale price');
        }
    }

    const item = await Inventory.create({
        item_type,
        name,
        category_id,
        supplier_id,
        stock,
        min_stock,
        purchase_price,
        sale_price,
        brand,
        image,
        status
    });

    if (item) {
        // Create initial transaction logic could go here if needed, 
        // but typically "Stock In" is a separate action. 
        // For simplicity, we assume initial stock is "Found" or "Migrated".
        // Or we can auto-create an 'entrada' transaction.

        await Transaction.create({
            item_id: item._id,
            user_id: req.user._id, // Assumes authMiddleware adds user
            type: 'entrada',
            quantity: stock,
            total_value: item_type === 'repuesto' ? stock * purchase_price : 0
        });

        res.status(201).json(item);
    } else {
        res.status(400);
        throw new Error('Invalid inventory data');
    }
});

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventoryItem = asyncHandler(async (req, res) => {
    const {
        item_type,
        name,
        category_id,
        supplier_id,
        stock,
        min_stock,
        purchase_price,
        sale_price,
        brand,
        status
    } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (item) {
        // If updating stock, we should log a transaction ideally, but for now direct update
        // Logic to track stock difference could be added here

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

        if (req.file) {
            item.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

// @desc    Delete an item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
const deleteInventoryItem = asyncHandler(async (req, res) => {
    const item = await Inventory.findById(req.params.id);

    if (item) {
        await item.deleteOne();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found');
    }
});

export { getInventory, createInventoryItem, deleteInventoryItem, updateInventoryItem };
