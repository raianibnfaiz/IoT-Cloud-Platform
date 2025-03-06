import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ComingSoon = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
            <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                        <svg 
                            className="w-12 h-12 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                    </div>
                </motion.div>

                <motion.h1 
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Coming Soon
                </motion.h1>

                <motion.p 
                    className="text-slate-400 text-lg mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    The page <span className="text-emerald-400 font-semibold">{path}</span> is under construction.
                    <br />
                    We're working hard to bring you something amazing!
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                >
                    <Link 
                        to="/"
                        className="inline-block bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold px-8 py-4 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Return Home
                    </Link>
                    
                    <p className="text-slate-500 text-sm mt-8">
                        Want to be notified when this feature is ready?{' '}
                        <Link to="/contact" className="text-emerald-400 hover:text-emerald-300 underline">
                            Contact us
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ComingSoon;