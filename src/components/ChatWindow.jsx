import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Send, Smile,ArrowLeft, MoreVertical, Edit3, Trash2, Users }from 'lucide-react';
import EmptyChatState from './EmptyChatState';
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { formatTime } from "../utils/utilities";
import EditGroupModal from "./EditGroupModel";



const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store) => store.userState.user);
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [activeContact, setActiveContact] = useState(null);

  const [showMenu, setShowMenu] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatId]);


  useEffect(() => {
    if (!chatId) return;
    axios.get(`http://localhost:7777/chat/details/${chatId}`, { withCredentials: true })
      .then((res) => setActiveContact(res.data.data))
      .catch((err) => console.error(err));
  }, [chatId]);


  useEffect(() => {
    if (!chatId || !user?._id) return;

    axios.get(`http://localhost:7777/chat/${chatId}`, { withCredentials: true })
      .then((res) => setMessages(res.data.data))
      .catch((err) => console.error(err));

    socket.emit("open_chat", { userId: user._id, withUserId: chatId });

    return () => {
      socket.emit("leave_chat", user._id);
    };
  }, [chatId, user?._id]);

useEffect(() => {
    const handleReceiveMessage = (msg) => {
        const formattedMsg = {
          id: msg._id || Date.now(),
          senderId: msg.senderId === user?._id ? 'me' : msg.senderId,
          senderName: msg.senderName, 
          senderAvatar: msg.senderAvatar, 
          text: msg.text,
          time: msg.createdAt
        };
        setMessages((prev) => [...prev, formattedMsg]);
      }
    

    socket.on("receive_message", handleReceiveMessage);
    
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [user?._id, chatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !user?._id || !chatId) return;
    if(activeContact.isGroup){
      socket.emit('send_group_message',{
        senderId:user._id,
        conversationId:chatId,
        text: inputText.trim(),
      })
    }
    else{
      socket.emit("send_message", {
        senderId: user._id,
        receiverId: activeContact.id, 
        text: inputText.trim(),
      });
    }

    setInputText("");
  };

  const handleUpdateGroup = (updatedData) => {
    console.log("Applying group updates locally:", updatedData);
    setActiveContact({ ...activeContact, name: updatedData.name, members: updatedData.members });
    // TODO: Actually save changes to your backend here
  };

  if (!activeContact) return <EmptyChatState />;

  return (
    <>
      <div className="flex flex-col h-full bg-[#F8FAFC]">
        {/* Chat Header */}
        <div className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/chat')}
              className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
            
            <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-slate-100 shadow-sm bg-slate-50 overflow-hidden">
              {activeContact.profileURL ? (
                  <img src={activeContact.profileURL} alt={activeContact.name} className="w-full h-full object-cover" />
              ) : activeContact.isGroup ? (
                  <Users className="text-slate-400" size={20} />
              ) : (
                  <span className="text-slate-500 font-bold">{activeContact.name?.charAt(0)}</span>
              )}
              
              {activeContact.online && !activeContact.isGroup && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{activeContact.name}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {activeContact.isGroup 
                  ? `Group Chat • ${activeContact.members?.length || activeContact.memberCount || 'Multiple'} members` 
                  : (activeContact.online ? 'Online now' : activeContact.role)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors hidden sm:block">
              <Phone size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors hidden sm:block">
              <Video size={18} />
            </button> */}
            
            {/* Header Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)} 
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 z-40 py-2 animate-in fade-in zoom-in-95 duration-200">
                    {activeContact.isGroup && (
                      <button 
                        onClick={() => { setShowMenu(false); setShowEditGroup(true); }} 
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center gap-2 border-b border-slate-100"
                      >
                        <Edit3 size={16} /> Edit Group
                      </button>
                    )}
                    <button 
                      onClick={() => setShowMenu(false)} 
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={16} /> {activeContact.isGroup ? "Leave Group" : "Delete Chat"}
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Smile size={32} className="text-blue-300" />
              </div>
              <p className="text-sm font-medium">Say hi to {activeContact.isGroup ? 'the group' : activeContact.name}!</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.senderId === 'me';
              const showAvatar = !isMe && (index === 0 || messages[index - 1].senderId !== msg.senderId);
              
              const avatarToUse = activeContact.isGroup 
                ? (msg.senderAvatar || 'https://geographyandyou.com/images/user-profile.png') 
                : (activeContact.profileURL || 'https://geographyandyou.com/images/user-profile.png');

              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  {!isMe && (
                    <div className="w-8 shrink-0 flex items-end">
                      {showAvatar && (
                        <img src={avatarToUse} alt="avatar" className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100" />
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    {!isMe && activeContact.isGroup && showAvatar && (
                        <span className="text-[10px] text-slate-400 font-bold ml-1 mb-1 block">
                            {msg.senderName || 'Member'}
                        </span>
                    )}
                    
                    <div className={`px-4 py-2.5 text-[15px] shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    </div>
                    <span className={`text-[10px] text-slate-400 mt-1 font-medium ${isMe ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.time)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0 pb-safe">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
            {/* <div className="flex gap-1 p-1">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0">
                <Paperclip size={20} />
              </button>
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0 hidden sm:block">
                <ImageIcon size={20} />
              </button>
            </div> */}
            
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Write a message..."
              className="flex-1 max-h-32 min-h-[44px] bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none py-3 px-2"
              rows={1}
            />

            <div className="flex gap-1 p-1">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors shrink-0 hidden sm:block">
                <Smile size={20} />
              </button>
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0
                  ${inputText.trim() ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                <Send size={18} className={inputText.trim() ? 'ml-0.5' : ''} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {showEditGroup && (
        <EditGroupModal 
          group={activeContact} 
          onClose={() => setShowEditGroup(false)} 
          onSave={handleUpdateGroup}
        />
      )}
    </>
  );
};

export default ChatWindow;