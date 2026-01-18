import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, ArrowRight, Settings, Sparkles } from 'lucide-react';

export default function DepartmentServices() {
    const { id } = useParams();
    const [department, setDepartment] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const response = await citizenAPI.getDepartmentServices(id);
            setDepartment(response.data.data.department);
            setServices(response.data.data.services || []);
        } catch (error) {
            console.error('Error loading services:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName) => {
        const icons = {
            'heart-pulse': '❤️',
            'leaf': '🌿',
            'calendar-plus': '📅',
            'message-circle': '💬',
            'file-text': '📄',
        };
        return icons[iconName] || '📋';
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

    if (!department) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">Department not found</h2>
                    <Link to="/departments" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        ← Back to Departments
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Back Button */}
            <Link
                to="/departments"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Departments
            </Link>

            {/* Department Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-6 lg:p-8 shadow-xl border border-blue-500/20 mb-8 animate-fade-in">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-5xl shadow-lg">
                        {getIcon(department.icon)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="text-white" size={24} />
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">{department.name}</h1>
                        </div>
                        <p className="text-blue-100 text-lg mt-1 max-w-2xl">{department.description || 'Access various services from this department'}</p>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="mb-6 animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Services</h2>
                <p className="text-gray-500">Select a service to proceed with your application</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {services.map((service, index) => (
                    <Link
                        key={service._id}
                        to={`/services/${service._id}`}
                        className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex items-start gap-5 mb-5">
                            <div className="w-18 h-18 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform">
                                {getIcon(service.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {service.name}
                                </h3>
                                <p className="text-base text-gray-500 mt-2 line-clamp-2">
                                    {service.description || 'Click to access this service'}
                                </p>
                            </div>
                        </div>
                        <div className="pt-5 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">Apply Now</span>
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <ArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" size={18} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {services.length === 0 && (
                <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-lg animate-fade-in">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Settings className="text-gray-400" size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No services available</h3>
                    <p className="text-gray-500 mb-6">This department has no active services at the moment</p>
                    <Link
                        to="/departments"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        <ArrowLeft size={18} />
                        Browse Other Departments
                    </Link>
                </div>
            )}
        </Layout>
    );
}