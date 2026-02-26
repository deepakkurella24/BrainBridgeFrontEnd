// import axios from 'axios';
import { X } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const SentReqCard = ({req,onCancel}) => {
  const navigate=useNavigate();
  // console.log(req);

  // function handleCancle(id){
  //   axios.post(`http://localhost:7777/request/cancel/${id}`,{},{withCredentials:true})
  //   .then((res)=>{
  //     console.log(res.data.message)
  //     remove(id);
      
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   })
  // }

  return (
  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
    <div className="flex items-center gap-4 w-full sm:w-auto" onClick={()=>navigate(`/view/${req._id}`)} >
      <img 
        src={req.profileURL} 
        alt={req.name} 
        className="w-12 h-12 rounded-2xl object-cover grayscale opacity-80 border border-slate-100" 
      />
      <div>
        <h3 className="font-bold text-slate-700">{req.name}</h3>
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">{req.role}</p>
      </div>
    </div>
    
    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
        <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-100">
            Pending
        </span>
        
        {/* Cancel Request Button */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all text-xs font-bold shadow-sm active:scale-95 group" onClick={()=>onCancel(req._id)} >
            <X size={14} className="group-hover:stroke-2" />
            Cancel
        </button>
    </div>
  </div>
  )
}

export default SentReqCard