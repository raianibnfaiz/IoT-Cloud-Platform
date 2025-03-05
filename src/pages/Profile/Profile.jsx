import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext/AuthContext";
import { MdOutlineDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
    const { user, logOut, signOutUser } = useContext(AuthContext);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const username = sessionStorage.getItem("username")?.replace(/"/g, "") || "Guest";
    const userEmail = sessionStorage.getItem("userEmail")?.replace(/"/g, "") || "No email available";
    const user_id = sessionStorage.getItem("user_id") || "N/A";
    const photoURL = sessionStorage.getItem("userPhoto");
    const [darkMode, setDarkMode] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
      const userMenuRef = useRef(null);
    const token = sessionStorage.getItem("authToken");
    const navigate = useNavigate();

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
     // Function to toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    // Close notifications panel if open
    if (notificationsOpen) {
      setNotificationsOpen(false);
    }
  };
    // Toggle dark mode and save preference
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        // Save preference to localStorage
        localStorage.setItem("darkMode", !darkMode);
    };
      // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((note) => ({ ...note, read: true })));
  };

    // Ensure the photoURL is properly decoded and valid
    const newPhotoURL = photoURL && photoURL !== "null" ? decodeURIComponent(photoURL.replace(/"/g, "")) : null;

    console.log("User Data ->", user_id, username, userEmail, newPhotoURL, token);

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                console.log("Successful sign out");
                sessionStorage.clear(); // Clear session storage after logout
                navigate("/"); // Redirect to homepage
            })
            .catch((error) => {
                console.log("Failed to sign out:", error);
            });
    };

    return (
        <div>
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
                                                    Raian Ahmed
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    raian@example.com
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
                                            <Link to="/settings"><a

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
                                                    Settings
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
            <div className="flex justify-center items-center h-screen bg-gray-900">

                <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                    <div className="flex flex-col items-center mb-6">
                        {newPhotoURL ? (
                            <img
                                src={newPhotoURL}
                                alt="User Profile"
                                className="w-24 h-24 rounded-full mb-4 border border-gray-500 object-cover"
                                onError={(e) => (e.target.style.display = "none")} // Hide image if it fails to load
                            />
                        ) : (
                            <FaUserCircle className="text-gray-400 text-6xl mb-4" />
                        )}
                        <h2 className="text-2xl font-bold text-white">{username}</h2>
                        <p className="text-gray-300">{userEmail}</p>
                    </div>
                    <div className="mb-4">
                        <h3 className="text-lg text-center font-semibold text-gray-200">Profile Summary</h3>
                        <div className="border-t border-gray-600 pt-2">
                            <p className="py-1 text-center text-gray-300">
                                Membership: <span className="font-semibold">Premium</span>
                            </p>
                            <p className="py-1 text-center text-gray-300">
                                Join Date: <span className="font-semibold">2025-02-25</span>
                            </p>
                            <p className="py-1 text-center text-gray-300">
                                User ID: <span className="font-semibold">{user_id}</span>
                            </p>
                        </div>
                    </div>
                    <Link to="/dashboard" className="w-full">
                        <button className="mt-4 bg-green-600 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out w-full flex items-center justify-center cursor-pointer">
                            <MdOutlineDashboard className="mr-2" />
                            My Dashboard
                        </button>
                    </Link>

                    <button
                        className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out w-full"
                        onClick={handleSignOut}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
