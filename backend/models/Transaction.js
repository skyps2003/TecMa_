import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['entrada', 'salida']
    },
    quantity: {
        type: Number,
        required: true
    },
    total_value: {
        type: Number // Solo si es repuesto
    }
}, {
    timestamps: true // Esto crea el campo createdAt automáticamente
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
