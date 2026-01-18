import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { Building2, ArrowRight, Search, Sparkles } from 'lucide-react';

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await citizenAPI.getDepartments();
            setDepartments(response.data.data || []);
        } catch (error) {
            console.error('Error loading departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'building': '🏢',
            'book': '📚',
            'car': '🚗',
            'home': '🏠',
        };
        return icons[iconName] || '🏛️';
    };

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            {/* Header with Gradient */}
            <div className="mb-10 animate-fade-in">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 lg:p-10 shadow-xl border border-blue-500/20">
                    <div className="flex items-center gap-4 mb-3">
                        <Sparkles className="text-white" size={36} />
                        <h1 className="text-4xl lg:text-5xl font-bold text-white">Departments</h1>
                    </div>
                    <p className="text-blue-100 text-xl mt-3">Browse government departments and their services</p>
                </div>
            </div>

            {/* Search Bar Enhanced */}
            <div className="mb-10 animate-slide-up">
                <div className="relative max-w-2xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search departments by name or description..."
                        className="w-full pl-14 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg hover:shadow-xl transition-all placeholder:text-gray-400 text-base"
                    />
                </div>
            </div>

            {/* Departments Grid with Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredDepartments.map((dept, index) => (
                    <Link
                        key={dept._id}
                        to={`/departments/${dept._id}`}
                        className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start gap-5 mb-5">
                            <div className="w-18 h-18 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">
                                {getIcon(dept.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {dept.name}
                                </h3>
                                <p className="text-base text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                    {dept.description || 'Access services from this department'}
                                </p>
                            </div>
                        </div>
                        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">View Services</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={18} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredDepartments.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-xl animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Building2 className="text-gray-400" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No departments found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search terms or check back later</p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </Layout>
    );
}