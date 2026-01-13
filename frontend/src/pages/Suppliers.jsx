import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Search, Building2, MapPin, Phone, CheckCircle, RotateCw, Edit2, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationModal from '../components/ConfirmationModal';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        ruc: '',
        business_name: '',
        address: '',
        phone: ''
    });
    const [searching, setSearching] = useState(false);
    const [editingId, setEditingId] = useState(null); // Track if editing

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const { data } = await api.get('/suppliers');
            setSuppliers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar proveedores");
            setLoading(false);
        }
    };

    const handleRucSearch = async () => {
        if (formData.ruc.length !== 11) {
            toast.error("El RUC debe tener 11 dígitos");
            return;
        }

        setSearching(true);
        const toastId = toast.loading("Consultando SUNAT...");

        try {
            const { data } = await api.post('/suppliers/sunat', { ruc: formData.ruc });

            if (data) {
                setFormData({
                    ...formData,
                    business_name: data.razonSocial,
                    address: data.direccion || 'Sin dirección registrada'
                });
                toast.success("Datos encontrados en SUNAT", { id: toastId });
            }
        } catch (error) {
            toast.error("No se encontró información o hubo error en SUNAT API", { id: toastId });
        } finally {
            setSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.business_name) {
            toast.error("Debe ingresar o buscar una Razón Social");
            return;
        }

        const prom = editingId
            ? api.put(`/suppliers/${editingId}`, formData) // Assuming PUT route exists, otherwise functionality limited
            : api.post('/suppliers', formData);

        toast.promise(prom, {
            loading: editingId ? 'Actualizando...' : 'Registrando...',
            success: (data) => {
                setFormData({ ruc: '', business_name: '', address: '', phone: '' });
                setEditingId(null);
                fetchSuppliers();
                return editingId ? 'Proveedor actualizado' : 'Proveedor registrado exitosamente';
            },
            error: 'Error al guardar proveedor'
        });
    };

    const confirmDelete = (id) => {
        setSelectedSupplierId(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/suppliers/${selectedSupplierId}`);
            setSuppliers(suppliers.filter(s => s._id !== selectedSupplierId));
            toast.success("Proveedor eliminado correctamente");
            setIsModalOpen(false);
        } catch (error) {
            toast.error("No se pudo eliminar el proveedor");
            setIsModalOpen(false);
        }
    };

    const handleEdit = (supplier) => {
        setFormData({
            ruc: supplier.ruc,
            business_name: supplier.business_name,
            address: supplier.address,
            phone: supplier.phone
        });
        setEditingId(supplier._id);
        toast("Modo edición activado: " + supplier.business_name, { icon: '✏️' });
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setFormData({ ruc: '', business_name: '', address: '', phone: '' });
        setEditingId(null);
        toast("Edición cancelada", { icon: '❌' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Toaster position="top-right" reverseOrder={false} />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Proveedor"
                message="¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer y podría afectar el historial de compras."
                confirmText="Sí, Eliminar"
                cancelText="Cancelar"
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        Directorio de Proveedores
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 ml-1">Gestiona tus socios comerciales verificados por SUNAT</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-24 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                {editingId ? 'Editar Proveedor' : 'Nuevo Registro'}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    SUNAT LIVE
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">RUC</label>
                                <div className="flex gap-2 relative group">
                                    <input
                                        type="text"
                                        value={formData.ruc}
                                        onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono tracking-wide"
                                        placeholder="Ingrese 11 dígitos"
                                        maxLength={11}
                                        disabled={editingId} // Disable RUC edit usually
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRucSearch}
                                        disabled={searching || editingId}
                                        className="absolute right-2 top-2 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105"
                                        title="Consultar SUNAT"
                                    >
                                        {searching ? <RotateCw className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Razón Social</label>
                                <div className="relative">
                                    <Building2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        value={formData.business_name}
                                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                        placeholder="Nombre de la empresa"
                                        readOnly={!editingId} // Readonly if not manual override
                                    />
                                    {!editingId && <div className="absolute right-3 top-3.5 pointer-events-none">
                                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded">Auto</span>
                                    </div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Dirección Fiscal</label>
                                <div className="relative">
                                    <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Dirección completa"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Teléfono / Contacto</label>
                                <div className="relative">
                                    <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="999-999-999"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={`flex-1 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition transform active:scale-95 flex items-center justify-center gap-2 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {editingId ? 'Actualizar Datos' : 'Registrar Proveedor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Proveedores Grid */}
                <div className="xl:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {suppliers.map((prov) => (
                            <div
                                key={prov._id}
                                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0">
                                            {prov.business_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1 text-lg mb-1" title={prov.business_name}>
                                                {prov.business_name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                    {prov.ruc}
                                                </span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" />
                                                    ACTIVO
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(prov)}
                                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(prov._id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                                        <span className="line-clamp-2 leading-relaxed">{prov.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                                        <span className="font-medium bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                                            {prov.phone || 'No registrado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {suppliers.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 mt-0">
                            <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-full mb-4">
                                <Search className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                            </div>
                            <p className="font-medium text-lg">No hay proveedores registrados</p>
                            <p className="text-sm">Utiliza el formulario para añadir uno nuevo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Suppliers;
