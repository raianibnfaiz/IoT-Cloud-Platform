import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CaseStudies = () => {
    const caseStudies = [
        {
            title: "Smart Manufacturing Optimization",
            company: "TechManufacturing Co.",
            description: "How TechManufacturing increased efficiency by 40% using our IoT platform",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
            category: "Manufacturing",
            results: ["40% efficiency increase", "50% reduction in downtime", "$2M annual savings"]
        },
        {
            title: "Agricultural IoT Implementation",
            company: "GreenFields Farms",
            description: "Transforming traditional farming with smart irrigation and monitoring",
            image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
            category: "Agriculture",
            results: ["30% water savings", "25% yield increase", "Real-time crop monitoring"]
        },
        {
            title: "Smart City Infrastructure",
            company: "MetroCity Council",
            description: "Implementing city-wide IoT solutions for better urban management",
            image: "https://images.unsplash.com/photo-1573108724029-4c46571d6490",
            category: "Smart Cities",
            results: ["20% energy savings", "Improved traffic flow", "Enhanced public safety"]
        },
        {
            title: "Healthcare Monitoring System",
            company: "HealthCare Plus",
            description: "Remote patient monitoring and healthcare asset tracking",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
            category: "Healthcare",
            results: ["24/7 patient monitoring", "15% cost reduction", "Improved patient care"]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Hero Section */}
            <div className="pt-20 pb-16 text-center">
                <motion.h1 
                    className="text-5xl font-bold text-slate-900 dark:text-white mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Customer Success Stories
                </motion.h1>
                <motion.p 
                    className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    See how organizations are transforming their operations with our IoT platform
                </motion.p>
            </div>

            {/* Case Studies Grid */}
            <motion.div 
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {caseStudies.map((study) => (
                        <motion.div
                            key={study.title}
                            variants={itemVariants}
                            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-48 overflow-hidden">
                                <img 
                                    src={study.image} 
                                    alt={study.title}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full text-sm font-medium">
                                        {study.category}
                                    </span>
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {study.company}
                                    </h3>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    {study.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 mb-6">
                                    {study.description}
                                </p>
                                <div className="space-y-2 mb-6">
                                    {study.results.map((result, index) => (
                                        <div key={index} className="flex items-center text-slate-700 dark:text-slate-300">
                                            <svg
                                                className="w-5 h-5 text-emerald-500 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            {result}
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to={`/case-studies/${study.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="inline-block bg-slate-900 dark:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors duration-200"
                                >
                                    Read Full Story
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* CTA Section */}
            <div className="bg-slate-900 dark:bg-slate-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Ready to write your success story?
                    </h2>
                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/contact"
                            className="bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200"
                        >
                            Contact Sales
                        </Link>
                        <Link
                            to="/demo"
                            className="bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                        >
                            Request Demo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;