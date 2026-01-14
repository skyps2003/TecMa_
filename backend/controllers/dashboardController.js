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

    // 2. Charts Data
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

    // Tool Status Distribution
    const toolsStatusDistribution = await Inventory.aggregate([
        { $match: { item_type: 'herramienta' } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    const toolsStatusChart = toolsStatusDistribution.length > 0 ? toolsStatusDistribution : [
        { name: 'Operativo', value: 0 },
        { name: 'En Mantenimiento', value: 0 }
    ];

    // Dynamic Investment Trend (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of that month

    const monthlyInvestments = await Transaction.aggregate([
        {
            $match: {
                type: 'entrada',
                createdAt: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                total: { $sum: "$total_value" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format for investment chart
    const investmentChart = [];
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthIndex = d.getMonth() + 1;
        const year = d.getFullYear();

        const found = monthlyInvestments.find(m => m._id.month === monthIndex && m._id.year === year);

        investmentChart.push({
            month: `${monthNames[monthIndex - 1]} ${year.toString().slice(-2)}`, // E.g., 'Dic 25'
            valor: found ? found.total : 0
        });
    }

    // Dynamic Weekly Movement (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const weeklyMovements = await Transaction.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfWeek: "$createdAt" }, // 1 (Sun) - 7 (Sat)
                    type: "$type"
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const movementChart = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayIndex = d.getDay() + 1; // MongoDB $dayOfWeek is 1-based (1=Sun)

        const entradas = weeklyMovements.find(m => m._id.day === dayIndex && m._id.type === 'entrada');
        const salidas = weeklyMovements.find(m => m._id.day === dayIndex && m._id.type === 'salida');

        movementChart.push({
            name: dayNames[d.getDay()],
            entradas: entradas ? entradas.count : 0,
            salidas: salidas ? salidas.count : 0
        });
    }

    res.json({
        kpi: {
            inventoryValue: totalRepuestosValue[0]?.total || 0,
            lowStock: lowStockCount,
            toolsCount: totalTools,
            suppliersCount: activeSuppliers
        },
        charts: {
            categories: categoryDistribution,
            toolsStatus: toolsStatusChart,
            investment: investmentChart,
            movement: movementChart
        }
    });
});

export { getDashboardStats };
