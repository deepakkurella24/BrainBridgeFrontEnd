import axios from 'axios';
import { MessageSquare, MoreVertical, UserX } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


    // "data": [
    //     {
    //         "_id": "69944709dd64b1661fe79829",
    //         "name": "deepak kurella",
    //         "profileURL": "https://geographyandyou.com/images/user-profile.png",
    //         "offered": [
    //             "react",
    //             "node",
    //             "express",
    //             "javascript"
    //         ],
    //         "wanted": [
    //             "python",
    //             "ai",
    //             "sql",
    //             "power bi"
    //         ],
    //         "role": "student"
    //     }
    // ]

const ConnectedCard = ({user,remove}) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate=useNavigate()
  function handleRemoveCon(id){
    
    axios.post(`http://localhost:7777/request/remove/${id}`, {}, {withCredentials:true})
    .then((res)=>{
      console.log(res.data.message);
      remove(id);
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
       <div className="flex items-center gap-4" onClick={()=>navigate(`/view/${user._id}`)} >
        <div className="relative">
          <img 
              src={user.profileURL} 
              alt={user.name} 
              className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm" 
          />
          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{user.name}</h3>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{user.role}</p>
        </div>
       </div>
       
       <div className="flex items-center gap-2">
         <button className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
         onClick={()=>navigate('/chat/'+user._id)}
         >
           <MessageSquare size={18} strokeWidth={2.5} />
         </button>
         
         <div className="relative">
           <button 
             onClick={() => setShowMenu(!showMenu)}
             className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
           >
             <MoreVertical size={18} />
           </button>

           {showMenu && (
             <>
               <div 
                 className="fixed inset-0 z-10" 
                 onClick={() => setShowMenu(false)}
               />
               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                 <button 
                   onClick={() =>{
                     setShowMenu(false);
                     handleRemoveCon(user._id);
                   }}
                   className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                   
                 >
                   <UserX size={16} strokeWidth={2.5} />
                   Remove connection
                 </button>
               </div>
             </>
           )}
         </div>
       </div>
    </div>
  );
}

export default ConnectedCard