import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import {
    Building2, Settings, Users, FileText,
    TrendingUp, CheckCircle2, Clock, XCircle,
    ArrowUpRight, ArrowDownRight, BarChart3,
    Activity
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200',
            ACCEPTED: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200',
            REJECTED: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200',
        };
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Header */}
            <div className="mb-10 animate-fade-in">
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-8 lg:p-10 shadow-xl border border-purple-500/20">
                    <div className="flex items-center gap-4 mb-3">
                        <Activity className="text-white" size={36} />
                        <h1 className="text-4xl lg:text-5xl font-bold text-white">Admin Dashboard</h1>
                    </div>
                    <p className="text-purple-100 text-xl mt-3">System overview and management</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-up">
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Total Departments</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.departments?.total || 0}</p>
                            <p className="text-sm text-green-600 font-semibold mt-3 flex items-center gap-1">
                                <CheckCircle2 size={14} />
                                {stats?.departments?.active || 0} active
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Building2 className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Total Services</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.services?.total || 0}</p>
                            <p className="text-sm text-green-600 font-semibold mt-3 flex items-center gap-1">
                                <CheckCircle2 size={14} />
                                {stats?.services?.active || 0} active
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Settings className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Total Users</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.users?.total || 0}</p>
                            <p className="text-sm text-gray-500 font-medium mt-3">Registered</p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Users className="text-white" size={28} />
                        </div>
                    </div>
                </div>

                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-3">Total Requests</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-2">{stats?.requests?.total || 0}</p>
                            <p className="text-sm text-amber-600 font-semibold mt-3 flex items-center gap-1">
                                <Clock size={14} />
                                {stats?.requests?.pending || 0} pending
                            </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <FileText className="text-white" size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Stats with Gradients */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in">
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <Clock className="opacity-90" size={36} />
                        <ArrowUpRight size={24} className="opacity-70" />
                    </div>
                    <p className="text-amber-100 font-medium mb-2">Pending Requests</p>
                    <p className="text-5xl font-extrabold">{stats?.requests?.pending || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <CheckCircle2 className="opacity-90" size={36} />
                        <ArrowUpRight size={24} className="opacity-70" />
                    </div>
                    <p className="text-green-100 font-medium mb-2">Accepted Requests</p>
                    <p className="text-5xl font-extrabold">{stats?.requests?.accepted || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <XCircle className="opacity-90" size={36} />
                        <ArrowDownRight size={24} className="opacity-70" />
                    </div>
                    <p className="text-red-100 font-medium mb-2">Rejected Requests</p>
                    <p className="text-5xl font-extrabold">{stats?.requests?.rejected || 0}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-slide-up">
                {/* Requests by Department */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BarChart3 className="text-blue-600" size={24} />
                            Requests by Department
                        </h2>
                    </div>
                    <div className="p-8">
                        {stats?.requestsByDepartment?.length > 0 ? (
                            <div className="space-y-6">
                                {stats.requestsByDepartment.map((item, index) => {
                                    const maxCount = Math.max(...stats.requestsByDepartment.map(d => d.count));
                                    const percentage = (item.count / maxCount) * 100;
                                    return (
                                        <div key={index} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700 font-medium">{item.departmentName}</span>
                                                <span className="font-bold text-gray-900 text-lg">{item.count}</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 shadow-sm"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No data available</p>
                        )}
                    </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="text-indigo-600" size={24} />
                            Recent Requests
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats?.recentRequests?.slice(0, 5).map((request, index) => (
                            <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{request.serviceId?.name}</p>
                                        <p className="text-sm text-gray-500 mt-1 truncate">{request.citizenId?.name}</p>
                                    </div>
                                    {getStatusBadge(request.status)}
                                </div>
                            </div>
                        ))}
                        {(!stats?.recentRequests || stats.recentRequests.length === 0) && (
                            <p className="text-center text-gray-500 py-12">No recent requests</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                <Link
                    to="/admin/departments"
                    className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                        <Building2 className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-lg mb-3">Manage Departments</h3>
                    <p className="text-base text-gray-500">Add, edit, or disable departments</p>
                </Link>
                <Link
                    to="/admin/services"
                    className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                        <Settings className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-lg mb-3">Manage Services</h3>
                    <p className="text-base text-gray-500">Configure services and forms</p>
                </Link>
                <Link
                    to="/admin/users"
                    className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                        <Users className="text-white" size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors text-lg mb-3">Manage Users</h3>
                    <p className="text-base text-gray-500">Add officers and manage users</p>
                </Link>
            </div>
        </Layout>
    );
}