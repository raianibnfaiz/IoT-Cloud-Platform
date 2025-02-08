import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
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
        
        <Link to="/about" className="text-lg"><li><a>About</a></li></Link>
      </ul>
    </div>
    <a className="btn btn-ghost text-xl">IoT Cloud Platform</a>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <Link to="/" className="text-lg"><li><a>Home</a></li></Link>
    
      <Link to="/about" className="text-lg"><li><a>About</a></li></Link>
    </ul>
  </div>
  <div className="navbar-end">
  <Link to="/register"><a className="btn">Register</a></Link>
  <Link to="/login"><a className="btn">Login</a></Link>
  </div>
</div>
    </div>
  )
}

export default NavBar