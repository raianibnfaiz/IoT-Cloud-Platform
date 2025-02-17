import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext/AuthContext';

import { FaGoogle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialLogin = () => {
    const { singInWithGoogle } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state || "/";
    const handleGoogleSignIn = () => {
        singInWithGoogle()
            .then(result => {
                console.log(result.user)
            })
            .catch(error => {
                console.log(error.message)
            })
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