import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext/AuthContext";
const Navbar = () => {
  // State for tracking hover on dropdown menus
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, signOutUser } = useContext(AuthContext);

  // Handle mouse enter for dropdown
  const handleMouseEnter = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  // Handle mouse leave for dropdown
  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-gray-800 shadow-sm py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="h-15 w-15 bg-purple-800 rounded-md flex items-center justify-center mr-2">
              <span className="text-white text-2xl font-bold">BJIT</span>
            </div>
            <span className="text-green-500 text-2xl font-bold">
              Cloud Platform
            </span>
          </Link>
        </div>

        {/* Main Menu */}
        <div className="hidden md:flex items-center space-x-1">
          {/* Features Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleMouseEnter("features")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-4 py-2 text-black-700 hover:text-black-900 flex items-center">
              <span>Features</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "features" && (
              <div className="absolute left-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10 p-4">
                <div className="py-2">
                  <h3 className="text-lg font-medium">Feature Options</h3>
                  <p className="text-sm text-black-500">Explore our features</p>
                </div>
                <div className="py-2">
                  <Link
                    to="/features/option1"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Feature Option 1
                  </Link>
                  <Link
                    to="/features/option2"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Feature Option 2
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Enterprise Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleMouseEnter("enterprise")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-4 py-2 text-black-700 hover:text-black-900 flex items-center">
              <span>Enterprise</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "enterprise" && (
              <div className="absolute left-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10 p-4">
                <div className="py-2">
                  <h3 className="text-lg font-medium">Enterprise Solutions</h3>
                  <p className="text-sm text-black-500">
                    Business solutions for IoT
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    to="/enterprise/solutions"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Enterprise Solutions
                  </Link>
                  <Link
                    to="/enterprise/pricing"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Enterprise Pricing
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Developers Dropdown - Matching the screenshot */}
          <div
            className="relative group"
            onMouseEnter={() => handleMouseEnter("developers")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-4 py-2 text-black-700 hover:text-black-900 flex items-center">
              <span>Developers</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "developers" && (
              <div className="absolute left-0 mt-2 w-96 bg-white border rounded-md shadow-lg z-10 p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium">Developer Resources</h3>
                    <p className="text-sm text-black-500">
                      Everything to help you get started and build your IoT
                      device.
                    </p>

                    <div className="mt-4">
                      <h3 className="text-lg font-medium">Tech Support</h3>
                      <p className="text-sm text-black-500">
                        Get the best Blynk experience with our team of experts.
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Documentation</h3>
                    <p className="text-sm text-black-500">
                      Detailed guides for every feature of Blynk IoT platform.
                    </p>

                    <div className="mt-4">
                      <h3 className="text-lg font-medium">Featured Hardware</h3>
                      <p className="text-sm text-black-500">
                        Compatible dev boardings with firmware examples and
                        blueprints.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-blue-100 p-3 rounded-md text-center">
                  <Link
                    to="/developer-hub"
                    className="text-blue-600 font-medium flex items-center justify-center"
                  >
                    Developer Hub
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Case Studies Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleMouseEnter("caseStudies")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-4 py-2 text-black-700 hover:text-black-900 flex items-center">
              <span>Case Studies</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "caseStudies" && (
              <div className="absolute left-0 mt-2 w-64 bg-white border rounded-md shadow-lg z-10 p-4">
                <div className="py-2">
                  <h3 className="text-lg font-medium">Success Stories</h3>
                  <p className="text-sm text-black-500">
                    See how others use Blynk
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    to="/case-studies/industry"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Industry Examples
                  </Link>
                  <Link
                    to="/case-studies/solutions"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Solution Examples
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Company Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => handleMouseEnter("company")}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-4 py-2 text-black-700 hover:text-black-900 flex items-center">
              <span>Company</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {activeDropdown === "company" && (
              <div className="absolute left-0 mt-2 w-64 bg-gray border rounded-md shadow-lg z-10 p-4">
                <div className="py-2">
                  <h3 className="text-lg font-medium">About Us</h3>
                  <p className="text-sm text-black-500">
                    Learn more about Blynk
                  </p>
                </div>
                <div className="py-2">
                  <Link
                    to="/company/about"
                    className="block px-4 py-2 text-sm text-white-700 hover:bg-black-100"
                  >
                    About Blynk
                  </Link>
                  <Link
                    to="/company/careers"
                    className="block px-4 py-2 text-sm text-white-700 hover:bg-gray-100"
                  >
                    Careers
                  </Link>
                  <Link
                    to="/company/contact"
                    className="block px-4 py-2 text-sm text-black-700 hover:bg-gray-100"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <Link
            to="/pricing"
            className="px-4 py-2 text-black-700 hover:text-black-900"
          >
            Pricing
          </Link>
        </div>

        {/* Right Section - CTA Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/contact-sales"
            className="px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
          >
            Contact Sales
          </Link>

          {/* {user ? (
            <>
              <Link to="/billing">
                <button className="btn">Billing</button>
              </Link>
              <Link to="/profile">
                <button className="btn">Profile</button>
              </Link>
              <button onClick={handleSignOut} className="btn">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <a className="btn">Sign Up</a>
              </Link>
              <Link to="/login">
                <button className="">
                  <a className="btn btn-primary">Contact Sales</a>
                </button>
              </Link>
            </>
          )} */}
          {user ? (
            <>
              <Link to="/profile" className="btn btn-primary">
                Profile
              </Link>
              <button onClick={signOutUser} className="btn btn-secondary">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
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
