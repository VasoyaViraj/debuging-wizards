import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, XCircle, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

// ESLint-safe reference
const MotionDiv = motion.div;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(email, password);
            const roleRoutes = {
                ADMIN: '/admin/dashboard',
                CITIZEN: '/dashboard',
                DEPARTMENT_PERSON: '/officer/dashboard',
            };
            navigate(roleRoutes[user?.role] || '/dashboard');
        } catch (err) {
            setError(err?.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans text-slate-900">
            {/* LEFT PANEL — FORMAL / ODOO STYLE */}
            <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-[50%] bg-slate-100 border-r border-slate-200 flex-col justify-between px-20 py-16"
            >
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        {/* <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div> */}
                        <span className="text-3xl font-bold text-slate-900">
                            Nexus<br/><span className='text-xl font-semibold'>National Exchange for Unified Services</span>
                        </span>
                    </div>

                    <div className="max-w-xl">
                        <h1 className="text-4xl font-semibold text-slate-900 leading-tight mb-6">
                            Digital Governance <br />
                            Platform for Citizens
                        </h1>

                        <p className="text-slate-600 text-lg leading-relaxed">
                            Nexus provides a unified and secure interface for accessing
                            municipal services, tracking requests, and managing official
                            interactions with transparency and efficiency.
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-8 max-w-xl">
                    <div className="flex gap-4">
                        <ShieldCheck className="text-slate-700" size={28} />
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Secure Access
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Industry-standard authentication and data protection.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Activity className="text-slate-700" size={28} />
                        <div>
                            <h3 className="font-semibold text-slate-900 mb-1">
                                Service Transparency
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Track applications and requests in real time.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-slate-500 text-sm">
                    © {new Date().getFullYear()} Nexus. All rights reserved.
                </p>
            </MotionDiv>

            {/* RIGHT PANEL — UNCHANGED */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[500px]"
                >
                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mb-8 p-5 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-base font-medium flex items-center gap-3"
                        >
                            <XCircle size={22} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-base font-bold text-slate-700 ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-base font-bold text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-lg focus:ring-4 focus:ring-blue-500/10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                            <div className="flex justify-end pt-1">
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-5 rounded-2xl shadow-xl transition-all"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In 
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500 text-base">
                            Don&apos;t have an account?{' '}
                            <Link
                                to="/register"
                                className="text-blue-600 font-bold hover:text-blue-700"
                            >
                                Create Account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
