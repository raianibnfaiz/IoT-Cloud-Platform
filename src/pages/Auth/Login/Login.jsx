import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SocialLogin from "../../shared/SocialLogin";
import MainLayout from "../../../components/Layout/MainLayout";
import AuthContext from "../../../context/AuthContext/AuthContext";

export const Login = () => {
  const { user, singInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await singInWithGoogle();
      // Successful login will update the user context and trigger the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (you can add toast notifications here)
    }
  };

  // If user is already logged in, don't render the login form
  if (user) {
    return null; // or a loading spinner
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gray-800 rounded-lg shadow border sm:max-w-md xl:p-0 border-gray-700"
        >
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-3xl font-extrabold text-white mb-7 md:text-2xl text-center">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white sm:text-sm"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-600 rounded bg-gray-700 focus:ring-3 focus:ring-blue-600"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</a>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign In
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <SocialLogin />
              </motion.div>
              <p className="text-sm font-light text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-emerald-500 hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};
