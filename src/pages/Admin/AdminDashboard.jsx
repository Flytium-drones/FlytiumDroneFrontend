import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../Context/auth";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    monthlyRevenue: [],
    categoryStats: [],
    orderStatus: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`
        }
      });
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue',
        data: stats.monthlyRevenue || [30000, 25000, 35000, 40000, 38000, 45000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
      },
    ],
  };

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Books', 'Food', 'Others'],
    datasets: [
      {
        label: 'Sales by Category',
        data: [300, 250, 200, 180, 120],
        backgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(6, 182, 212, 0.9)',
          'rgba(251, 191, 36, 0.9)',
          'rgba(34, 197, 94, 0.9)',
          'rgba(168, 85, 247, 0.9)',
        ],
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, accentColor }) => (
    <div className="group relative bg-[#0f172a] border border-slate-800/80 rounded-xl hover:border-slate-600 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex flex-col flex-grow relative z-10">
        <div className="flex items-start justify-between gap-3 mb-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 truncate">{title}</p>
            <h3 className="text-2xl xl:text-3xl font-black text-white break-words">{value}</h3>
          </div>
          <div className={`shrink-0 p-2.5 rounded-lg border ${
            accentColor === 'indigo' ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400' : 
            accentColor === 'cyan' ? 'border-cyan-500/20 bg-cyan-500/10 text-cyan-400' : 
            accentColor === 'amber' ? 'border-amber-500/20 bg-amber-500/10 text-amber-400' : 
            'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/60">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span className={`text-xs font-bold truncate ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              {trendValue}% from last month
            </span>
          </div>
        )}
      </div>
      <div className={`absolute inset-0 bg-gradient-to-br ${accentColor === 'indigo' ? 'from-indigo-600/0 to-indigo-600/10' : accentColor === 'cyan' ? 'from-cyan-500/0 to-cyan-500/10' : accentColor === 'amber' ? 'from-amber-500/0 to-amber-500/10' : 'from-emerald-500/0 to-emerald-500/10'} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
    </div>
  );

  return (
    <Layout title="Admin Dashboard">
      <div className="min-h-screen bg-slate-950">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/5 bg-slate-900 border-r-2 border-slate-800">
            <AdminMenu />
          </div>
          
          <div className="flex-1 p-8">
            {/* Header */}
            <div className="mb-12 pb-8 border-b-2 border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-black text-white mb-3">Dashboard</h1>
                  <p className="text-xl text-slate-400">Welcome back, <span className="text-indigo-400 font-bold">{auth?.user?.name}</span></p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-slate-900 border-2 border-indigo-600">
                  <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                  <span className="text-sm font-bold text-white">Live Analytics</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers || '0'}
                icon={Users}
                accentColor="indigo"
                trend="up"
                trendValue="12.5"
              />
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts || '0'}
                icon={Package}
                accentColor="cyan"
                trend="up"
                trendValue="8.2"
              />
              <StatCard 
                title="Total Orders" 
                value={stats.totalOrders || '0'}
                icon={ShoppingCart}
                accentColor="amber"
                trend="up"
                trendValue="15.3"
              />
              <StatCard 
                title="Total Revenue" 
                value={`₹${stats.totalRevenue || '0'}`}
                icon={DollarSign}
                accentColor="emerald"
                trend="up"
                trendValue="23.1"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-900 border-2 border-slate-800 p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border-2 border-indigo-600 bg-indigo-600/10">
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-black text-white">Revenue Overview</h2>
                  </div>
                  <button className="px-4 py-2 border-2 border-slate-700 hover:border-indigo-600 text-slate-400 hover:text-white text-xs font-bold transition-colors">
                    Last 6 Months
                  </button>
                </div>
                <Line 
                  data={revenueData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(148, 163, 184, 0.1)',
                        },
                        ticks: {
                          color: '#94a3b8',
                          font: {
                            weight: 'bold',
                          }
                        }
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: '#94a3b8',
                          font: {
                            weight: 'bold',
                          }
                        }
                      }
                    }
                  }}
                />
              </div>

              <div className="bg-slate-900 border-2 border-slate-800 p-8">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border-2 border-cyan-500 bg-cyan-500/10">
                      <PieChart className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="text-xl font-black text-white">Sales by Category</h2>
                  </div>
                </div>
                <div className="flex items-center justify-center" style={{ height: '250px' }}>
                  <Doughnut 
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            color: '#cbd5e1',
                            font: {
                              weight: 'bold',
                              size: 12,
                            },
                            padding: 15,
                          }
                        },
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 border-2 border-slate-800 p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-800">
                <div className="p-2 border-2 border-amber-500 bg-amber-500/10">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-xl font-black text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Manage Products', icon: Package, link: '/dashboard/admin/products', color: 'indigo' },
                  { label: 'View Orders', icon: ShoppingCart, link: '/dashboard/admin/orders', color: 'cyan' },
                  { label: 'Manage Users', icon: Users, link: '/dashboard/admin/users', color: 'amber' },
                  { label: 'Analytics', icon: TrendingUp, link: '#', color: 'emerald' },
                ].map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => window.location.href = action.link}
                    className={`group relative p-6 border-2 ${
                      action.color === 'indigo' ? 'border-slate-800 hover:border-indigo-600' :
                      action.color === 'cyan' ? 'border-slate-800 hover:border-cyan-500' :
                      action.color === 'amber' ? 'border-slate-800 hover:border-amber-500' :
                      'border-slate-800 hover:border-emerald-500'
                    } bg-slate-800/50 hover:bg-slate-800 transition-all overflow-hidden`}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <action.icon className={`w-8 h-8 ${
                        action.color === 'indigo' ? 'text-indigo-400' :
                        action.color === 'cyan' ? 'text-cyan-400' :
                        action.color === 'amber' ? 'text-amber-400' :
                        'text-emerald-400'
                      }`} />
                      <span className="text-sm font-black text-white">{action.label}</span>
                      <ArrowUpRight className={`w-4 h-4 ${
                        action.color === 'indigo' ? 'text-indigo-400' :
                        action.color === 'cyan' ? 'text-cyan-400' :
                        action.color === 'amber' ? 'text-amber-400' :
                        'text-emerald-400'
                      } opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
