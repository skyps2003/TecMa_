import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Supplier from './models/Supplier.js';
import Inventory from './models/Inventory.js';
import Transaction from './models/Transaction.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Supplier.deleteMany();
        await Inventory.deleteMany();
        await Transaction.deleteMany();

        // 1. Crear Usuario Admin
        const createdUser = await User.create({
            username: 'admin',
            password: '123', // El modelo lo encriptará
            name: 'Administrador Principal',
            role: 'admin',
            perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        });

        console.log('✅ Usuario Admin creado');

        // 2. Crear Proveedores
        const supplier1 = await Supplier.create({
            ruc: '20100100101',
            business_name: 'TOYOTA DEL PERU S.A.',
            address: 'Av. Santo Toribio 173, San Isidro',
            phone: '01-555-1234'
        });

        const supplier2 = await Supplier.create({
            ruc: '20254053822',
            business_name: 'FERREYROS S.A.',
            address: 'Jr. Cristobal de Peralta Nte. 820, Surco',
            phone: '01-555-9876'
        });

        console.log('✅ Proveedores creados');

        // 3. Crear Categorías
        const catMotor = await Category.create({ name: 'Motor', type: 'repuesto' });
        const catFrenos = await Category.create({ name: 'Frenos', type: 'repuesto' });
        const catHerramientas = await Category.create({ name: 'Manuales', type: 'herramienta' });

        console.log('✅ Categorías creadas');

        // 4. Crear Inventario (Repuestos y Herramientas)
        const inventory = await Inventory.insertMany([
            {
                item_type: 'repuesto',
                name: 'Filtro de Aceite',
                category_id: catMotor._id,
                supplier_id: supplier1._id,
                stock: 50,
                min_stock: 10,
                purchase_price: 25.00,
                sale_price: 45.00
            },
            {
                item_type: 'repuesto',
                name: 'Pastillas de Freno',
                category_id: catFrenos._id,
                supplier_id: supplier1._id,
                stock: 4, // Stock bajo para probar alerta
                min_stock: 5,
                purchase_price: 80.00,
                sale_price: 150.00
            },
            {
                item_type: 'herramienta',
                name: 'Llave Inglesa 12"',
                category_id: catHerramientas._id,
                stock: 5,
                brand: 'Stanley',
                status: 'operativo'
            },
            {
                item_type: 'herramienta',
                name: 'Gato Hidráulico 2T',
                category_id: catHerramientas._id,
                stock: 2,
                brand: 'Total',
                status: 'en mantenimiento'
            }
        ]);

        console.log('✅ Inventario creado');

        // 5. Crear Transacciones (Historial)
        await Transaction.create({
            item_id: inventory[0]._id, // Filtro aceite
            user_id: createdUser._id,
            type: 'entrada',
            quantity: 50,
            total_value: 50 * 25.00
        });

        await Transaction.create({
            item_id: inventory[1]._id, // Pastillas (Stock bajo)
            user_id: createdUser._id,
            type: 'salida',
            quantity: 2,
            total_value: 2 * 80.00
        });

        console.log('✅ Transacciones creadas');

        console.log('DATA IMPORTED SUCCESS!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
