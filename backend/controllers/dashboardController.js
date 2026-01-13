import asyncHandler from 'express-async-handler';
import Inventory from '../models/Inventory.js';
import Transaction from '../models/Transaction.js';
import Supplier from '../models/Supplier.js';
import Category from '../models/Category.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    // 1. KPI Cards
    const totalRepuestosValue = await Inventory.aggregate([
        { $match: { item_type: 'repuesto' } },
        { $project: { totalValue: { $multiply: ['$purchase_price', '$stock'] } } },
        { $group: { _id: null, total: { $sum: '$totalValue' } } }
    ]);

    const lowStockCount = await Inventory.countDocuments({
        $expr: { $lte: ['$stock', '$min_stock'] }
    });

    const totalTools = await Inventory.countDocuments({ item_type: 'herramienta' });
    const activeSuppliers = await Supplier.countDocuments({ status: 'ACTIVO/HABIDO' });

    // 2. Charts Data (Simplified for prototype)
    // Categories Distribution
    const categoryDistribution = await Inventory.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: '$category' },
        { $group: { _id: '$category.name', value: { $sum: 1 } } },
        { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    res.json({
        kpi: {
            inventoryValue: totalRepuestosValue[0]?.total || 0,
            lowStock: lowStockCount,
            toolsCount: totalTools,
            suppliersCount: activeSuppliers
        },
        charts: {
            categories: categoryDistribution,
            // Mocking dynamic historical data for now to ensure chart renders nicely without complex date aggregation logic yet
            investment: [
                { month: 'Ene', valor: 12000 },
                { month: 'Feb', valor: 15000 },
                { month: 'Mar', valor: 14500 },
                { month: 'Abr', valor: 18000 },
                { month: 'May', valor: 22000 },
                { month: 'Jun', valor: totalRepuestosValue[0]?.total || 25000 }
            ],
            movement: [
                { name: 'Lun', entradas: 4, salidas: 2 },
                { name: 'Mar', entradas: 3, salidas: 5 },
                { name: 'Mie', entradas: 2, salidas: 8 },
                { name: 'Jue', entradas: 6, salidas: 4 },
                { name: 'Vie', entradas: 8, salidas: 3 },
            ]
        }
    });
});

export { getDashboardStats };
