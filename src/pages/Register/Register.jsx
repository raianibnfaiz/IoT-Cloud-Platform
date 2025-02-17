import React, { useEffect, useState } from 'react';
import SocialLogin from '../shared/SocialLogin';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext/AuthContext';
import auth from '../../firebase/firebase.init';

export const Register = () => {
  // State for tracking form input values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  console.log('in signIn page', location)
  let from = location.state?.from?.pathname || "/";
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const handleSignIn = e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    singInUser(email, password)
        .then(result => {
            console.log('sign in', result.user)
            navigate(from);
        })
        .catch(error => {
            console.log(error);
        })

}


  return (
    <div className='w-full max-w-md mx-auto border-2 p-4 rounded-lg mt-8'>
      <h1 className='text-center text-amber-50 mb-2'>Please Register</h1>
      <form className="flex flex-col items-center">
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Your Name</legend>
          <input 
            type="text" 
            className="input w-full" 
            placeholder="Type your name" 
            value={name}
            onChange={(e) => setName(e.target.value)} // Update state on input change
          />
          {!name && <p className="fieldset-label text-red-300">Required</p>}
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Your Email</legend>
          <input 
            type="text" 
            className="input w-full" 
            placeholder="Type your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state on input change
          />
          {!email && <p className="fieldset-label text-red-300">Required</p>}
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Password</legend>
          <input 
            type="password" 
            className="input w-full" 
            placeholder="Type password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update state on input change
          />
          {!password && <p className="fieldset-label text-red-300">Required</p>} 
        </fieldset>
        
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend">Confirm password</legend>
          <input 
            type="password" 
            className="input w-full" 
            placeholder="Confirm password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} // Update state on input change
          />
          {!confirmPassword && <p className="fieldset-label text-red-300">Required</p>} 
        </fieldset>
        
        <button className="btn btn-xs btn-success sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl mt-4">Register</button>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
}