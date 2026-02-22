import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Coins, Package, Loader2, ArrowUpRight, Clock, Box, Edit } from 'lucide-react';
import Chart from 'react-apexcharts';
import ProductModal from '../components/ProductModal';
import OrderDetailsModal from '../components/OrderDetailsModal';

export default function AdminDashboard() {
    const { currentUser, userData } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    // Stats State
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        activeProducts: 0,
        totalUsers: 0,
        revenueTrend: '0%',
        ordersTrend: '0%',
        usersTrend: '0%'
    });
    const [chartData, setChartData] = useState([]);
    const [productsList, setProductsList] = useState([]);

    const fetchAdminData = async () => {
        if (!userData?.isAdmin) return;

        try {
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            const p = query(collection(db, 'products'));
            const u = query(collection(db, 'users'));

            const [querySnapshot, productSnapshot, usersSnapshot] = await Promise.all([
                getDocs(q),
                getDocs(p),
                getDocs(u)
            ]);

            const fetchedOrders = [];
            let totalRevenue = 0;
            const chartMap = {};

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const isCurrentMonth = (date) => date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            const isLastMonth = (date) => {
                const lastMonthDate = new Date(now);
                lastMonthDate.setMonth(now.getMonth() - 1);
                return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
            };

            let currentMonthRevenue = 0;
            let lastMonthRevenue = 0;
            let currentMonthOrders = 0;
            let lastMonthOrders = 0;
            let currentMonthUsers = 0;
            let lastMonthUsers = 0;

            querySnapshot.forEach((doc) => {
                const order = { id: doc.id, ...doc.data() };
                fetchedOrders.push(order);
                const amount = parseFloat(order.totalAmount || 0);
                totalRevenue += amount;

                if (order.createdAt) {
                    // Check if createdAt is a Firestore instance or an ISO string (orders are usually Firestore Instances)
                    const date = order.createdAt.seconds ? new Date(order.createdAt.seconds * 1000) : new Date(order.createdAt);

                    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    if (!chartMap[dateStr]) chartMap[dateStr] = 0;
                    chartMap[dateStr] += amount;

                    if (isCurrentMonth(date)) {
                        currentMonthRevenue += amount;
                        currentMonthOrders += 1;
                    } else if (isLastMonth(date)) {
                        lastMonthRevenue += amount;
                        lastMonthOrders += 1;
                    }
                }
            });

            usersSnapshot.forEach(doc => {
                const user = doc.data();
                if (user.createdAt) {
                    const date = new Date(user.createdAt);
                    if (isCurrentMonth(date)) currentMonthUsers += 1;
                    else if (isLastMonth(date)) lastMonthUsers += 1;
                } else {
                    currentMonthUsers += 1;
                }
            });

            const calculateTrend = (current, previous) => {
                if (previous === 0) return current > 0 ? "+100%" : "0%";
                const percentage = ((current - previous) / previous) * 100;
                return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
            };

            const dates = Object.keys(chartMap).sort((a, b) => new Date(a) - new Date(b));

            const formattedChartData = dates.map(date => {
                return {
                    x: date,
                    y: chartMap[date]
                };
            }).reverse();

            const fetchedProducts = [];
            productSnapshot.forEach(doc => {
                fetchedProducts.push({ id: doc.id, ...doc.data() });
            });

            setOrders(fetchedOrders);
            setChartData(formattedChartData);
            setProductsList(fetchedProducts);
            setStats({
                totalOrders: fetchedOrders.length,
                totalSales: totalRevenue,
                activeProducts: productSnapshot.size,
                totalUsers: usersSnapshot.size,
                revenueTrend: calculateTrend(currentMonthRevenue, lastMonthRevenue),
                ordersTrend: calculateTrend(currentMonthOrders, lastMonthOrders),
                usersTrend: calculateTrend(currentMonthUsers, lastMonthUsers)
            });

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, [userData]);

    // Protect Admin Route securely
    if (!currentUser || (userData && !userData.isAdmin)) {
        return <Navigate to="/" replace />;
    }

    const StatCard = ({ title, value, icon: Icon, trend, prefix = '' }) => (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">{title}</h3>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Icon className="w-5 h-5 text-accent" />
                </div>
            </div>
            <div className="flex items-end gap-4">
                <h2 className="text-3xl font-bold text-white">
                    {prefix}{value.toLocaleString('en-GH')}
                </h2>
                {trend && (
                    <span className="flex items-center text-sm font-medium text-green-400 mb-1">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Admin <span className="text-accent">Dashboard</span></h1>
                    <p className="text-slate-400">Welcome back, {userData?.name}. Here's what's happening with your store today.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                        className="glass-button px-6 py-2.5 flex items-center gap-2"
                    >
                        <Package className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <StatCard
                            title="Total Revenue"
                            value={stats.totalSales}
                            prefix="GH₵ "
                            icon={Coins}
                            trend={stats.revenueTrend}
                        />
                        <StatCard
                            title="Total Orders"
                            value={stats.totalOrders}
                            icon={ShoppingBag}
                            trend={stats.ordersTrend}
                        />
                        <StatCard
                            title="Active Products"
                            value={stats.activeProducts}
                            icon={Package}
                        />
                        <StatCard
                            title="Total Users"
                            value={stats.totalUsers}
                            icon={Users}
                            trend={stats.usersTrend}
                        />
                    </div>

                    {/* Revenue Chart */}
                    <div className="glass-card overflow-hidden mb-10 p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Revenue Summary (Line)</h2>
                        <div className="h-72 w-full text-black">
                            {chartData.length > 0 ? (
                                <Chart
                                    type="area"
                                    height="100%"
                                    series={[{ name: "Revenue", data: chartData }]}
                                    options={{
                                        chart: {
                                            type: 'area',
                                            background: 'transparent',
                                            toolbar: { show: false },
                                            foreColor: '#94a3b8'
                                        },
                                        colors: ['#818cf8'],
                                        stroke: {
                                            curve: 'smooth',
                                            width: 3
                                        },
                                        fill: {
                                            type: 'gradient',
                                            gradient: {
                                                shadeIntensity: 1,
                                                opacityFrom: 0.5,
                                                opacityTo: 0,
                                                stops: [0, 90, 100]
                                            }
                                        },
                                        dataLabels: {
                                            enabled: false
                                        },
                                        xaxis: {
                                            type: 'category',
                                            labels: { style: { colors: '#94a3b8' } },
                                            axisBorder: { show: false },
                                            axisTicks: { show: false }
                                        },
                                        yaxis: {
                                            tooltip: { enabled: true },
                                            labels: {
                                                style: { colors: '#94a3b8' },
                                                formatter: (value) => `GH₵ ${value.toFixed(0)}`
                                            }
                                        },
                                        grid: {
                                            borderColor: '#ffffff15',
                                            strokeDashArray: 3,
                                            xaxis: { lines: { show: false } },
                                            yaxis: { lines: { show: true } }
                                        },
                                        tooltip: {
                                            theme: 'dark',
                                            y: { formatter: (value) => `GH₵ ${value.toFixed(2)}` }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500">Not enough data to graph</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                            <button className="text-sm text-accent hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                                        <th className="p-4 font-medium">Order ID</th>
                                        <th className="p-4 font-medium">Customer</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Amount</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 disabled">
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-400">
                                                No orders have been placed yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.slice(0, 10).map((order) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={order.id}
                                                onClick={() => { setSelectedOrderDetails(order); setIsOrderDetailsOpen(true); }}
                                                className="hover:bg-white/[0.05] transition-colors group cursor-pointer"
                                            >
                                                <td className="p-4 text-sm font-mono text-slate-300">
                                                    {order.id.substring(0, 8)}...
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-medium text-white">{order.shippingInfo?.fullName || 'Guest'}</div>
                                                    <div className="text-xs text-slate-500">{order.shippingInfo?.city}</div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400 flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                </td>
                                                <td className="p-4 font-bold text-accent">
                                                    GH₵ {parseFloat(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        {order.status || 'Paid'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="glass-card overflow-hidden mt-10">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Box className="w-5 h-5 text-accent" /> Inventory Stock
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm">
                                        <th className="p-4 font-medium">Product</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Price</th>
                                        <th className="p-4 font-medium">Stock Qty</th>
                                        <th className="p-4 font-medium">Qty Sold</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 disabled">
                                    {productsList.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="p-8 text-center text-slate-400">
                                                No products found in inventory.
                                            </td>
                                        </tr>
                                    ) : (
                                        productsList.map((product) => (
                                            <motion.tr
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                key={product.id}
                                                className="hover:bg-white/[0.02] transition-colors group"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 hidden sm:block">
                                                            <img
                                                                src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="font-medium text-white max-w-[200px] truncate">{product.name}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-400">
                                                    {product.category}
                                                </td>
                                                <td className="p-4 text-sm font-medium text-white">
                                                    GH₵ {parseFloat(product.price).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-4 font-bold text-accent">
                                                    {product.stock}
                                                </td>
                                                <td className="p-4 font-medium text-slate-300">
                                                    {product.sold || 0}
                                                </td>
                                                <td className="p-4">
                                                    {product.stock > 10 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                            In Stock
                                                        </span>
                                                    ) : product.stock > 0 ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                                            Low Stock
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <ProductModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onProductSaved={fetchAdminData}
                product={editingProduct}
            />

            <OrderDetailsModal
                isOpen={isOrderDetailsOpen}
                onClose={() => setIsOrderDetailsOpen(false)}
                order={selectedOrderDetails}
            />
        </div>
    );
}
