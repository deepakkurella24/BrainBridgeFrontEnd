import React from 'react'
// import { Home,ArrowRightLeft,MessageSquare,Users,Briefcase,X,Menu,Logout } from 'lucide-react';
import { 
  Home, Users, MessageSquare, Briefcase, Menu, X,ArrowRightLeft, LogOut
} from 'lucide-react';
import axios from 'axios';
import { setFailure } from '../utils/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ activePage, onNavigate, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'requests', icon: ArrowRightLeft, label: 'My Requests' },
        { id: 'chat', icon: MessageSquare, label: 'Messages' },
        { id: 'mentors', icon: Users, label: 'Find Mentors' },
        { id: 'profile', icon: Briefcase, label: 'Profile' },
    ];

    const handleNavClick = (id) => {
        onNavigate(id);
        setIsMobileMenuOpen(false); // Close menu on mobile after selection
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
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 w-full bg-white border-b border-slate-200 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
            <span className="font-bold text-blue-600 text-xl tracking-tight">SkillSwap</span>
            <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* Backdrop for Mobile Menu */}
        {isMobileMenuOpen && (
            <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Sidebar Content (Desktop + Mobile Drawer) */}
        <div className={`
            fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col w-64
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
        `}>
            <div className="p-6 flex items-center justify-between text-blue-600 font-bold text-2xl border-b border-slate-100/50">
            <span className="tracking-tight">SkillSwap</span>
            <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
                <X size={20} />
            </button>
            </div>

            <div className="flex flex-col gap-1.5 p-4 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
                <button
                key={item.id}
                onClick={() =>{
                    handleNavClick(item.id);
                    navigate(item.id);
                }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm ${
                    activePage === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
                >
                <item.icon size={19} />
                {item.label}
                </button>
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

export default Sidebar


