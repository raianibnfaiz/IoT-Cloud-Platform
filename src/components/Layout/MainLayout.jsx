import React from 'react';
import Navbar from '../SharedLayoutComponents/NavBar';
import { motion } from 'framer-motion';
import Footer from '../SharedLayoutComponents/Footer';

const MainLayout = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Navbar />
      <motion.main
        className="flex-1"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
