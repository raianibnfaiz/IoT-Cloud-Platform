/* eslint-disable no-undef */
import  { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
    FaTags,
    FaIdBadge,
    FaCog,
    FaTrash,
    FaEdit,
    FaPlus,
} from "react-icons/fa";
import AddWidgetModal from "./AddWidgetModal";
import { API_ENDPOINTS } from "../../config/apiEndpoints";

const TemplateDetails = () => {
    const { templateId } = useParams();
    const [darkMode, setDarkMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [templateDetails, setTemplateDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [widgetsExpanded, setWidgetsExpanded] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const [templateName, setTemplateName] = useState("");
    // Add these state variables to your component
    const [availableWidgets, setAvailableWidgets] = useState([]);
    const [loadingWidgets, setLoadingWidgets] = useState(false);
    const [availableWidgetsExpanded, setAvailableWidgetsExpanded] =
        useState(true);
    const username = sessionStorage.getItem("username")?.replace(/"/g, "") || "Guest";
    const userEmail = sessionStorage.getItem("userEmail")?.replace(/"/g, "") || "No email available";
    const token = sessionStorage.getItem("authToken");

    // Add this function to fetch widgets from the server
    const fetchAvailableWidgets = async () => {
        setLoadingWidgets(true);
        try {
            const response = await fetch(
                API_ENDPOINTS.WIDGETS,
                {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setAvailableWidgets(data);
        } catch (error) {
            console.error("Failed to fetch available widgets:", error);
        } finally {
            setLoadingWidgets(false);
        }
    };

    // Call the function when the component mounts
    useEffect(() => {
        fetchAvailableWidgets();
    }, []);
    const handleTemplateNameChange = (e) => {
        setTemplateName(e.target.value);
    };
    // Sample notifications data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "Template updated successfully",
            read: false,
            time: "5m ago",
        },
        {
            id: 2,
            message: "New widget added to template",
            read: false,
            time: "1h ago",
        },
        { id: 3, message: "System update available", read: true, time: "1d ago" },
    ]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

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

    useEffect(() => {
        const fetchTemplateDetails = async () => {
            try {
                const response = await fetch(
                    API_ENDPOINTS.TEMPLATE_DETAILS(templateId),
                    {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );
                
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setTemplateDetails(data);
            } catch (error) {
                console.error("Failed to fetch template details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplateDetails();

        // Load dark mode preference on mount
        const savedMode = localStorage.getItem("darkMode") === "true";
        setDarkMode(savedMode);

        // Apply dark mode class to body
        if (savedMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [templateId, darkMode]);

    // Toggle dark mode and save preference
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // Save preference to localStorage
        localStorage.setItem("darkMode", !darkMode);
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

    // Display loading spinner while fetching data
    if (loading) {
        return (
            <div
                className={`min-h-screen flex justify-center items-center ${darkMode ? "dark bg-slate-900" : "bg-slate-50"
                    }`}
            >
                <div
                    className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full"
                    style={{
                        borderTopColor: "#10b981",
                        borderRightColor: "transparent",
                        borderBottomColor: "#10b981",
                        borderLeftColor: "transparent",
                    }}
                ></div>
            </div>
        );
    }

    // If templateDetails is not available, show a message
    if (!templateDetails) {
        return (
            <div
                className={`min-h-screen p-5 ${darkMode
                    ? "dark bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-800"
                    }`}
            >
                <h1 className="text-red-500 text-2xl font-bold">
                    Template not found or an error occurred.
                </h1>
                <Link
                    to="/"
                    className="mt-4 inline-block px-4 py-2 bg-emerald-500 text-white rounded-md"
                >
                    Return to Dashboard
                </Link>
            </div>
        );
    }
    // Open the add widget modal
    const handleOpenAddWidgetModal = () => {
        const modal = document.getElementById("addWidgetModal");
        if (modal) {
            modal.showModal();
        }
    };

    return (
        <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
                {/* Top Navigation Bar */}
                <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link
                                        to="/"
                                        className="h-10 w-10 rounded bg-emerald-500 flex items-center justify-center text-white font-bold"
                                    >
                                        BJIT
                                    </Link>
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
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200">
                                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                                                    <p className="text-sm text-slate-800 dark:text-white font-medium">
                                                        {username}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {userEmail}
                                                    </p>
                                                </div>
                                                <Link to="/profile"><a

                                                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                                                </a>
                                                </Link>
                                                <Link to="/"><a

                                                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                                                        Home
                                                    </div>
                                                </a>
                                                </Link>
                                                <div className="border-t border-slate-100 dark:border-slate-700"></div>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
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
                                                </a>
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
                                        className={`px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 ${!notification.read ? "bg-slate-50 dark:bg-slate-700" : ""
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
                <div className="flex">
                    <div
                        className={`${sidebarCollapsed ? "w-16" : "w-64"
                            } min-h-screen bg-slate-800 text-white transition-all duration-300 fixed left-0 top-16 z-10`}
                    >
                        <div className="p-4">
                            <div className="space-y-1">
                                <Link
                                    to="/"
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
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
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-10a1 1 0 00-1-1h-4.586a1 1 0 00-.707.293l-5 5a1 1 0 00-.293.707V19a1 1 0 001 1h2z"
                                        />
                                    </svg>
                                    {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
                                </Link>
                                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-slate-700 text-white cursor-pointer">
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
                                    {!sidebarCollapsed && <span className="ml-3"><Link to='/dashboard'>Templates</Link></span>}
                                </div>

                                {/* Only show Add Widgets when sidebar is expanded */}
                                {/* {!sidebarCollapsed && (
                                    <div className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">
                                        <div className="flex items-center">
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
                                            <span className="ml-3" onClick={handleOpenModal}>
                                                Add Widgets
                                            </span>
                                        </div>
                                    </div>
                                )} */}

                                {/* Widgets dropdown section */}
                                {/* <div className="space-y-1">
                                    <div
                                        className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                                        onClick={() => setWidgetsExpanded(!widgetsExpanded)}
                                    >
                                        <div className="flex items-center">
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
                                                    d="M4 6h16M4 12h8m-8 6h16"
                                                />
                                            </svg>
                                            {!sidebarCollapsed && (
                                                <span className="ml-3">Picked Widgets</span>
                                            )}
                                        </div>
                                        {!sidebarCollapsed &&
                                            (widgetsExpanded ? (
                                                <svg
                                                    className="h-3 w-3 text-slate-400"
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
                                            ) : (
                                                <svg
                                                    className="h-3 w-3 text-slate-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            ))}
                                    </div> */}

                                    {/* Widget list dropdown */}
                                    {/* {widgetsExpanded &&
                                        !sidebarCollapsed &&
                                        templateDetails.template.widget_list && (
                                            <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                                                {templateDetails.template.widget_list.map(
                                                    (widget, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                                                        >
                                                            <div className="h-4 w-4 mr-2 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                <span className="text-xs text-white">
                                                                    {index + 1}
                                                                </span>
                                                            </div>
                                                            <span className="truncate">
                                                                {widget.widget_id?.name ||
                                                                    `Widget ${index + 1}`}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )} */}
                                {/* </div> */}

                                <div className="space-y-1">
                                    <div
                                        className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                                        onClick={() =>
                                            setAvailableWidgetsExpanded(!availableWidgetsExpanded)
                                        }
                                    >
                                        <div className="flex items-center">
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
                                                <span className="ml-3">Available Widgets</span>
                                            )}
                                        </div>
                                        {!sidebarCollapsed &&
                                            (availableWidgetsExpanded ? (
                                                <svg
                                                    className="h-3 w-3 text-slate-400"
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
                                            ) : (
                                                <svg
                                                    className="h-3 w-3 text-slate-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            ))}
                                    </div>

                                    {/* Available Widgets list dropdown */}
                                    {availableWidgetsExpanded && !sidebarCollapsed && (
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 animate-fadeIn">
                                            {loadingWidgets ? (
                                                <div className="px-3 py-2 text-sm text-slate-400 flex items-center">
                                                    <svg
                                                        className="animate-spin h-4 w-4 mr-2 text-slate-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Loading widgets...
                                                </div>
                                            ) : availableWidgets && availableWidgets.length > 0 ? (
                                                availableWidgets.map((widget, index) => (
                                                    <div
                                                        key={widget.id || index}
                                                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                                                        title={widget.description || `Widget ${index + 1}`}
                                                    >
                                                        <div className="h-4 w-4 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <span className="text-xs text-white">
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <span className="truncate">
                                                            {widget.name || `Widget ${index + 1}`}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-3 py-2 text-sm text-slate-400 flex items-center">
                                                    <svg
                                                        className="h-4 w-4 mr-2 text-slate-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                    No widgets available
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer">
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
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    {!sidebarCollapsed && (
                                        <span className="ml-3">Automations</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div
                        className={`flex-1 p-6 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"
                            } pt-6`}
                    >
                        {/* Breadcrumb */}
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link
                                            to="/"
                                            className="inline-flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                            </svg>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg
                                                className="w-6 h-6 text-slate-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <Link
                                                to="/dashboard"
                                                className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                                            >
                                                Templates
                                            </Link>
                                        </div>
                                    </li>
                                    <li aria-current="page">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-6 h-6 text-slate-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                                                {templateDetails.template.template_name}
                                            </span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* Template Details Header */}
                        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 md:mb-0">
                                {templateDetails.template.template_name}
                            </h1>
                            <div className="flex items-center space-x-2">
                                <Link to={`/playground/${templateId}`}>
                                    <button className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-md text-slate-800 dark:text-white flex items-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                        <FaEdit className="mr-1" />
                                        <span>Edit</span>
                                    </button>
                                </Link>
                                <button className="px-3 py-2 bg-red-100 dark:bg-red-900 rounded-md text-red-800 dark:text-red-200 flex items-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                                    <FaTrash className="mr-1" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Template Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900 mr-4">
                                        <FaIdBadge className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Template ID
                                        </p>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                            {templateId}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
                                        <FaTags className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Widget Count
                                        </p>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                            {templateDetails.template.widget_list
                                                ? templateDetails.template.widget_list.length
                                                : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
                                        <FaCog className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Last Updated
                                        </p>
                                        <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                            {new Date(
                                                templateDetails.template.updated_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Template Details Section */}
                        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700 mb-6">
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
                                Template Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        Description
                                    </p>
                                    <p className="text-slate-800 dark:text-white">
                                        {templateDetails.template.template_description ||
                                            "No description available"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        Created By
                                    </p>
                                    <p className="text-slate-800 dark:text-white">{username}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        Created At
                                    </p>
                                    <p className="text-slate-800 dark:text-white">
                                        {new Date(
                                            templateDetails.template.created_at
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                                        Status
                                    </p>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Widgets List Section */}
                        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                            {/* <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                    Widgets
                                </h2>
                                <button
                                    onClick={handleOpenAddWidgetModal}
                                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center text-sm"
                                >
                                    <FaPlus className="mr-1" />
                                    <span>Add Widget</span>
                                </button>
                            </div> */}

                            {templateDetails?.template?.widget_list &&
                                templateDetails.template.widget_list.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                        <thead className="bg-slate-50 dark:bg-slate-700">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                                                >
                                                    Created
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                            {templateDetails.template.widget_list.map(
                                                (widget, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-slate-50 dark:hover:bg-slate-700"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                                {widget.widget_id?.name || "Unknown"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                {widget.widget_id?.type || "Unknown"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                                {widget.widget_id?.created_at
                                                                    ? new Date(
                                                                        widget.widget_id.created_at
                                                                    ).toLocaleDateString()
                                                                    : "N/A"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300">
                                                                    <FaEdit />
                                                                </button>
                                                                <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg
                                        className="mx-auto h-12 w-12 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">
                                        No widgets
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Get started by adding a new widget to this template.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            onClick={handleOpenAddWidgetModal}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center mx-auto"
                                        >
                                            <FaPlus className="mr-2" />
                                            <span>Add Widget</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Include the AddWidgetModal component */}
                            <AddWidgetModal
                                templateId={templateId}
                                templateDetails={templateDetails}
                                availableWidgets={availableWidgets}
                                token={token}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateDetails;
