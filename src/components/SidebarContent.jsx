// import React, { useState } from 'react';
import { 
  Home, Users, MessageSquare, Briefcase, Menu, X, ArrowRightLeft, LogOut
} from 'lucide-react';
import { NavLink, useLocation, MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setFailure } from '../utils/userSlice';

// 1. Inner component containing the actual sidebar logic
const SidebarContent = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const dispatch=useDispatch();
    const location = useLocation();
    const isChat = location.pathname.split('/').includes('chat');

    const menuItems = [
        { id: '/dashboard', icon: Home, label: 'Dashboard' },
        { id: '/requests', icon: ArrowRightLeft, label: 'My Requests' },
        { id: '/chat', icon: MessageSquare, label: 'Messages' },
        { id: '/mentors', icon: Users, label: 'Find Mentors' },
        { id: '/profile', icon: Briefcase, label: 'Profile' },
    ];

    const handleNavClick = () => {
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    const handleLogOut=()=>{
        axios.post(
        'http://localhost:7777/auth/logOut',
        {},
        { withCredentials: true }
        ).then((res)=>{
            console.log(res);
            dispatch(setFailure());
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return (
        <>
        {/* Mobile Top Bar - Hidden on /chat so it doesn't overlap the chat header */}
        {!isChat && (
            <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-blue-600 text-xl tracking-tight">ElevateU</span>
                <button 
                    onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        )}

        {/* FLOATING MENU BUTTON - Appears ONLY on /chat when the sidebar is hidden */}
        {isChat && !isMobileMenuOpen && (
            <button
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
                className="fixed bottom-6 left-6 z-40 p-4 bg-blue-600 text-white shadow-xl shadow-slate-900/20 rounded-full hover:bg-slate-800 hover:scale-110 transition-all flex items-center justify-center animate-in fade-in zoom-in duration-300"
                title="Open Menu"
            >
                <Menu size={24} />
            </button>
        )}

        {/* Backdrop for Menu - Also used on desktop when Chat is active */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
            />
        )}

        {/* Sidebar Content (Desktop + Drawer) */}
        <div className={`
            fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col w-64
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            ${!isChat ? 'md:translate-x-0' : ''}
        `}>
            <div className="p-6 flex items-center justify-between text-blue-600 font-bold text-2xl border-b border-slate-100/50">
                <span className="tracking-tight">ElevateU</span>
                <button 
                    onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
                    className={`p-1 text-slate-400 hover:text-slate-600 ${!isChat ? 'md:hidden' : ''}`}
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex flex-col gap-1.5 p-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.id}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                        isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`
                    }
                >
                    <item.icon size={19} />
                    {item.label}
                </NavLink>
            ))}
            </div>
            
            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 w-full font-bold transition-all text-sm" onClick={handleLogOut}>
                    <LogOut size={19} />
                    Logout
                </button>
            </div>
        </div>
        </>
    )
}


export default SidebarContent