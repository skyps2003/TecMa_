import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tag, AlertCircle, Settings, Wrench, Search, LayoutGrid, List as ListIcon, FolderOpen } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', type: 'repuesto' });
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar categorías");
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("El nombre es requerido");
            return;
        }

        const prom = api.post('/categories', formData);

        toast.promise(prom, {
            loading: 'Creando categoría...',
            success: () => {
                setFormData({ name: '', type: 'repuesto' });
                fetchCategories();
                return 'Categoría creada con éxito';
            },
            error: 'Error: La categoría posiblemente ya existe'
        });
    };

    const confirmDelete = (id) => {
        setSelectedCategoryId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/categories/${selectedCategoryId}`);
            setCategories(categories.filter(c => c._id !== selectedCategoryId));
            toast.success("Categoría eliminada");
            setIsModalOpen(false);
        } catch (error) {
            toast.error("No se pudo eliminar, posiblemente esté en uso");
            setIsModalOpen(false);
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: categories.length,
        herramientas: categories.filter(c => c.type === 'herramienta').length,
        repuestos: categories.filter(c => c.type === 'repuesto').length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Toaster position="top-right" />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Categoría"
                message="¿Estás seguro? Si eliminas esta categoría, los productos asociados podrían quedar huérfanos."
                confirmText="Sí, Eliminar"
                cancelText="Cancelar"
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        Gestión de Categorías
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 ml-1">Organiza tu inventario en secciones lógicas</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Categorías</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <FolderOpen className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Herramientas</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.herramientas}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                        <Wrench className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Repuestos</p>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.repuestos}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Settings className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de Creación */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-24">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-500" />
                            Nueva Categoría
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Nombre de la Sección</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    placeholder="Ej: Motor, Suspensión..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Tipo de Ítem</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'repuesto' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'repuesto'
                                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500'
                                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
                                            }`}
                                    >
                                        <Settings className="w-6 h-6" />
                                        <span className="text-sm font-bold">Repuesto</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'herramienta' })}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${formData.type === 'herramienta'
                                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 ring-1 ring-amber-500'
                                                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
                                            }`}
                                    >
                                        <Wrench className="w-6 h-6" />
                                        <span className="text-sm font-bold">Herramienta</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition shadow-lg shadow-slate-900/20 dark:shadow-blue-900/40 flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                Crear Categoría
                            </button>
                        </form>
                    </div>
                </div>

                {/* Lista de Categorías */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Controls */}
                    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="relative group">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-800 dark:text-white' : 'text-slate-400'}`}
                            >
                                <ListIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredCategories.map(cat => (
                                <div key={cat._id} className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:-translate-y-1 flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.type === 'repuesto'
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                            }`}>
                                            {cat.type === 'repuesto' ? <Settings className="w-6 h-6" /> : <Wrench className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white text-lg">{cat.name}</h4>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{cat.type}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => confirmDelete(cat._id)}
                                        className="text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Nombre</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Tipo</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredCategories.map((cat) => (
                                        <tr key={cat._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{cat.name}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${cat.type === 'repuesto'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                    }`}>
                                                    {cat.type === 'repuesto' ? <Settings className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                                                    {cat.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => confirmDelete(cat._id)}
                                                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {filteredCategories.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <Search className="w-10 h-10 mb-3 opacity-20" />
                            <p>No se encontraron categorías</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Categories;
