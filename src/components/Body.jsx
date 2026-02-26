import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';


const Body = () => {
  
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const showSearch = ["/results", "/dashboard"];
  const shouldShowSearch = showSearch.includes(location.pathname);
  // if(location.pathname==='/chat') setIsMobileMenuOpen(true);
  const isChat = location.pathname === '/chat';


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // return (
  //   <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-blue-100">
  //     <Sidebar 
  //       isMobileMenuOpen={isMobileMenuOpen}
  //       setIsMobileMenuOpen={setIsMobileMenuOpen}
  //     />
      
  //     <main className="flex-1 md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
  //       {
  //         shouldShowSearch?(
  //           <div className="max-w-6xl mx-auto p-4 md:p-10 pt-20 md:pt-10">
  //             <SearchBar text={location.pathname==='/dashboard'?"Recommended":'Search Reasults'} />
  //             <Outlet />
  //           </div>
  //         ):(<Outlet />)
  //       }

  //     </main>
  //   </div>
  // )

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 selection:bg-blue-100">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      {
        isChat?(<Outlet />):
        (
          <main className="flex-1 md:ml-64 transition-all duration-300 min-h-screen flex flex-col">
            {
              shouldShowSearch ? (
                <div className="w-full flex-1 max-w-6xl mx-auto p-4 md:p-10 pt-20 md:pt-10">
                  <SearchBar text={location.pathname==='/dashboard'?"Recommended":'Search Results'} />
                  <Outlet />
                </div>
              ) : (
                <div className="w-full flex-1">
                  <Outlet />
                </div>
              )
            }
          </main>
        )
      }

    </div>
  )
}

export default Body
