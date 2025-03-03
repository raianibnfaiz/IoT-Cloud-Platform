import React, { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // State for theme toggle
  const [darkMode, setDarkMode] = useState(false);
  const token = sessionStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const { user, signOutUser } = useContext(AuthContext);
  // State for sidebar collapse
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");

  // Sample template data
  const [templates, setTemplates] = useState([]);
  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("successful sign out");
      })
      .catch((error) => {
        console.log("failed to sign out. stay here. don't leave me alone");
      });
  };

  
  // Close menu when clicking outside
  const closeMenu = () => {
    setUserMenuOpen(false);
  };
  const handleTemplateNameChange = (e) => {
    setTemplateName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://cloud-platform-server-for-bjit.onrender.com/users/templates",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            template_name: templateName,
            widget_list: [],
          }),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to create the template."
        );
      }

      const data = await response.json();
      setTemplates([...templates, data.template]); // Add the new template to the state
      setMessage(
        `✅ Template created successfully: ${data.template.template_name}`
      );
    } catch (err) {
      console.error(err);
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
      handleCloseModal();

      // Display message for 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);

      fetchTemplates(); // Refresh the template list
    }
  };

  const handleCloseModal = () => {
    const modal = document.getElementById("templateModal");
    modal.close(); // Close the modal
    setTemplateName(""); // Clear input field
  };

  const handleOpenModal = () => {
    const modal = document.getElementById("templateModal");
    modal.showModal(); // Open the modal
  };

  // State for notification panel
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Template updated successfully",
      read: false,
      time: "5m ago",
    },
    { id: 2, message: "New device connected", read: false, time: "1h ago" },
    { id: 3, message: "System update available", read: true, time: "1d ago" },
  ]);

  // State for user dropdown menu
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Filter templates based on search query
  const filteredTemplates = templates.filter((template) =>
    template.template_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Save preference to localStorage
    localStorage.setItem("darkMode", !darkMode);
  };

  // Load dark mode preference on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);

    // Apply dark mode class to body
    if (savedMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "https://cloud-platform-server-for-bjit.onrender.com/users/templates",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
  };

  // Function to toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    // Close notifications panel if open
    if (notificationsOpen) {
      setNotificationsOpen(false);
    }
  };

  // Icon components
  const icons = {
    device: (className) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
        />
      </svg>
    ),
    home: (className) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    chart: (className) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  };
  console.log(templates);
  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        {/* Top Navigation Bar */}
        <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold">
                    BJIT
                  </div>
                  <span className="ml-2 text-lg font-semibold text-slate-800 dark:text-white transition-colors duration-200">
                    Cloud.Console
                  </span>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="ml-4 p-1 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        sidebarCollapsed
                          ? "M4 6h16M4 12h16M4 18h16"
                          : "M4 6h16M4 12h8M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs font-medium mr-4 transition-colors duration-200">
                  Messages used: 11 of 30k
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 relative"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.some((n) => !n.read) && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
                    )}
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {darkMode ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center focus:outline-none"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white cursor-pointer">
                        <span className="text-sm font-medium">R</span>
                      </div>
                      {/* Dropdown arrow */}
                      <svg
                        className="ml-1 h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={userMenuOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="relative" onMouseLeave={closeMenu}>
                      {/* User Profile Button */}
                      
                
                      {/* Dropdown Menu */}
                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200">
                          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                            <p className="text-sm text-slate-800 dark:text-white font-medium">
                              Raian Ahmed
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              raian@example.com
                            </p>
                          </div>
                          
                          {/* Profile */}
                          <Link
                            to="/profile"
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={closeMenu}
                          >
                            <div className="flex items-center">
                              <svg
                                className="mr-2 h-4 w-4 text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              
                                Profile
                              
                            </div>
                          </Link>
                          
                          {/* Settings */}
                          <Link
                            to="/settings"
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={closeMenu}
                          >
                            <div className="flex items-center">
                              <svg
                                className="mr-2 h-4 w-4 text-slate-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Settings
                            </div>
                          </Link>
                          
                          <div className="border-t border-slate-100 dark:border-slate-700"></div>
                          
                          {/* Sign out */}
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                          >
                            <div className="flex items-center">
                              <svg
                                className="mr-2 h-4 w-4 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Sign out
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Panel */}
          {notificationsOpen && (
            <div className="absolute right-4 mt-2 w-80 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-slate-800 dark:text-white">
                  Notifications
                </h3>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-500 hover:text-emerald-600"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${
                      !notification.read ? "bg-slate-50 dark:bg-slate-700" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm text-slate-800 dark:text-white">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700">
                <a
                  href="#"
                  className="text-xs text-center block text-emerald-500 hover:text-emerald-600"
                >
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </nav>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div
            className={`${
              sidebarCollapsed ? "w-16" : "w-64"
            } min-h-screen bg-slate-800 text-white transition-all duration-300`}
          >
            <div className="p-4">
              <div className="space-y-1">
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-slate-700 text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  {!sidebarCollapsed && (
                    <span className="ml-3">Dashboards</span>
                  )}
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <svg
                    className="h-5 w-5 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  {!sidebarCollapsed && (
                    <span className="ml-3">Developer Zone</span>
                  )}
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <svg
                    className="h-5 w-5 text-slate-400"
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
                  {!sidebarCollapsed && <span className="ml-3">Devices</span>}
                </a>
                <a
                  href="#"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  {!sidebarCollapsed && (
                    <span className="ml-3">Automations</span>
                  )}
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-200">
                Templates
              </h1>
              <div className="mt-4 flex justify-between items-center">
                <div className="w-full max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                      placeholder="Search Templates"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-md shadow-sm hover:bg-emerald-600 flex items-center transition-colors duration-200"
                >
                  <svg
                    className="h-5 w-5 mr-1"
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
                  New Template
                </button>
              </div>
            </div>
            {message && (
              <div
                className={`alert ${
                  message.startsWith("✅") ? "alert-success" : "alert-error"
                } mb-4`}
              >
                {message}
              </div>
            )}
            <dialog id="templateModal" className="modal">
              <div className="modal-box w-1/4 max-w-sm rounded-lg ">
                <h2 className="text-2xl mb-6 font-bold text-center">
                  Create a Template
                </h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Template Name"
                    value={templateName}
                    onChange={handleTemplateNameChange}
                    className="input w-full mb-4 p-2 border-b-2 border-gray-300 rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-success w-full p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn w-full mt-4 p-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </dialog>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                  No templates found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your search or create a new template.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template._id}
                    className="overflow-hidden bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Link
                      to={`/template/${template._id}`}
                      className="font-bold text-lg text-gray-300 hover:underline"
                    >
                      <div className="p-6 flex flex-col justify-center items-center">
                        <div className="h-16 w-16 mb-4 text-emerald-500">
                          <img
                            src={
                              template.widget_list.length > 0 &&
                              template.widget_list[0].widget_id &&
                              template.widget_list[0].widget_id.image
                                ? template.widget_list[0].widget_id.image
                                : "https://via.placeholder.com/64"
                            }
                            alt={template.template_name}
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <div className="mt-4 text-center">
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1 transition-colors duration-200">
                            {template.template_name}
                          </h3>
                          <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs rounded-full transition-colors duration-200">
                            {template.widget_list.length}{" "}
                            {template.widget_list.length === 1
                              ? "Widget"
                              : "Widgets"}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 py-2 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600 flex justify-between transition-colors duration-200">
                      <button className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200">
                        Edit
                      </button>
                      <button className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty Template Card (for adding new) */}
                <div
                  onClick={handleOpenModal}
                  className="overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center h-64 hover:border-emerald-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="text-center p-6">
                    <div className="mx-auto h-12 w-12 text-slate-400">
                      <svg
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
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      Create new template
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
