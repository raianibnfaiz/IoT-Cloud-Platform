import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../../context/AuthContext/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import templateImage from "../../assets/image/template.jpeg";
import { motion } from "framer-motion";
import { Timer } from "three/examples/jsm/Addons.js";
import { API_ENDPOINTS } from "../../config/apiEndpoints";
import NotificationPopup from "./NotificationPopup";

const Dashboard = () => {
  const token = sessionStorage.getItem("authToken");
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const { signOutUser } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(-1);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPhoto, setUserPhoto] = useState("");
  const [userInitial, setUserInitial] = useState("U");
  const [imageError, setImageError] = useState(false);
   // Add these new state variables for the notification popup
   const [showNotification, setShowNotification] = useState(false);
   const [newTemplateInfo, setNewTemplateInfo] = useState({
     templateId: '',
     templateName: '',
     authToken: ''
   });

  // Function to get user's initial letter for fallback avatar
  const getUserInitial = (name) => {
    if (!name || name === "") return "U";
    return name.charAt(0).toUpperCase();
  };

  // Handle image loading error
  const handleImageError = () => {
    console.error("Failed to load profile image");
    setImageError(true);
  };

  // Get user data from session storage
  useEffect(() => {
    const storedName = sessionStorage.getItem('username');
    const storedPhoto = sessionStorage.getItem('userPhoto');

    if (storedName) {
      const cleanName = storedName.replace(/^"|"$/g, "");
      setUserInitial(getUserInitial(cleanName));
    }

    if (storedPhoto) {
      try {
        // Try to parse the photo URL from JSON if it's stored that way
        const parsedPhoto = storedPhoto.replace(/^"|"$/g, "");
        console.log("Profile image URL:", parsedPhoto);
        setUserPhoto(parsedPhoto);
      } catch (error) {
        console.error("Error processing user photo:", error);
      }
    }
  }, []);

  // Sample template data
  const [templates, setTemplates] = useState([]);

  // Fetch templates function
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.TEMPLATES,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTemplates(response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching templates:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const confirmDelete = (template_id) => {
    setTemplateToDelete(template_id);
    setShowDeleteModal(true);
  };
  const handleDelete = async (template_id) => {
    try {
      const response = await fetch(
        API_ENDPOINTS.TEMPLATE_DETAILS(template_id),
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log(`Template ${template_id} deleted successfully`);
        setTemplates((prevTemplates) =>
          prevTemplates.filter(
            (template) => template.template_id !== template_id
          )
        );
      } else {
        console.error("Failed to delete the template");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const closeDropdown = () => {
    setDropdownOpen(-1);
  };
  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        console.log("successful sign out");
      })
      .catch(() => {
        console.log("failed to sign out. stay here. don't leave me alone");
      });
  };

  const handleTemplateNameChange = (e) => {
    setTemplateName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        API_ENDPOINTS.TEMPLATES,
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
      
      // Set the new template data for the notification popup
      // Note: Adjust these fields according to your actual API response structure
      setNewTemplateInfo({
        templateId: data.template.template_id || generateTemplateId(), // Use actual ID or generate a placeholder
        templateName: data.template.template_name,
        authToken: data.template.auth_token || generateAuthToken() // Use actual token or generate a placeholder
      });
      
      // Show the notification
      setShowNotification(true);
      
      // Update templates list
      setTemplates([...templates, data.template]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      handleCloseModal();
      fetchTemplates();
    }
  };
  
  // Helper functions to generate values if not provided by API
  const generateTemplateId = () => {
    return `TMPL${Math.random().toString(36).substring(2, 8)}${Math.random().toString(36).substring(2, 8)}`;
  };
  
  const generateAuthToken = () => {
    return `${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
  };
  
  // Function to close the notification
  const handleCloseNotification = () => {
    setShowNotification(false);
  };


  const handleCloseModal = () => {
    const modal = document.getElementById("templateModal");
    modal.close();
    setTemplateName("");
  };
  const handleDeleteModal = () => {
    const modal = document.getElementById("deleteModal");
    modal.close();
    setShowDeleteModal(false);
  }

  const handleOpenModal = () => {
    const modal = document.getElementById("templateModal");
    modal.showModal();
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

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) {
      setNotificationsOpen(false);
    }
  };

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

  console.log(templates);
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="min-h-screen bg-gray-900 transition-colors duration-200">
        {/* Top Navigation Bar */}
        <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold">
                    BJIT
                  </div>
                  <span className="ml-2 text-lg font-semibold text-white hidden sm:block">
                    Cloud.Console
                  </span>
                </div>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="ml-4 p-1 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
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
                          : "M4 6h16M4 12h10M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center">
                <div className="hidden sm:block px-3 py-1 rounded-full bg-emerald-900 text-emerald-200 text-xs font-medium mr-4">
                  Messages used: 11 of 30k
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 relative"
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
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-800"></span>
                    )}
                  </button>

                  {/* User Profile Dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-1 px-2 py-1 rounded-full hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none"
                    >
                      {/* Profile Picture */}
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center overflow-hidden">
                        {userPhoto && !imageError ? (
                          <img 
                            src={userPhoto}
                            alt={sessionStorage.getItem("username")?.replace(/"/g, "") || "User"} 
                            className="h-full w-full object-cover"
                            onError={handleImageError}
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">{userInitial}</span>
                        )}
                      </div>
                      
                      {/* Magnificent animated dropdown icon */}
                      <div className="relative h-4 w-4 ml-1 cursor-pointer">
                        {/* Background glow effect */}
                        <div className={`absolute inset-0 rounded-full ${userMenuOpen ? 'bg-blue-500/20 animate-pulse' : ''}`}></div>
                        
                        {/* Dropdown arrows - animated */}
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 text-gray-300 z-10 relative"
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <motion.path 
                            fillRule="evenodd" 
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                            clipRule="evenodd"
                            animate={{ rotate: userMenuOpen ? 180 : 0, y: userMenuOpen ? 1 : 0 }}
                            transition={{ 
                              duration: 0.3, 
                              type: "spring",
                              stiffness: 260, 
                              damping: 20 
                            }}
                            style={{ 
                              transformOrigin: "center",
                              fill: userMenuOpen ? "#60A5FA" : "#9CA3AF"
                            }}
                          />
                        </svg>
                        
                        {/* Decorative dots that appear on hover/active */}
                        <div className={`absolute ${userMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 left-5 -top-0.5`}>
                          <div className="h-1 w-1 rounded-full bg-blue-400 animate-pulse "></div>
                        </div>
                        <div className={`absolute ${userMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 right-5 bottom-0`}>
                          <div className="h-1 w-1 rounded-full bg-indigo-400 animate-pulse delay-150"></div>
                        </div>
                      </div>
                    </button>

                    {/* Dropdown Menu */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 cursor-pointer bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                        <div className="px-4 py-3 border-b border-gray-700">
                          <p className="text-sm text-white font-medium">
                            {sessionStorage.getItem("username")?.replace(/"/g, "") || "User"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {sessionStorage.getItem("userEmail")?.replace(/"/g, "") || "user@example.com"}
                          </p>
                        </div>

                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          Settings
                        </Link>
                        <div className="border-t border-gray-700"></div>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm cursor-pointer text-red-400 hover:bg-gray-700"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Panel */}
          {notificationsOpen && (
            <div className="absolute right-4 mt-2 w-80 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-4 py-2 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">
                  Notifications
                </h3>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-2 hover:bg-gray-700 ${!notification.read ? "bg-gray-700" : ""
                      }`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-300">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="flex">
          {/* Sidebar Navigation */}
          <div
            className={`${sidebarCollapsed ? "w-16" : "w-64"
              } min-h-screen bg-gray-800 transition-all duration-300 fixed left-0 z-30 md:relative`}
          >
            <div className="p-4">
              <div className="space-y-1">
                <Link to="/">
                  <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-700 text-white">
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
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    {!sidebarCollapsed && <span className="ml-3">Home</span>}
                  </div>
                </Link>
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 00-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
          <div className={`flex-1 p-4 sm:p-6 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} md:ml-0`}>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">
                Templates
              </h1>
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="w-full sm:max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
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
                      className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Search Templates"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleOpenModal}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-md shadow-sm hover:bg-emerald-700 flex items-center justify-center"
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

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 border-4 border-emerald-600/30 rounded-full"></div>
                  <motion.div 
                    className="absolute inset-0 border-t-4 border-emerald-600 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5, 
                      ease: "linear"
                    }}
                  ></motion.div>
                </div>
                <p className="text-emerald-500 mt-4 text-lg">Loading templates...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template._id}
                    className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Link
                      to={`/template/${template.template_id}`}
                      className="block p-6"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-16 mb-4">
                          <img
                            src={
                              templateImage
                            }
                            alt={template.template_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {template.template_name}
                        </h3>
                        <span className="px-2 py-1 bg-emerald-900 text-emerald-200 text-xs rounded-full">
                          {template.widget_list.length} {template.widget_list.length === 1 ? "Widget" : "Widgets"}
                        </span>
                      </div>
                    </Link>
                    <div className="px-6 py-2 bg-gray-700 border-t border-gray-600 flex justify-between rounded-b-lg">
                      <Link
                        to={`/playground/${template.template_id}`}
                        className="text-xs text-gray-300 hover:text-emerald-400"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-xs text-gray-300 hover:text-red-400"
                        onClick={() => {
                          confirmDelete(template.template_id);
                          closeDropdown();
                        }}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                ))}
                {/* Deletion Confirmation Modal */}
                {showDeleteModal && (
                  <dialog id ='deleteModal'  open className="modal">
                    <div className="modal-box w-1/4 max-w-sm rounded-lg">
                      <h2 className="text-2xl mb-6 font-bold text-center">
                        Confirm Deletion
                      </h2>
                      <p className="mb-4">
                        Are you sure you want to delete this template?
                      </p>
                      <div className="flex justify-end mt-6">
                        <button
                          className="btn w-1/2 p-2 mx-1 ml-2 text-red-500 border-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                          onClick={() => handleDelete(templateToDelete)}
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteModal}
                          className="btn w-1/2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 mx-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </dialog>
                )}

                {/* Add New Template Card */}
                <div
                  onClick={handleOpenModal}
                  className="border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center h-64 hover:border-emerald-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="text-center p-6">
                    <div className="mx-auto h-12 w-12 text-gray-400">
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
                    <p className="mt-2 text-sm text-gray-400">
                      Create new template
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Modal */}
      <dialog id="templateModal" className="modal">
        <div className="modal-box w-11/12 max-w-sm bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl mb-6 font-bold text-white text-center">
            Create a Template
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Template Name"
              value={templateName}
              onChange={handleTemplateNameChange}
              className="w-full mb-4 p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <button
              type="submit"
              className="w-full p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Creating..." : "Add"}
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="w-full mt-4 p-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
          </form>
        </div>
      </dialog>

      {/* Notification popup */}
      {showNotification && (
        <NotificationPopup
          templateId={newTemplateInfo.templateId}
          templateName={newTemplateInfo.templateName}
          authToken={token}
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default Dashboard;
