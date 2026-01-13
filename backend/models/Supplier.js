import mongoose from 'mongoose';

const supplierSchema = mongoose.Schema({
    ruc: {
        type: String,
        required: true,
        unique: true
    },
    business_name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    status: {
        type: String,
        default: 'ACTIVO/HABIDO'
    }
}, {
    timestamps: true
});

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
