import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
// const Body = () => {
//   return (
//     <div className='bg-gray-300'>
//         <NavBar />
//         <Outlet />
//     </div>
//   )
// }


const Body = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
         <Outlet />
      </main>
    </div>
  )
}

export default Body