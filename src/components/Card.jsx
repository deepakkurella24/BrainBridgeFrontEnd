import axios from 'axios'
import { Check, Clock, Quote, UserCheck, UserPlus, X } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { setShowReqButton } from '../utils/feedSlice'
import { useNavigate } from 'react-router-dom';
const Card = ({u,parent,updateTo}) => {
  // const [showSwapReq,setShowReq]=useState(true)
   const dispatch=useDispatch();
   const navigate=useNavigate()
   console.log(u._id)
   function handleSendSwapReq(id){
    // setShowReq(!show)
    axios.post(`http://192.168.137.1:7777/request/send/${id}`,{},{withCredentials:true})
    .then((res)=>{
      console.log(res.data.message)
      // setShowReq(false);
      if(parent==='dashboard'){
        dispatch(setShowReqButton({id,bool:'sent'}));
        return;
      }
      updateTo(id,'sent');
    })  
    .catch((err)=>{
      console.log(err);
    })
  }

  function handleCancle(id){
 
    // setShowReq(!show)
    axios.post(`http://192.168.137.1:7777/request/cancel/${id}`,{},{withCredentials:true})
    .then((res)=>{
      console.log(res.data.message)
      // setShowReq(true);
      if(parent==='dashboard'){
        dispatch(setShowReqButton({id,bool:'none'}));
        return;
      }
      updateTo(id,'none')

    })
    .catch((err)=>{
      console.log(err);
    })
  }

  function handleReview(id,status,requestId){
    // console.log(requestId,'requestId');
    console.log(requestId)
    axios.post(`http://192.168.137.1:7777/request/review/${status}/${requestId}`,{},{withCredentials:true})
    .then((res)=>{
      // removeRecieved(requestId)
      console.log(res.data);
      updateTo(id,status==='rejected'?'none':'accepted')
    })
    .catch((err)=>console.log(err.data));
  }


  return (
    <div  className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5 text-left" onClick={()=>navigate(`/view/${u._id}`)} >
        <div className="relative">
          <img src={u.profileURL} alt={u.name} className="w-16 h-16 rounded-[1.5rem] object-cover border-2 border-slate-50 shadow-sm" />
          {/* <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div> */}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg leading-tight">{u.name}</h3>
          <p className="text-[11px] text-blue-600 uppercase tracking-widest font-bold mt-0.5">{u.role}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-4 mb-6 text-left">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Offers</p>
          <div className="flex flex-wrap gap-1.5">
            {u.offered.map(s => <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-100/50">{s}</span>)}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-widest">Wants</p>
          <div className="flex flex-wrap gap-1.5">
            {u.wanted.map(s => <span key={s} className="px-3 py-1 bg-slate-50 text-slate-600 text-[11px] font-bold rounded-lg border border-slate-100">{s}</span>)}
          </div>
        </div>
      </div>

      {/* Goal of Learning - Aligned & Structured */}
      <div className="flex-1 text-left bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 mb-6">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Quote size={12} className="text-blue-500 fill-blue-500 opacity-50" />
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-extrabold">Goal Of Learning</p>
        </div>
        <p className="text-[13px] text-slate-700 font-bold leading-relaxed italic line-clamp-2">
          "{u.goal}"
        </p>
      </div>

      {/* Action */}



      {/* {u.status === "none" && <button>Swap Request</button>}
      {u.status === "sent" && <button>Cancel Request</button>}
      {u.status === "received" && (
        <>
          <button>Accept</button>
          <button>Reject</button>
        </>
      )}   6996ad80bd3ad28986b40d8b
      {u.status === "accepted" && <button disabled>Connected</button>} */}


      <div className="mt-auto pt-2">
        {u.status === "none" && (
          <button className="w-full py-4 text-white rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group-hover:shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
          onClick={()=>handleSendSwapReq(u._id)}
          >
            <UserPlus size={18}  />
            Request Swap
          </button>
        )}
        
        {u.status === "sent" && (
          <button className="w-full py-4 text-slate-500 rounded-2xl font-bold text-sm bg-white border-2 border-slate-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn" onClick={()=>handleCancle(u._id)} >
            <Clock size={18} className="group-hover/btn:hidden" />
            <X size={18} className="hidden group-hover/btn:block" />
            <span className="group-hover/btn:hidden">Request Sent</span>
            <span className="hidden group-hover/btn:block">Cancel Request</span>
          </button>
        )}

        {u.status === "received" && (
          <div className="flex gap-3">
            <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all active:scale-95 flex items-center justify-center" title="Reject" onClick={()=>handleReview(u._id,'rejected',u.requestId)} >
              <X size={20} />
            </button>
            <button className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            onClick={()=>handleReview(u._id,'accepted',u.requestId)}
            >
              <Check size={18} strokeWidth={3} />
              <span>Accept</span>
            </button>
          </div>
        )}

        {u.status === "accepted" && (
          <button disabled className="w-full py-4 text-emerald-600 rounded-2xl font-bold text-sm bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-2 cursor-default">
            <UserCheck size={18} />
            Connected
          </button>
        )}
      </div>



    </div>
  )
}

export default Card



      // {
      //   u.showReqButton?(
      //     <button className="w-full py-4 text-white rounded-2xl font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 group-hover:shadow-blue-200 active:scale-95" onClick={()=>handleSendSwapReq(u._id)} >
      //       Request Swap
      //     </button>
      //   ):(
      //     <button
      //       onClick={() => handleCancle(u._id)}
      //       className="
      //         w-full py-4 rounded-2xl font-bold text-sm
      //         bg-red-50 text-red-600
      //         border border-red-100
      //         hover:bg-red-100 hover:text-red-700 hover:border-red-200
      //         transition-all duration-200
      //         shadow-sm hover:shadow-md
      //         active:scale-95
      //         flex items-center justify-center gap-2
      //       "
      //     >
      //       <X size={16} className="stroke-[2.5]" />
      //       Cancel Request
      //     </button>

      //   )
      // }