import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
const Body = () => {
  return (
    <div className='bg-gray-300'>
        <NavBar />
        <Outlet />
    </div>
  )
}

export default Body