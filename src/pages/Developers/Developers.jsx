import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../../components/Layout/MainLayout';

const Developers = () => {
    const resources = [
        {
            title: "API Documentation",
            description: "Comprehensive API documentation with examples and best practices",
            icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
            link: "/docs/api"
        },
        {
            title: "SDKs & Libraries",
            description: "Official SDKs for multiple programming languages and platforms",
            icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            link: "/docs/sdks"
        },
        {
            title: "Sample Projects",
            description: "Ready-to-use example projects and templates",
            icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
            link: "/examples"
        },
        {
            title: "Developer Tools",
            description: "CLI tools, debugging utilities, and development resources",
            icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
            link: "/tools"
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
                            Developer Resources
                        </motion.h1>
                        <motion.p
                            className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Everything you need to build and integrate with our IoT platform
                        </motion.p>
                        <motion.div
                            className="flex justify-center space-x-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Link
                                to="/docs/quickstart"
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                Quick Start Guide
                            </Link>
                            <Link
                                to="/docs/api"
                                className="bg-slate-700 text-white font-semibold px-8 py-4 rounded-lg hover:bg-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                API Reference
                            </Link>
                        </motion.div>
                    </div>

                    {/* Resources Grid */}
                    <motion.div
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {resources.map((resource) => (
                                <motion.div
                                    key={resource.title}
                                    variants={itemVariants}
                                    className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <Link to={resource.link} className="block">
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
                                                        d={resource.icon}
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                {resource.title}
                                            </h3>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300">
                                            {resource.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Community Section */}
                    <div className="bg-slate-900 dark:bg-slate-800 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-8">
                                Join Our Developer Community
                            </h2>
                            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                                Connect with other developers, share your projects, and get help from our team
                            </p>
                            <div className="flex justify-center space-x-4">
                                <Link
                                    to="/community"
                                    className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                                >
                                    Join Community
                                </Link>
                                <Link
                                    to="/blog"
                                    className="bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                                >
                                    Read Blog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Developers;