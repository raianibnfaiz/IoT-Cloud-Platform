import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import AuthContext from './AuthContext';
import auth from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const singInWithGoogle = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        const name = result.user.displayName;
        sessionStorage.setItem('username', JSON.stringify(name));
        sessionStorage.setItem('userEmail', JSON.stringify(result.user.email));
        sessionStorage.setItem('userPhoto', JSON.stringify(result.user.photoURL));
        
        // Store the token in session storage
       
        // Alternatively, you can store it in cookies
        // document.cookie = `authToken=${idToken}; path=/;`;

        const response = await fetch("https://cloud-platform-server-for-bjit.onrender.com/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
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
            sessionStorage.setItem('authToken', data.token);
            sessionStorage.setItem('user_id', data.user.user_id);
           
            
        } else {
            throw new Error("Login failed: " + data.message);
        }

        setLoading(false);
    };

    const signOutUser = () => {
        setLoading(true);
        return signOut(auth);
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