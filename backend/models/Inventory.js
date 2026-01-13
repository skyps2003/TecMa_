import mongoose from 'mongoose';

const inventorySchema = mongoose.Schema({
    item_type: {
        type: String,
        required: true,
        enum: ['repuesto', 'herramienta']
    },
    name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    supplier_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    min_stock: {
        type: Number,
        default: 5
    },
    // Solo para Repuestos
    purchase_price: {
        type: Number
    },
    sale_price: {
        type: Number
    },
    // Solo para Herramientas
    brand: {
        type: String
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['operativo', 'en mantenimiento', 'extraviado'],
        default: 'operativo'
    }
}, {
    timestamps: true
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
