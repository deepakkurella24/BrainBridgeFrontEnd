import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { Search, MoreVertical, Menu, Plus, Users } from 'lucide-react';
import axios from "axios";
import socket from "../utils/socket";
import { formatTime } from "../utils/utilities";
import CreateGroupModal from "./CreateGroupModal";

const ChatsSidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // 1. Wrap in useCallback so it maintains the same reference between renders
  const fetchSidebar = useCallback(async () => {
    try {
      const res = await axios.get("http://192.168.137.1:7777/chat/sidebar", { withCredentials: true });
      setChats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch sidebar", err);
    }
  }, []);

  useEffect(() => {
    fetchSidebar();
    
    socket.on("sidebar_update", fetchSidebar);
    
    // 2. Pass the exact function reference to .off()
    return () => socket.off("sidebar_update", fetchSidebar);
  }, [fetchSidebar]);

  const filteredContacts = chats.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col h-full bg-white border-r border-slate-100 z-10 w-full">
        <div className="p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Messages</h2>
            </div>
            <button 
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              onClick={() => setShowCreateGroup(true)}
            >
              <Plus size={22} strokeWidth={2.5} />
            </button> 
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <NavLink 
                key={contact.id}
                to={`/chat/${contact.id}`}
                className={({ isActive }) => `flex items-center gap-3 p-4 cursor-pointer transition-colors border-l-4 ${isActive ? 'bg-blue-50/50 border-blue-600' : 'border-transparent hover:bg-slate-50'}`}
              >
                <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-slate-100 shadow-sm bg-slate-50 overflow-hidden">
                  {contact.avatar ? (
                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                  ) : contact.isGroup ? (
                    <Users className="text-slate-400" size={24} />
                  ) : (
                    <span className="text-slate-500 font-bold">{contact.name?.charAt(0)}</span>
                  )}
                  
                  {contact.online && !contact.isGroup && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-slate-900 text-sm truncate pr-2 flex items-center gap-1">
                      {contact.isGroup && <Users size={12} className="text-slate-400" />}
                      {contact.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">{formatTime(contact.time)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-xs truncate ${contact.unread > 0 ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                      {contact.lastMessage || 'No messages yet'}
                    </p>
                    {contact.unread > 0 && (
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shrink-0">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-500">No conversations found.</div>
          )}
        </div>
      </div>
      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)} 
          onCreate={() => {
            fetchSidebar();
            setShowCreateGroup(false);
          }} 
        />
      )} 
    </>
  );
};

export default ChatsSidebar;