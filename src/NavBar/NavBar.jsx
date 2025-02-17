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
      
    </div>
    <a className="btn btn-ghost text-2xl tracking-wide">BJIT IoT Cloud Platform</a>
  </div>
  <div className="navbar-center hidden lg:flex">
  <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/" className="tooltip flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="text-sm mx-4">Home</span>
              </Link>
            </li>
            <li>
              <details className="relative">
                <summary className='text-lg '>
                  <button className=''><a className="btn btn-outline btn-primary">Developers</a></button>
                </summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details>
            </li>
            <li>
              <details className="relative">
                <summary className='text-lg '>
                  <button className=' '><a className="btn btn-outline btn-primary">Features</a></button>
                </summary>
                <ul className="bg-base-100 rounded-t-none p-2">
                  <li><a>Link 1</a></li>
                  <li><a>Link 2</a></li>
                </ul>
              </details>
            </li>
            <li>
              <details className="relative">
                <summary className='text-lg '>
                  <button className=' '><a className=" btn btn-outline btn-primary">Enterprise</a></button>
                </summary>
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
                      <Link to="/login"><button className=''><a className="btn btn-primary">Contact Sales</a></button></Link>
                    </>
                }
  
  </div>
</div>
    </div>
  )
}

export default NavBar