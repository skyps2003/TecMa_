import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Package, Wrench, Trash2, ImageIcon, LayoutGrid, List, FileText, AlertTriangle, Edit2, Archive, DollarSign, Download
} from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [filterType, setFilterType] = useState('all'); // 'all' | 'repuesto' | 'herramienta'
    const [searchTerm, setSearchTerm] = useState('');

    // ... (Modal & Selection State - Unchanged)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    // Form State
    const initialFormState = {
        item_type: 'repuesto',
        name: '',
        category_id: '',
        supplier_id: '',
        stock: 0,
        min_stock: 5,
        purchase_price: '',
        sale_price: '',
        brand: '',
        status: 'operativo'
    };
    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itemsRes, catRes, supRes] = await Promise.all([
                api.get('/inventory'),
                api.get('/categories'),
                api.get('/suppliers')
            ]);
            setItems(itemsRes.data);
            setCategories(catRes.data);
            setSuppliers(supRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar inventario");
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                item_type: item.item_type || 'repuesto',
                name: item.name,
                category_id: item.category_id?._id || '',
                supplier_id: item.supplier_id?._id || '',
                stock: item.stock,
                min_stock: item.min_stock,
                purchase_price: item.purchase_price || '',
                sale_price: item.sale_price || '',
                brand: item.brand || '',
                status: item.status || 'operativo'
            });
        } else {
            setEditingItem(null);
            setFormData(initialFormState);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        const prom = editingItem
            ? api.put(`/inventory/${editingItem._id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
            : api.post('/inventory', data, { headers: { 'Content-Type': 'multipart/form-data' } });

        toast.promise(prom, {
            loading: editingItem ? 'Actualizando producto...' : 'Guardando producto...',
            success: () => {
                setShowModal(false);
                setEditingItem(null);
                setFormData(initialFormState);
                setImageFile(null);
                fetchData();
                return editingItem ? 'Producto actualizado' : 'Producto registrado';
            },
            error: 'Error al guardar producto'
        });
    };

    const confirmDelete = (id) => {
        setSelectedItemId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/inventory/${selectedItemId}`);
            setItems(items.filter(i => i._id !== selectedItemId));
            toast.success("Producto eliminado");
            setIsDeleteModalOpen(false);
        } catch (error) {
            toast.error("No se pudo eliminar el producto");
            setIsDeleteModalOpen(false);
        }
    };

    const quickStockUpdate = async (item, amount) => {
        const newStock = item.stock + amount;
        if (newStock < 0) return;

        // Optimistic UI update
        const updatedItems = items.map(i => i._id === item._id ? { ...i, stock: newStock } : i);
        setItems(updatedItems);

        try {
            await api.put(`/inventory/${item._id}`, { ...item, stock: newStock, category_id: item.category_id?._id, supplier_id: item.supplier_id?._id });
            toast.success(`Stock actualizado: ${newStock}`, { icon: '📦', duration: 2000 });
        } catch (error) {
            toast.error("Error al actualizar stock");
            fetchData(); // Revert on error
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || item.item_type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Toaster position="top-right" />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Producto"
                message="¿Estás seguro? Esta acción eliminará el producto del inventario permanentemente."
                confirmText="Eliminar"
                cancelText="Cancelar"
            />

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        Inventario General
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 ml-1">Gestiona tus productos y existencias</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative group w-full sm:w-auto">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition-all shadow-sm"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 shrink-0">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'all' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setFilterType('repuesto')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'repuesto' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Repuestos
                        </button>
                        <button
                            onClick={() => setFilterType('herramienta')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'herramienta' ? 'bg-white dark:bg-slate-600 shadow-sm text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Herramientas
                        </button>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-500/30 transform active:scale-95 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo
                    </button>

                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-xl p-1 shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                            {/* Image Area */}
                            <div className="relative h-48 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <Package className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                                    <button onClick={() => openModal(item)} className="p-2 bg-white/90 text-slate-700 rounded-xl hover:bg-white hover:text-blue-600 transition shadow-lg transform hover:scale-105">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => confirmDelete(item._id)} className="p-2 bg-white/90 text-slate-700 rounded-xl hover:bg-white hover:text-red-500 transition shadow-lg transform hover:scale-105">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {item.stock <= item.min_stock && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-pulse">
                                        <AlertTriangle className="w-3 h-3" />
                                        BAJO STOCK
                                    </div>
                                )}
                            </div>

                            {/* Info Area */}
                            <div className="p-5">
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 truncate" title={item.name}>{item.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                                    {item.category_id?.name || 'General'} • {item.brand || 'Genérico'}
                                </p>

                                <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <button
                                        onClick={() => quickStockUpdate(item, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition shadow-sm border border-slate-200 dark:border-slate-700"
                                    >
                                        -
                                    </button>
                                    <div className="text-center">
                                        <span className={`block text-xl font-bold ${item.stock <= item.min_stock ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>{item.stock}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Stock</span>
                                    </div>
                                    <button
                                        onClick={() => quickStockUpdate(item, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition shadow-sm border border-slate-200 dark:border-slate-700"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border ${item.item_type === 'repuesto'
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30'
                                        : 'bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-900/10 dark:border-amber-900/30'
                                        }`}>
                                        {item.item_type}
                                    </span>
                                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        {item.item_type === 'repuesto' && <DollarSign className="w-3 h-3 text-slate-400" />}
                                        {item.sale_price ? item.sale_price.toFixed(2) : item.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List Layout */
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Producto</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Categoría</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Proveedor</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">Stock</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Valor/Estado</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredItems.map(item => (
                                <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition group">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600">
                                            {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Package className="w-full h-full p-2 text-slate-400" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.brand || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                                            {item.category_id?.name || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {item.supplier_id?.business_name || 'Sin Proveedor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => quickStockUpdate(item, -1)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">-</button>
                                            <span className={`font-mono font-bold ${item.stock <= item.min_stock ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>{item.stock}</span>
                                            <button onClick={() => quickStockUpdate(item, 1)} className="text-slate-400 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition">+</button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {item.item_type === 'repuesto' ? `S/. ${item.sale_price?.toFixed(2)}` : item.status}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => confirmDelete(item._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingItem ? 'Editar Producto' : 'Registrar Nuevo Producto'}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Completa los detalles del ítem</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Toggle Type */}
                            <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl w-full border border-slate-200 dark:border-slate-600">
                                <button
                                    type="button"
                                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${formData.item_type === 'repuesto' ? 'bg-white dark:bg-slate-600 shadow-sm text-emerald-600 dark:text-emerald-400 ring-1 ring-black/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                    onClick={() => setFormData({ ...formData, item_type: 'repuesto' })}
                                >
                                    <DollarSign className="w-4 h-4" />
                                    Repuesto
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${formData.item_type === 'herramienta' ? 'bg-white dark:bg-slate-600 shadow-sm text-amber-600 dark:text-amber-400 ring-1 ring-black/5' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                                    onClick={() => setFormData({ ...formData, item_type: 'herramienta' })}
                                >
                                    <Wrench className="w-4 h-4" />
                                    Herramienta
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="label">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Filtro de Aceite"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="label">Imagen del Producto</label>
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer relative group">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            accept="image/*"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400 group-hover:scale-105 transition-transform">
                                            {imageFile ? (
                                                <>
                                                    <ImageIcon className="w-8 h-8 text-blue-500" />
                                                    <span className="text-sm font-bold text-blue-500">{imageFile.name}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                                                        <ImageIcon className="w-6 h-6 text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-medium">Click o arrastra una imagen aquí</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Categoría</label>
                                    <select
                                        className="input-field"
                                        value={formData.category_id}
                                        onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categories.filter(c => c.type === formData.item_type).map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Proveedor</label>
                                    <select
                                        className="input-field"
                                        value={formData.supplier_id}
                                        onChange={e => setFormData({ ...formData, supplier_id: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {suppliers.map(s => (
                                            <option key={s._id} value={s._id}>{s.business_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="label">Stock Actual</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </div>

                                {formData.item_type === 'repuesto' && (
                                    <>
                                        <div>
                                            <label className="label">Precio Compra (S/.)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={formData.purchase_price}
                                                onChange={e => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
                                                step="0.01"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Precio Venta (S/.)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={formData.sale_price}
                                                onChange={e => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                                                step="0.01"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.item_type === 'herramienta' && (
                                    <>
                                        <div>
                                            <label className="label">Marca</label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={formData.brand}
                                                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                                placeholder="Ej: Stanley"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Estado</label>
                                            <select
                                                className="input-field"
                                                value={formData.status}
                                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="operativo">Operativo</option>
                                                <option value="en mantenimiento">En Mantenimiento</option>
                                                <option value="extraviado">Extraviado</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition shadow-lg shadow-slate-900/20 dark:shadow-blue-900/40 flex items-center justify-center gap-2"
                                >
                                    <Archive className="w-5 h-5" />
                                    {editingItem ? 'Actualizar Cambios' : 'Guardar Producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .label { display: block; font-size: 0.7rem; font-weight: 700; color: #64748b; margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.05em; padding-left: 0.25rem; }
                .dark .label { color: #94a3b8; }
                .input-field { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; border: 1px solid #e2e8f0; outline: none; transition: all; background-color: #ffffff; color: #1e293b; font-weight: 500; font-size: 0.9rem; }
                .dark .input-field { background-color: #1e293b; border-color: #334155; color: #f8fafc; }
                .input-field:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); border-color: #3b82f6; }
                .dark .input-field:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); border-color: #60a5fa; }
            `}</style>
        </div>
    );
};

export default Inventory;
