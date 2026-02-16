import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
    const isLoggedIn=useSelector((store)=>store.userState.isLoggedIn)
    return isLoggedIn? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoutes


