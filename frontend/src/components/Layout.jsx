import React, { useContext, useState } from 'react';
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

const Layout = ({ children }) => {
    const { auth, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Enhanced Mock Notifications
    const notifications = [
        { id: 1, text: "Stock bajo: Aceite Motor (2 u)", type: "warning", time: "Hace 5 min" },
        { id: 2, text: "Nuevo proveedor registrado: GLORIA S.A.", type: "success", time: "Hace 20 min" },
        { id: 3, text: "Copia de seguridad completada", type: "info", time: "Hace 1 hora" },
        { id: 4, text: "Error de sincronización SUNAT", type: "error", time: "Hace 2 horas" }
    ];

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
                        <img src={logo} alt="TECMA" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide font-display">TECMA</h1>
                        <p className="text-[10px] text-slate-400 font-medium tracking-wider">INVENTARIO</p>
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
                                {location.pathname === '/reports' ? 'Reportes' : location.pathname.replace('/', '')}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3 md:gap-5">
                            {/* Search */}
                            <div className="relative hidden md:block group">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="pl-9 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white text-sm placeholder-slate-400 transition-all focus:w-72"
                                />
                            </div>

                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden md:block"></div>

                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition hover:text-blue-600 dark:hover:text-amber-400"
                                title="Cambiar Tema"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`p-2.5 relative text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition ${showNotifications ? 'bg-slate-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : ''}`}
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-800 animate-pulse"></span>
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-black/5">
                                        <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                            <span className="font-bold text-sm text-slate-800 dark:text-white">Notificaciones</span>
                                            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">4 Nuevas</span>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.map(n => (
                                                <div key={n.id} className="p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex gap-3 items-start cursor-pointer transition-colors group">
                                                    <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${n.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                                                        n.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' :
                                                            n.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                                        }`}>
                                                        {n.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{n.text}</p>
                                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline">Marcar todo como leído</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link to="/profile" className="flex items-center gap-3 pl-4 md:border-l border-slate-200 dark:border-slate-600 cursor-pointer group">
                                <div className="relative">
                                    <img
                                        src={auth?.perfil || "https://ui-avatars.com/api/?background=0f172a&color=fff&bold=true"}
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
