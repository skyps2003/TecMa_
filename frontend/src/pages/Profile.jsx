import React, { useState, useContext } from 'react';
import { User, Lock, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import AuthContext from '../context/AuthProvider';
import api from '../api/axios';

const Profile = () => {
    const { auth, login } = useContext(AuthContext);
    const [name, setName] = useState(auth?.name || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(auth?.perfil || '');

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (password && password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (password) formData.append('password', password);
        if (profileImage) formData.append('perfil', profileImage);

        try {
            const { data } = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            login(data);
            setMessage('Perfil actualizado correctamente');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError('Error al actualizar perfil');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Mi Perfil
            </h2>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">

                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer">
                        <img
                            src={previewUrl || "https://ui-avatars.com/api/?background=0f172a&color=fff&bold=true"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-4 border-slate-100 dark:border-slate-700 shadow-md object-cover transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Camera className="text-white w-8 h-8" />
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <p className="mt-4 font-bold text-lg text-slate-800 dark:text-white capitalize">{auth?.role}</p>
                    <p className="text-slate-500 dark:text-slate-400">@{auth?.username}</p>
                </div>

                {message && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-slate-400" />
                            Cambiar Contraseña (Opcional)
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-lg shadow-blue-500/20 mt-4"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
