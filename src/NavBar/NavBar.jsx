import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext/AuthContext";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, signOutUser } = useContext(AuthContext);

  // List of dropdown menu items for scalability
  const menuItems = [
    { name: "Features", path: "/features" },
    { name: "Enterprise", path: "/enterprise" },
    { name: "Developers", path: "/dashboard" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Company", path: "/company" },
  ];

  return (
    <nav className="bg-gray-800 shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-15 w-15 bg-purple-800 rounded-md flex items-center justify-center mr-2">
              <span className="text-white text-2xl font-bold">BJIT</span>
            </div>
            <span className="text-green-500 text-2xl font-bold">Cloud Platform</span>
          </Link>
        </div>

        {/* Main Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Dynamic Dropdowns */}
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="px-4 py-2 text-white hover:text-gray-300 flex items-center">
                <span>{item.name}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu (Now Even Closer) */}
              {activeDropdown === item.name && (
                <div
                  className="absolute top-[100%] left-0 w-48 bg-white border rounded-md shadow-lg z-10 p-1"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="py-1">
                    <Link to={`${item.path}/`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      {item.name} Zone
                    </Link>

                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pricing Link */}
          <Link to="/pricing" className="px-4 py-2 text-white hover:text-gray-300">
            Pricing
          </Link>
        </div>

        {/* Right Section - CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/contact-sales" className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-700">
            Contact
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Profile
              </Link>
              <button
                onClick={signOutUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition-colors duration-200"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition-colors duration-200"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
