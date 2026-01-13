import asyncHandler from 'express-async-handler';
import Supplier from '../models/Supplier.js';
import axios from 'axios'; // For SUNAT API if needed later

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({});
    res.json(suppliers);
});

// @desc    Create a supplier (with automated RUC lookup mock)
// @route   POST /api/suppliers
// @access  Private/Admin
const createSupplier = asyncHandler(async (req, res) => {
    const { ruc, business_name, address, phone } = req.body;

    const supplierExists = await Supplier.findOne({ ruc });

    if (supplierExists) {
        res.status(400);
        throw new Error('Supplier already exists');
    }

    // NOTE: Here you would integrate the SUNAT API. 
    // For now, we accept the data sent from frontend which will handle the "search" 
    // or we just save what is passed.

    const supplier = await Supplier.create({
        ruc,
        business_name,
        address,
        phone,
        status: 'ACTIVO/HABIDO' // Default for now
    });

    if (supplier) {
        res.status(201).json(supplier);
    } else {
        res.status(400);
        throw new Error('Invalid supplier data');
    }
});

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
const deleteSupplier = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        await supplier.deleteOne();
        res.json({ message: 'Supplier removed' });
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
});

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
const updateSupplier = asyncHandler(async (req, res) => {
    const { ruc, business_name, address, phone, status } = req.body;
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        supplier.ruc = ruc || supplier.ruc;
        supplier.business_name = business_name || supplier.business_name;
        supplier.address = address || supplier.address;
        supplier.phone = phone || supplier.phone;
        supplier.status = status || supplier.status;

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
});

// @desc    Search RUC via SUNAT API
// @route   POST /api/suppliers/sunat
// @access  Private
const searchSUNAT = asyncHandler(async (req, res) => {
    const { ruc } = req.body;
    const token = 'apis-token-9267.Cg5Z55wy2ggaaC9lqFdJnyheToq5KpEZ';

    try {
        const { data } = await axios.get('https://api.apis.net.pe/v2/sunat/ruc', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Referer': 'https://apis.net.pe/api-consulta-ruc',
                'Accept': 'application/json'
            },
            params: { numero: ruc }
        });
        res.json(data);
    } catch (error) {
        res.status(400);
        throw new Error('Error al consultar SUNAT');
    }
});

export { getSuppliers, createSupplier, deleteSupplier, searchSUNAT, updateSupplier };
