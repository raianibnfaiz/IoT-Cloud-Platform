import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext/AuthContext';
import { MdOutlineDashboard } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';

const Profile = () => {
    const { user, logOut, signOutUser } = useContext(AuthContext);
    const username = sessionStorage.getItem('username');
    const userEmail = sessionStorage.getItem('userEmail');
    const user_id = sessionStorage.getItem('user_id');
    const photoURL = sessionStorage.getItem('userPhoto');
    const token = sessionStorage.getItem('authToken');
    const newPhotoURL = photoURL ? photoURL.replace(/"/g, '') : null;
    const navigate = useNavigate();
    
    console.log("User Data ->", user_id, username, userEmail, newPhotoURL, token);
    
    const handleLogout = () => {
        logOut(); // Call the logOut function from context
        navigate('/'); // Redirect to homepage after logout
    };

    const handleSignOut = () => {
        signOutUser()
            .then(() => {
                console.log("Successful sign out");
            })
            .catch((error) => {
                console.log("Failed to sign out. Stay here. Don't leave me alone");
            });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex flex-col items-center mb-6">
                    {newPhotoURL ? (
                        <img src={newPhotoURL} alt="User Profile" className="w-24 h-24 rounded-full mb-4" />
                    ) : (
                        <div className="text-gray-400 text-6xl mb-4">
                            <FaUserCircle />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-white">{username?.replace(/"/g, '') || 'Guest'}</h2>
                    <p className="text-gray-300">{userEmail?.replace(/"/g, '') || 'No email available'}</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg text-center font-semibold text-gray-200">Profile Summary</h3>
                    <div className="border-t border-gray-600 pt-2">
                        <p className="py-1 text-center text-gray-300">Membership: <span className="font-semibold">Premium</span></p>
                        <p className="py-1 text-center text-gray-300">Join Date: <span className="font-semibold">2025-02-25</span></p>
                        <p className="py-1 text-center text-gray-300">User ID: <span className="font-semibold">{user_id ? user_id : 'N/A'}</span></p>
                    </div>
                </div>
                <Link to="/developer" className="w-full">
                    <button className="mt-4 bg-green-400 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out w-full flex items-center justify-center">
                        <MdOutlineDashboard className="mr-2" />
                        My Templates
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
    );
};

export default Profile;