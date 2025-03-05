import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdEdit } from "react-icons/md";
import { FaUserCircle, FaKey } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import AuthContext from "../../context/AuthContext/AuthContext";

const Profile = () => {
  const { signOutUser } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // User data from session storage
  const username = sessionStorage.getItem("username")?.replace(/"/g, "") || "Guest";
  const userEmail = sessionStorage.getItem("userEmail")?.replace(/"/g, "") || "No email available";
  const user_id = sessionStorage.getItem("user_id") || "N/A";
  const photoURL = sessionStorage.getItem("userPhoto");
  const role = "Admin"; // In your app, you might want to get this from session storage
  
  // Format user initials from username
  const getUserInitials = () => {
    if (!username || username === "Guest") return "G";
    return username.charAt(0).toUpperCase();
  };
  
  // Handle sign out
  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("Successful sign out");
        sessionStorage.clear();
        navigate("/");
      })
      .catch((error) => {
        console.log("Failed to sign out:", error);
      });
  };
  
  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Navigation */}
      <nav className="bg-slate-800 px-6 py-4 flex justify-between items-center border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
            RA
          </div>
          <span className="text-xl font-semibold">Cloud.Console</span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <BiDotsVerticalRounded className="text-xl" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-slate-800 ring-1 ring-slate-700 z-50">
              <Link to="/edit-profile" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                <MdEdit className="mr-2" />
                Edit
              </Link>
              <Link to="/reset-password" className="flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">
                <FaKey className="mr-2" />
                Reset Password
              </Link>
              <Link to="/delete-account" className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-slate-700">
                <RiDeleteBin6Line className="mr-2" />
                Delete Account
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Profile Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-4xl font-bold">
              {getUserInitials()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{username}</h1>
              <p className="text-slate-400">{userEmail}</p>
            </div>
          </div>
          
          {/* User Details */}
          <div className="border-t border-slate-700 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-slate-400 mb-1">ROLE</h3>
                <p className="text-blue-400 font-semibold">{role}</p>
              </div>
              
              <div>
                <h3 className="text-slate-400 mb-1">LAST LOGIN</h3>
                <p>1:10 AM Today</p>
              </div>
              
              <div>
                <h3 className="text-slate-400 mb-1">REGISTRATION DATE</h3>
                <p>10:29 AM Feb 4, 2025</p>
              </div>
              
              <div>
                <h3 className="text-slate-400 mb-1">COUNTRY</h3>
                <p>Bangladesh</p>
              </div>
              
              <div>
                <h3 className="text-slate-400 mb-1">TIMEZONE</h3>
                <p>Asia/Dhaka</p>
              </div>
              
              <div>
                <h3 className="text-slate-400 mb-1">LOCALE</h3>
                <p>EN</p>
              </div>
            </div>
          </div>
          
          {/* Developer Mode */}
          <div className="border-t border-slate-700 px-6 py-4">
            <div className="bg-slate-900/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Developer Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-slate-400 text-sm">
                You have access to Developer features. To learn more visit{" "}
                <a href="https://blynk.io/en/developers" className="text-blue-400 hover:underline">
                  blynk.io/en/developers
                </a>
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="border-t border-slate-700 px-6 py-4 flex flex-col md:flex-row gap-4">
            <Link to="/dashboard" className="flex-1">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded transition duration-300 flex items-center justify-center">
                <MdOutlineDashboard className="mr-2 text-xl" />
                My Dashboard
              </button>
            </Link>
            
            <button
              onClick={handleSignOut}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded transition duration-300 flex items-center justify-center"
            >
              <FiLogOut className="mr-2 text-xl" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;