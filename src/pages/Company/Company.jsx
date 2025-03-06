import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Company = () => {
    const team = [
        {
            name: "Sarah Johnson",
            role: "CEO & Co-founder",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            bio: "15+ years experience in IoT and enterprise software"
        },
        {
            name: "Michael Chen",
            role: "CTO & Co-founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            bio: "Former Tech Lead at major cloud providers"
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Product",
            image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e",
            bio: "10+ years in product management and IoT solutions"
        },
        {
            name: "David Kim",
            role: "Head of Engineering",
            image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
            bio: "Expert in scalable distributed systems"
        }
    ];

    const values = [
        {
            title: "Innovation",
            description: "Pushing the boundaries of what's possible in IoT",
            icon: "M13 10V3L4 14h7v7l9-11h-7z"
        },
        {
            title: "Security",
            description: "Uncompromising commitment to data security and privacy",
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        },
        {
            title: "Customer Focus",
            description: "Building solutions that solve real customer problems",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        },
        {
            title: "Sustainability",
            description: "Committed to environmental responsibility",
            icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Hero Section */}
            <div className="pt-20 pb-16 text-center">
                <motion.h1 
                    className="text-5xl font-bold text-slate-900 dark:text-white mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Our Mission
                </motion.h1>
                <motion.p 
                    className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Empowering businesses with intelligent IoT solutions for a connected future
                </motion.p>
            </div>

            {/* Values Section */}
            <motion.div 
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                    Our Values
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value) => (
                        <motion.div
                            key={value.title}
                            variants={itemVariants}
                            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                                            d={value.icon}
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {value.title}
                                </h3>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Team Section */}
            <div className="bg-slate-900 dark:bg-slate-800 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-white mb-12 text-center">
                        Our Leadership Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member) => (
                            <motion.div
                                key={member.name}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-slate-800 dark:bg-slate-700 rounded-xl overflow-hidden"
                            >
                                <div className="h-64 overflow-hidden">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-emerald-400 mb-4">
                                        {member.role}
                                    </p>
                                    <p className="text-slate-300">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-emerald-500 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">
                        Join Our Team
                    </h2>
                    <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
                        We're always looking for talented individuals who share our vision
                    </p>
                    <Link
                        to="/careers"
                        className="inline-block bg-white text-emerald-500 font-semibold px-8 py-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    >
                        View Open Positions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Company;