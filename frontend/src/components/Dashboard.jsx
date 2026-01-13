import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';
import {
    Wrench,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    DollarSign
} from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/dashboard/stats');
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
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-blue-600 dark:text-blue-400 font-bold text-xl animate-pulse">Cargando datos...</div>
            </div>
        );
    }

    const movementData = stats?.charts?.movement || [];
    const categoryData = stats?.charts?.categories || [];
    const investmentData = stats?.charts?.investment || [];
    const kpi = stats?.kpi || { inventoryValue: 0, lowStock: 0, toolsCount: 0, suppliersCount: 0 };

    const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

    return (
        <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Valor de Inventario"
                    value={`S/. ${kpi.inventoryValue.toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                    trend="+12%"
                    trendUp={true}
                    color="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
                />
                <StatCard
                    title="Stock Crítico"
                    value={`${kpi.lowStock} Ítems`}
                    icon={<AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
                    subtext="Requiere atención"
                    color="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800"
                />
                <StatCard
                    title="Total Herramientas"
                    value={kpi.toolsCount}
                    icon={<Wrench className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                    subtext="Activos registrados"
                    color="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800"
                />
                <StatCard
                    title="Proveedores Activos"
                    value={kpi.suppliersCount}
                    icon={<Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                    subtext="Verificados SUNAT"
                    color="bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Investment Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 block">Evolución del Inventario</h3>
                    <div className="h-80 w-full" style={{ minHeight: '320px' }}>
                        <ResponsiveContainer width="99%" height="100%" debounce={200}>
                            <LineChart data={investmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `S/.${value / 1000}k`} tick={{ fill: '#94a3b8' }} domain={[0, 'auto']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)', color: '#f8fafc' }}
                                    formatter={(value) => [`S/. ${value}`, 'Valor']}
                                    labelStyle={{ color: '#94a3b8' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="valor"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Distribución por Categoría</h3>
                    <div className="h-60 relative w-full" style={{ minHeight: '240px' }}>
                        <ResponsiveContainer width="99%" height="100%" debounce={200}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} itemStyle={{ color: '#f8fafc' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-2xl font-bold text-slate-800 dark:text-white">{categoryData.reduce((acc, curr) => acc + curr.value, 0)}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Ítems</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {categoryData.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                    <span className="text-slate-600 dark:text-slate-400">{cat.name}</span>
                                </div>
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                    {categoryData.length > 0 ? ((cat.value / categoryData.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(0) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, icon, trend, trendUp, subtext, color }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {trend && (
                <span className={`flex items-center font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {trendUp ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {trend}
                </span>
            )}
            {subtext && <span className="text-slate-400 dark:text-slate-500">{subtext}</span>}
            {trend && <span className="text-slate-400 dark:text-slate-500 ml-2">vs mes anterior</span>}
        </div>
    </div>
);

export default Dashboard;
