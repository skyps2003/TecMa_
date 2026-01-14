import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Wrench,
    Users,
    TrendingUp,
    LogOut,
    Search,
    Bell,
    Moon,
    Sun,
    UserCircle,
    Menu,
    X,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import AuthContext from '../context/AuthProvider';
import ThemeContext from '../context/ThemeContext';
import logo from '../assets/logo.png';
import { Toaster } from 'react-hot-toast';
import api from '../api/axios';

const Layout = ({ children }) => {
    const { auth, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300 font-sans">
            <Toaster position="top-right" />

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-64 bg-[#0f172a] dark:bg-slate-950 text-white flex flex-col fixed h-full z-40 transition-transform duration-300 ease-in-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/50 bg-[#0f172a] dark:bg-slate-950 z-10">
                    <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
                        <img src={logo} alt="TEFMA" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide font-display">TEFMA MOTORS</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider">S.A.C.</p>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400 hover:text-white transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 py-5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Principal</div>
                <nav className="px-3 space-y-1.5 flex-1">
                    <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={isActive('/dashboard')} />
                    <NavItem to="/inventory" icon={<Package size={20} />} label="Inventario" active={isActive('/inventory')} />

                    <div className="pt-6 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest pb-2">Gestión</div>
                    <NavItem to="/suppliers" icon={<Users size={20} />} label="Proveedores" active={isActive('/suppliers')} />
                    <NavItem to="/categories" icon={<Wrench size={20} />} label="Categorías" active={isActive('/categories')} />
                    <NavItem to="/reports" icon={<TrendingUp size={20} />} label="Reportes" active={isActive('/reports')} />
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <Link
                        to="/profile"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-2 group ${isActive('/profile')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <UserCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Mi Perfil
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 transition-colors duration-300 h-16">
                    <div className="px-4 md:px-8 h-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                                <Menu className="w-6 h-6" />
                            </button>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white capitalize hidden md:block">
                                {(() => {
                                    const path = location.pathname.substring(1);
                                    const titles = {
                                        'dashboard': 'Dashboard',
                                        'inventory': 'Inventario General',
                                        'suppliers': 'Proveedores',
                                        'categories': 'Categorías',
                                        'reports': 'Reportes Inteligentes',
                                        'profile': 'Mi Perfil'
                                    };
                                    return titles[path] || path;
                                })()}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3 md:gap-5">
                            {/* Search Removed by request */}
                            <div className="hidden md:block"></div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition hover:text-blue-600 dark:hover:text-amber-400"
                                title="Cambiar Tema"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            <Link to="/profile" className="flex items-center gap-3 pl-4 md:border-l border-slate-200 dark:border-slate-600 cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={auth?.perfil?.startsWith('/') ? `http://localhost:5000${auth.perfil}` : (auth?.perfil || "https://ui-avatars.com/api/?background=0f172a&color=fff&bold=true")}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full shadow-sm object-cover ring-2 ring-white dark:ring-slate-700 group-hover:ring-blue-100 dark:group-hover:ring-slate-600 transition-all"
                                    />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{auth?.name || 'Admin'}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize font-bold mt-1">{auth?.role || 'admin'}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

const NavItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-slate-400 hover:bg-slate-800 hover:text-blue-400 dark:hover:text-blue-400 transition-colors'
            }`}
    >
        {active && <div className="absolute inset-0 bg-blue-500 lg:hidden"></div>}
        <span className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
            {icon}
        </span>
        <span className="relative z-10">{label}</span>
        {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full"></div>}
    </Link>
);

export default Layout;
