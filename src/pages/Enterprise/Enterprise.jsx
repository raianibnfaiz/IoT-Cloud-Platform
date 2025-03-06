import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../../components/Layout/MainLayout';

const Enterprise = () => {
    const features = [
        {
            title: "Custom Development",
            description: "Tailored IoT solutions designed specifically for your enterprise needs",
            icon: "M13 10V3L4 14h7v7l9-11h-7z" // Lightning bolt
        },
        {
            title: "Dedicated Support",
            description: "24/7 priority support with dedicated account manager and technical team",
            icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" // Info circle
        },
        {
            title: "Advanced Security",
            description: "Enterprise-grade security with custom authentication and encryption",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" // Shield check
        },
        {
            title: "Data Analytics",
            description: "Advanced analytics and reporting with custom dashboards",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" // Chart
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <MainLayout>
            <section className="flex-1 bg-gray-900">
                <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    {/* Hero Section */}
                    <div className="pt-20 pb-16 text-center">
                        <motion.h1
                            className="text-5xl font-bold text-slate-900 dark:text-white mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Enterprise IoT Solutions
                        </motion.h1>
                        <motion.p
                            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Scalable, secure, and customizable IoT platform for enterprise-grade deployments
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link
                                to="/contact"
                                className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Schedule a Demo
                            </Link>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <motion.div
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {features.map((feature) => (
                                <motion.div
                                    key={feature.title}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-emerald-500 rounded-lg mr-4">
                                            <svg
                                                className="w-6 h-6 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d={feature.icon}
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <div className="bg-slate-900 dark:bg-slate-800 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-8">
                                Ready to transform your IoT infrastructure?
                            </h2>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to="/contact"
                                    className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                                >
                                    Contact Sales
                                </Link>
                                <Link
                                    to="/docs/enterprise"
                                    className="bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                                >
                                    View Documentation
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Enterprise;