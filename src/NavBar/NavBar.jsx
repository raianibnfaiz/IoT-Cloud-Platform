import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext/AuthContext';

const NavBar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  
  console.log(user)
  const handleSignOut = () => {
    signOutUser()
        .then(() => {
            console.log('successful sign out')
        })
        .catch(error => {
            console.log('failed to sign out .stay here. dont leave me alone')
        })
}
  return (
    <div>
        <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={0}
        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <Link to="/" className="text-lg"><li><a>Home</a></li></Link>
        
      </ul>
    </div>
    <a className="btn btn-ghost text-2xl">BJIT IoT Cloud Platform</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <Link to="/" className="text-lg"><li><a>Home</a></li></Link>
      <li>
        <details>
          <summary className='text-lg '><button className='btn-accent'><a className="btn">Developers</a></button></summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
      
      <li>
        <details>
          <summary className='text-lg '><button className='btn-outline btn-accent '><a className="btn">Features</a></button></summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><a>Link 1</a></li>
            <li><a>Link 2</a></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
  <div className="navbar-end">
  {
                    user ? <>
                        <button onClick={handleSignOut} className="btn">Sign out</button>
                    </> :
                    <>
                      <Link to="/register"><a className="btn">Sign Up</a></Link>
                      <Link to="/login"><button className='btn-primary'><a className="btn">Contact Sales</a></button></Link>
                    </>
                }
  
  </div>
</div>
    </div>
  )
}

export default NavBar