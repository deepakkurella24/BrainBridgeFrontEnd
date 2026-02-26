
import { Check, Clock, UserCheck, X } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../utils/utilities';
const ReceivedReqCard = ({req,onSend}) => {

  const navigate=useNavigate()
  // console.log(req);
  return (
  <div className="p-6 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/50 transition-colors group">
    
    <div className="relative shrink-0" onClick={()=>navigate(`/view/${req._id}`)} >
      <img 
        src={req.profileURL} 
        alt={req.name} 
        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" 
      />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-white rounded-full"></div>
    </div>
    
    {/* Info */}
    <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
      <h3 className="font-bold text-slate-800 text-lg leading-tight" onClick={()=>navigate(`/view/${req._id}`)} >{req.name}</h3>
      <p className="text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-1">{req.role}</p>
      
      {/* Context/Match Info */}
      <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-medium">
         <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
           <UserCheck size={11} /> 
            <span className="truncate" title={`Matched: ${req.matches?.join(', ')}`}>
              Match: {!req.matches.length?'none':<span className="text-slate-600 font-semibold">{req.matches?.join(', ')}</span>}
            </span>
         </span>
         <span className="flex items-center gap-1">
           <Clock size={11} /> {timeAgo(req.time)}
         </span>
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
      <button className="flex-1 sm:flex-none p-3 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all active:scale-95" title="Reject" onClick={()=>onSend("rejected",req._id)} >
        <X size={20} />
      </button>
      <button className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95" onClick={()=>onSend("accepted",req._id)} >
        <Check size={18} strokeWidth={3} />
        <span>Accept</span>
      </button>
    </div>
  </div>
  )
}

export default ReceivedReqCard