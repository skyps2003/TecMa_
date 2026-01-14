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
        console.log('🗑️ Eliminando datos anteriores...');
        await User.deleteMany();
        await Category.deleteMany();
        await Supplier.deleteMany();
        await Inventory.deleteMany();
        await Transaction.deleteMany();

        console.log('👤 Creando usuarios...');
        const adminUser = await User.create({
            username: 'admin',
            password: '123',
            name: 'Administrador Principal',
            role: 'admin',
            perfil: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        });

        console.log('🏭 Creando proveedores...');
        const suppliersList = [
            { ruc: '20100100101', business_name: 'Toyota del Perú S.A.', address: 'Av. Santo Toribio 173, San Isidro', phone: '01-555-1234' },
            { ruc: '20254053822', business_name: 'Ferreyros S.A.', address: 'Jr. Cristobal de Peralta Nte. 820, Surco', phone: '01-555-9876' },
            { ruc: '20555555555', business_name: 'Importaciones Automotrices S.A.C.', address: 'Av. La Marina 2000, San Miguel', phone: '01-555-4321' },
            { ruc: '20600000001', business_name: 'Herramientas y Equipos Perú', address: 'Av. Argentina 500, Lima', phone: '01-555-1111' },
            { ruc: '20600000002', business_name: 'Lubricantes del Sur', address: 'Av. Industrial 123, Arequipa', phone: '054-555-2222' }
        ];
        const createdSuppliers = await Supplier.insertMany(suppliersList);

        console.log('📂 Creando categorías...');
        const categoriesList = [
            { name: 'Motor', type: 'repuesto' },
            { name: 'Frenos', type: 'repuesto' },
            { name: 'Suspensión', type: 'repuesto' },
            { name: 'Eléctrico', type: 'repuesto' },
            { name: 'Fluidos y Filtros', type: 'repuesto' },
            { name: 'Manuales', type: 'herramienta' },
            { name: 'Eléctricas', type: 'herramienta' },
            { name: 'Diagnóstico', type: 'herramienta' },
            { name: 'Hidráulicas', type: 'herramienta' }
        ];
        const createdCategories = await Category.insertMany(categoriesList);

        console.log('📦 Creando inventario...');

        // Helper to find category/supplier (Updated for random assignment)
        const getCat = (type) => {
            const cats = createdCategories.filter(c => c.type === type);
            return cats[Math.floor(Math.random() * cats.length)]._id;
        };
        const getSup = () => createdSuppliers[Math.floor(Math.random() * createdSuppliers.length)]._id;

        const inventoryItems = [];
        const brands = ['Toyota', 'Nissan', 'Hyundai', 'Bosch', 'Stanley', 'DeWalt', 'Makita', 'Total', 'Michelin', 'Castrol', 'Mobil'];
        const statuses = ['operativo', 'operativo', 'operativo', 'en mantenimiento', 'extraviado']; // Weighted

        // Generar Repuestos (40 items)
        const repuestoNouns = ['Filtro de Aceite', 'Filtro de Aire', 'Pastillas de Freno', 'Disco de Freno', 'Bujía', 'Amortiguador', 'Batería', 'Radiador', 'Alternador', 'Correa de Distribución', 'Sensor de Oxígeno', 'Bomba de Agua', 'Kit de Embrague', 'Faros Delanteros', 'Espejo Retrovisor'];

        for (let i = 0; i < 40; i++) {
            const noun = repuestoNouns[Math.floor(Math.random() * repuestoNouns.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];

            inventoryItems.push({
                item_type: 'repuesto',
                name: `${noun} ${brand} ${Math.floor(Math.random() * 1000)}`,
                category_id: getCat('repuesto'),
                supplier_id: getSup(),
                stock: Math.floor(Math.random() * 100) + 5,
                min_stock: Math.floor(Math.random() * 10) + 2,
                purchase_price: Math.floor(Math.random() * 200) + 10,
                sale_price: 0, // Calculated below
                image: `https://picsum.photos/seed/repuesto${i}/300/300`
            });
            // Set sale price logic
            inventoryItems[i].sale_price = inventoryItems[i].purchase_price * 1.5;
        }

        // Generar Herramientas (20 items)
        const herramientaNouns = ['Llave Inglesa', 'Juego de Dados', 'Taladro Percutor', 'Gato Hidráulico', 'Scanner OBD2', 'Compresora de Aire', 'Multímetro Digital', 'Lijadora Orbital', 'Soldadora Inverter', 'Torque'];

        for (let i = 0; i < 20; i++) {
            const noun = herramientaNouns[Math.floor(Math.random() * herramientaNouns.length)];
            const brand = brands[Math.floor(Math.random() * brands.length)];

            inventoryItems.push({
                item_type: 'herramienta',
                name: `${noun} ${brand} Pro`,
                category_id: getCat('herramienta'),
                supplier_id: getSup(),
                stock: Math.floor(Math.random() * 15) + 1,
                min_stock: 2,
                brand: brand,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                image: `https://picsum.photos/seed/tool${i}/300/300`
            });
        }

        const createdInventory = await Inventory.insertMany(inventoryItems);
        const inventoryIds = createdInventory.map(i => i._id);

        console.log('📈 Generando historial de transacciones (Nov 2025 - Hoy)...');

        const transactions = [];
        const startDate = new Date('2025-11-01');
        const endDate = new Date();
        const types = ['entrada', 'salida', 'salida', 'salida']; // Más salidas que entradas usualmente

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Random daily transactions count (e.g., 0 to 5 per day)
            const dailyTransactions = Math.floor(Math.random() * 6);

            for (let i = 0; i < dailyTransactions; i++) {
                const randomItem = createdInventory[Math.floor(Math.random() * createdInventory.length)];
                const type = types[Math.floor(Math.random() * types.length)];

                // Cantidad aleatoria (1-10 para repuestos, 1 para herramientas)
                let quantity = randomItem.item_type === 'repuesto' ? Math.floor(Math.random() * 10) + 1 : 1;

                // Si es salida, asegurar que no supere stock lógico (simulación simple)
                // Para simplificar, asumimos que el stock actual es el resultado final
                // y estas transacciones son históricas.

                // Pricing
                const unitPrice = type === 'entrada' ? (randomItem.purchase_price || 0) : (randomItem.sale_price || 0);
                const totalValue = quantity * unitPrice;

                transactions.push({
                    item_id: randomItem._id,
                    user_id: adminUser._id,
                    type: type,
                    quantity: quantity,
                    total_value: totalValue,
                    createdAt: new Date(d).toISOString() // Mongoose timestamps override might handle this or we might need to be careful. 
                    // Actually standard mongoose timestamps are set on save. create() accepts createdAt overrides usually.
                });
            }
        }

        // Insert transactions in batches to avoid overwhelming
        if (transactions.length > 0) {
            // Mongoose insertMany doesn't always perform hooks, but here we just need raw data
            // We need to allow createdAt override. Mongoose typically allows it if passed explicitly.
            await Transaction.insertMany(transactions);
        }

        console.log(`✅ EXITO! Datos generados:
        - ${createdCategories.length} Categorías
        - ${createdSuppliers.length} Proveedores
        - ${createdInventory.length} Productos/Herramientas
        - ${transactions.length} Transacciones históricas
        `);

        process.exit();
    } catch (error) {
        console.error(`❌ ERROR: ${error}`);
        process.exit(1);
    }
};

importData();
