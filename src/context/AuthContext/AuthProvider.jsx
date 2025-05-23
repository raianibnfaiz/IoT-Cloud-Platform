import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import AuthContext from './AuthContext';
import auth from '../../firebase/firebase.init';
import { BASE_URL, API_ENDPOINTS } from '../../config/apiEndpoints';

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const singInWithGoogle = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        console.log("Google User:", idToken);
        const name = result.user.displayName;
        localStorage.setItem('username', JSON.stringify(name));
        localStorage.setItem('userEmail', JSON.stringify(result.user.email));
        localStorage.setItem('userPhoto', JSON.stringify(result.user.photoURL));
        
        // Store the token in session storage
       
        // Alternatively, you can store it in cookies
        // document.cookie = `authToken=${idToken}; path=/;`;

        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_email: result.user.email,
                auth_token: idToken
            }),
        });

        const data = await response.json();

        if (data.token) {
            console.log("Server Response Token:", data.token);
            setUser(data.user);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user_id', data.user.user_id);

            // Redirect to the dashboard
            window.location.href = '/dashboard';
            
        } else {
            throw new Error("Login failed: " + data.message);
        }

        setLoading(false);
    };

    const signOutUser = async () => {
        setLoading(true);
        await signOut(auth);
        setUser(null);
        setLoading(false);
        window.location.href = '/';
    };
    
    const authInfo = {
        user,
        loading,
        singInWithGoogle,
        signOutUser
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;