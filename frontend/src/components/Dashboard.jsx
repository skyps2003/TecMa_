import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    Wrench,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Package,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');

                // Fallback for movement data if backend sends short days
                // Ensuring we have full day names or consistent format if needed
                if (data.charts?.movement) {
                    data.charts.movement = data.charts.movement.map(m => ({
                        ...m,
                        total: m.entradas + m.salidas
                    }));
                }

                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Cargando Dashboard...</div>
                </div>
            </div>
        );
    }

    const movementData = stats?.charts?.movement || [];
    const categoryData = stats?.charts?.categories || [];
    const investmentData = stats?.charts?.investment || [];
    const kpi = stats?.kpi || { inventoryValue: 0, lowStock: 0, toolsCount: 0, suppliersCount: 0 };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-4 rounded-xl shadow-xl">
                    <p className="text-slate-200 font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-400 capitalize">{entry.name}:</span>
                            <span className="text-white font-mono font-medium">
                                {typeof entry.value === 'number' && entry.name.toLowerCase().includes('valor')
                                    ? `S/. ${entry.value.toLocaleString()}`
                                    : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Resumen General</h1>
                <p className="text-slate-500 dark:text-slate-400">Vista general del rendimiento del inventario y activos.</p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Valor Total"
                    value={`S/. ${kpi.inventoryValue.toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
                    trend="+12.5%"
                    trendUp={true}
                    color="from-emerald-500/20 to-emerald-500/5 border-emerald-500/20"
                    iconBg="bg-emerald-500/20"
                />
                <StatCard
                    title="Stock Crítico"
                    value={kpi.lowStock}
                    unit="Ítems"
                    icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
                    subtext="Requiere reabastecimiento"
                    alert={kpi.lowStock > 0}
                    color="from-amber-500/20 to-amber-500/5 border-amber-500/20"
                    iconBg="bg-amber-500/20"
                />
                <StatCard
                    title="Herramientas"
                    value={kpi.toolsCount}
                    unit="Unidades"
                    icon={<Wrench className="w-6 h-6 text-blue-500" />}
                    trend="+5"
                    trendUp={true}
                    color="from-blue-500/20 to-blue-500/5 border-blue-500/20"
                    iconBg="bg-blue-500/20"
                />
                <StatCard
                    title="Proveedores"
                    value={kpi.suppliersCount}
                    unit="Activos"
                    icon={<Users className="w-6 h-6 text-indigo-500" />}
                    subtext="Verificados SUNAT"
                    color="from-indigo-500/20 to-indigo-500/5 border-indigo-500/20"
                    iconBg="bg-indigo-500/20"
                />
            </div>

            {/* Main Charts Section - Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Inventory Movement Bar Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Movimiento de Inventario</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Entradas vs Salidas (Semanal)</p>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <Package className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={movementData} barSize={12} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="colorSalidas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                <Bar
                                    name="Entradas"
                                    dataKey="entradas"
                                    fill="url(#colorEntradas)"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                />
                                <Bar
                                    name="Salidas"
                                    dataKey="salidas"
                                    fill="url(#colorSalidas)"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={1500}
                                    animationBegin={200}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Investment Trend Bar Chart (Vertical) */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Tendencia de Inversión</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Valorización acumulada (Semestral)</p>
                        </div>
                        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-violet-500" />
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={investmentData} barSize={24} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                                <Bar
                                    name="Valor de Inventario"
                                    dataKey="valor"
                                    fill="url(#colorValor)"
                                    radius={[6, 6, 0, 0]}
                                    animationDuration={1500}
                                >

                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Secondary Charts Section - Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Categories Distribution */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Distribución por Categoría</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} layout="vertical" barSize={20} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCategory" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-700" opacity={0.5} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                                <Bar
                                    name="Cantidad"
                                    dataKey="value"
                                    fill="url(#colorCategory)"
                                    radius={[0, 4, 4, 0]}
                                    animationDuration={1200}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tools Status - Donut Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Estado de Herramientas</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.charts?.toolsStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(stats?.charts?.toolsStatus || []).map((entry, index) => {
                                        const getColor = (status) => {
                                            switch (status?.toLowerCase()) {
                                                case 'operativo': return '#10b981'; // Emerald 500
                                                case 'en mantenimiento': return '#f59e0b'; // Amber 500
                                                case 'extraviado': return '#ef4444'; // Red 500
                                                default: return '#94a3b8';
                                            }
                                        };
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getColor(entry.name)}
                                                style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))' }}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Stats */}
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                {kpi.toolsCount}
                            </span>
                            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Total</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, unit, icon, trend, trendUp, subtext, alert, color, iconBg }) => (
    <div className={`
        relative overflow-hidden bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group
        ${alert ? 'border-amber-200 dark:border-amber-900/50' : 'border-slate-200 dark:border-slate-700'}
    `}>
        {/* Background Gradient Effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} blur-3xl rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity`} />

        <div className="relative">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">{value}</h3>
                        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${iconBg} bg-opacity-10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
            </div>

            <div className="flex items-center text-sm">
                {trend ? (
                    <span className={`flex items-center font-bold ${trendUp ? 'text-emerald-500' : 'text-rose-500'} bg-slate-50 dark:bg-slate-700/50 px-2 py-0.5 rounded-md`}>
                        {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {trend}
                    </span>
                ) : (
                    <span className={`font-medium ${alert ? 'text-amber-500' : 'text-slate-400'}`}>
                        {subtext || '----'}
                    </span>
                )}
                {trend && <span className="text-slate-400 ml-2 text-xs">vs mes anterior</span>}
            </div>
        </div>
    </div>
);

export default Dashboard;
