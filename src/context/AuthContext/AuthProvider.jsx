import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import AuthContext from './AuthContext';
import auth from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);


const singInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
}

const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
}
const authInfo = {
    user,
    loading,
    singInWithGoogle,
    signOutUser
}
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
    });
    return () => {
        unsubscribe();
    }
});

  return (
    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider