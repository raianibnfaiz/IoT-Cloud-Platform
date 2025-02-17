import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext/AuthContext'
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({children}) => {
    const {user,loading} = useContext(AuthContext);
    const location = useLocation();
    console.log(location);
    if(loading){
        return <div><span className="loading loading-ring loading-lg"></span></div>
    }
    if(user){
        return children
    }
    return  <Navigate to="/register" state={location?.pathname || '/'}></Navigate>
}

export default PrivateRoute