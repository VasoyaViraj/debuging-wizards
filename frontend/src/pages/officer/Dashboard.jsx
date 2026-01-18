import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { officerAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { FileText, Clock, CheckCircle2, XCircle, ArrowRight, TrendingUp, Activity } from 'lucide-react';

export default function OfficerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [statsRes, reqRes] = await Promise.all([officerAPI.getStats(), officerAPI.getRequests({ limit: 10 })]);
            setStats(statsRes.data.data);
            setRequests(reqRes.data.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200',
            ACCEPTED: 'bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200',
            REJECTED: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200'
        };
        const icons = { PENDING: Clock, ACCEPTED: CheckCircle2, REJECTED: XCircle };
        const Icon = icons[status] || Clock;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${styles[status]}`}>
                <Icon size={12} />
                {status}
            </span>
        );
    };

    if (loading) return <Layout><div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div></div></Layout>;

    return (
        <Layout>
            {/* Header with Gradient */}
            <div className="mb-10 animate-fade-in">
                <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-8 lg:p-10 shadow-xl border border-amber-500/20">
                    <div className="flex items-center gap-4 mb-3">
                        <Activity className="text-white" size={36} />
                        <h1 className="text-4xl lg:text-5xl font-bold text-white">Department Dashboard</h1>
                    </div>
                    <p className="text-amber-100 text-xl mt-3">
                        Welcome, <span className="font-semibold text-white">{user?.name}</span> • {user?.departmentId?.name || 'Department Officer'}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-up">
                <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <FileText className="text-white" size={32} />
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-gray-900">{stats?.total || 0}</p>
                            <p className="text-gray-600 text-base font-medium mt-2">Total Requests</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <Clock className="mb-4" size={32} />
                    <p className="text-amber-100 text-base font-medium mb-3">Pending</p>
                    <p className="text-5xl font-extrabold">{stats?.pending || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <CheckCircle2 className="mb-4" size={32} />
                    <p className="text-green-100 text-base font-medium mb-3">Accepted</p>
                    <p className="text-5xl font-extrabold">{stats?.accepted || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <XCircle className="mb-4" size={32} />
                    <p className="text-red-100 text-base font-medium mb-3">Rejected</p>
                    <p className="text-5xl font-extrabold">{stats?.rejected || 0}</p>
                </div>
            </div>

            {/* Recent Requests Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FileText className="text-blue-600" size={24} />
                            Recent Requests
                        </h2>
                        <Link to="/officer/requests" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1.5 group">
                            View All
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {requests.slice(0, 5).map((req, index) => (
                            <Link
                                key={req._id}
                                to={`/officer/requests/${req._id}`}
                                className="flex items-center gap-5 p-8 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="text-gray-600 group-hover:text-blue-600" size={26} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-lg">{req.serviceId?.name}</h3>
                                    <p className="text-base text-gray-500 mt-2 truncate">{req.citizenId?.name} • {new Date(req.createdAt).toLocaleDateString()}</p>
                                </div>
                            <div className="flex-shrink-0">{getStatusBadge(req.status)}</div>
                        </Link>
                    ))}
                    {requests.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-gray-400" size={40} />
                            </div>
                            <p className="text-gray-500 font-medium">No requests available</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}