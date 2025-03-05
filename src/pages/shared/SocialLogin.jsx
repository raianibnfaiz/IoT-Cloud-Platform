import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const { singInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/"; // Redirect location after login

    const handleGoogleSignIn = async () => {
        try {
            await singInWithGoogle();
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Error during Google sign-in:", error.message);
        }
    }

    return (
        <div className='m-4'>
            <div className="divider">OR</div>
            <div className="flex justify-center">
                <button 
                    onClick={handleGoogleSignIn} 
                    className='btn flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out'
                >
                    <FaGoogle />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
};

export default SocialLogin;