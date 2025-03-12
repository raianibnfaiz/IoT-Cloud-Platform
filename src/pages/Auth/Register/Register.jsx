import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SocialLogin from "../../shared/SocialLogin";
import MainLayout from "../../../components/Layout/MainLayout";
import AuthContext from "../../../context/AuthContext/AuthContext";

export const Register = () => {
  // State for tracking form input values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { user, registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      // Handle password mismatch (you can add toast notifications here)
      console.error('Passwords do not match');
      return;
    }

    try {
      await registerUser(name, email, password);
      // Successful registration will log the user in and trigger the useEffect above
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (you can add toast notifications here)
    }
  };

  // If user is already logged in, don't render the registration form
  if (user) {
    return null; // or a loading spinner
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 py-8 px-4 shadow-xl rounded-lg sm:px-10"
          >
            <div className="text-center mb-3 mt-1">
              <h2 className="text-3xl font-extrabold text-white ">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Join us to start building your IoT solutions
              </p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-white">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-700 text-white sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-800 focus:ring-offset-gray-800 transition-colors duration-200"
                >
                  Create Account
                </button>
              </motion.div>
            </form>

            <div className="mt-6">


              <div className="mt-6">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <SocialLogin />
                </motion.div>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-emerald-500 hover:text-emerald-400 transition-colors duration-200">
                Sign in instead
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

