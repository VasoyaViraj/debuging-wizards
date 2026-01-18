import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { citizenAPI } from '../../lib/api';
import Layout from '../../components/layout/Layout';
import { ArrowLeft, Send, CheckCircle, FileText, XCircle } from 'lucide-react';

export default function ServiceForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadService();
    }, [id]);

    const loadService = async () => {
        try {
            const response = await citizenAPI.getService(id);
            setService(response.data.data);

            // Initialize form data with empty values
            const initialData = {};
            response.data.data.formSchema?.forEach(field => {
                initialData[field.name] = '';
            });
            setFormData(initialData);
        } catch (error) {
            console.error('Error loading service:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            await citizenAPI.submitRequest({
                serviceId: id,
                payload: formData
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field) => {
        const baseClasses = "w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 hover:border-gray-300";

        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseClasses}
                        required={field.required}
                    >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={`${baseClasses} min-h-[120px] resize-none`}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
            case 'date':
                return (
                    <input
                        type="date"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseClasses}
                        required={field.required}
                        min={new Date().toISOString().split('T')[0]}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseClasses}
                        placeholder={field.placeholder}
                        required={field.required}
                        min="0"
                    />
                );
            default:
                return (
                    <input
                        type={field.type || 'text'}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={baseClasses}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                );
        }
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

    if (!service) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900">Service not found</h2>
                    <Link to="/departments" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
                        ← Back to Departments
                    </Link>
                </div>
            </Layout>
        );
    }

    if (success) {
        return (
            <Layout>
                <div className="max-w-lg mx-auto text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                    <p className="text-gray-500 mb-6">
                        Your request has been submitted successfully. You can track its status in your requests page.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/requests"
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                        >
                            View My Requests
                        </Link>
                        <Link
                            to="/departments"
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Browse More Services
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Back Button */}
            <Link
                to={`/departments/${service.departmentId?._id}`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft size={20} />
                Back to {service.departmentId?.name}
            </Link>

            <div className="max-w-3xl mx-auto w-full animate-fade-in">
                {/* Service Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 lg:p-10 shadow-xl border border-blue-500/20 mb-10">
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="text-white" size={36} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">{service.name}</h1>
                            <p className="text-blue-100 text-xl mb-5">{service.description}</p>
                            <span className="inline-flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl text-base font-semibold border border-white/30">
                                {service.departmentId?.name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-10 pb-5 border-b border-gray-100">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Application Form</h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm animate-slide-up flex items-center gap-2">
                            <XCircle size={18} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {service.formSchema?.map((field, index) => (
                            <div key={field.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                {renderField(field)}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                            >
                            {submitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Submit Request
                                </>
                            )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
