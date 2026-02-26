import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReceivedReqCard from './ReceivedReqCard';
import SentReqCard from './SentReqCard';
import ConnectedCard from './ConnectedCard';
import { ShieldAlert } from 'lucide-react';
import ShimmerRequestCard from './ShimmerReqCard';

const EmptyState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
        <ShieldAlert size={40} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">{message}</p>
    </div>
);


const MyRequests = () => {
  const [activeTab, setActiveTab] = useState('connected');
  const [received,setReceived]=useState([]);
  const [sent,setSent]=useState([]);
  const [connected,setConnected]=useState([]);
  const [recLoading,setRecLoading]=useState(true);
  const [sentLoading,setSentLoading]=useState(true);
  const [conLoading,setConLoading]=useState(true);

  function handleCancle(id){ 
    axios.post(`http://localhost:7777/request/cancel/${id}`, {}, {withCredentials:true})
      .then((res)=>{
        console.log(res.data.message);
        remove(id);
      })
      .catch((err)=>{
        console.log(err);
      });
  }

  function remove(id){
    setSent(prev =>
      prev.filter(user =>{
        // console.log(id)
        // console.log(user.toUserId._id)
        return id !== user.toUserId._id
      })
    );
  }


  function handleSend(status,requestId){
    // console.log(requestId,'requestId');
    axios.post(`http://localhost:7777/request/review/${status}/${requestId}`,{},{withCredentials:true})
    .then((res)=>{
      removeRecieved(requestId)
      console.log(res.data);
    })
    .catch((err)=>console.log(err.data));
  }

  function removeRecieved(id){
    setReceived(prev=>{
      return prev.filter(user =>{
        // console.log(id,'func para')
        // console.log(user._id,'user id');
        // console.log(id !== user._id);
        return id !== user._id;
      })
    })
  }

  function removeCon(id){
    setConnected(prev=>{
      return prev.filter(user =>{
        // console.log(id,'func para')
        // console.log(user._id,'user id');
        // console.log(id !== user._id);
        return id !== user._id;
      })
     })
  }

  // function handleRemoveConnection(id){

  // }

  useEffect(()=>{
    if(activeTab==='received'){
      // setLoading(true);
      axios.get('http://localhost:7777/user/requests',{withCredentials:true})
      .then((res)=>{
        setReceived(res.data.data);
        setRecLoading(false);
        setConLoading(true);
        setSentLoading(true);
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    else if(activeTab==='sent'){
      // setLoading(true);
      axios.get('http://localhost:7777/user/sent',{withCredentials:true})
      .then((res)=>{
        setSent(res.data.data);
        setRecLoading(true);
        setConLoading(true);
        setSentLoading(false);
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    else{
      axios.get('http://localhost:7777/user/connections',{withCredentials:true})
      .then((res)=>{
        // setLoading(false);
        setConnected(res.data.data);
        setRecLoading(true);
        setConLoading(false);
        setSentLoading(true);
      })
      .catch((err)=>{
        console.log(err);
      })
    }
  },[activeTab])


  return (
    <div className="max-w-4xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
      
      {/* Sticky Header Section */}
      <div className="sticky top-14 md:top-0 z-30 bg-slate-50 pt-6 md:pt-10 px-4 md:px-8 pb-2 shadow-[0_1px_0_0_rgba(241,245,249,1)]">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Network Requests</h1>
          <p className="text-slate-500 font-medium">Manage your collaboration invitations and connections.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {[
              { id: 'received', label: 'Received' },
              { id: 'sent', label: 'Sent'},
              { id: 'connected', label: 'Connections'}
          ].map((tab) => (
              <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id 
                      ? 'text-blue-600' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
              >
                  {tab.label}
                  {/* {tab.count !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                          {tab.count}
                      </span>
                  )} */}
                  {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
                  )}
              </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="px-4 pt-8 md:pt-0 md:px-8 pb-8 mt-6">
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          {activeTab === 'received' && 
            (recLoading?(
              <>
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
              </>
            ):(
              <div className="divide-y divide-slate-100">
                {received.map((req) =>{ 
                  console.log(req)
                  return (<ReceivedReqCard key={req._id} req={req} onSend={handleSend} />)
                })}
                {received.length === 0 && <EmptyState message="No pending requests." />}
              </div>
            )
          )}

          {activeTab === 'sent' && (
            sentLoading?(
              <>
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
              </>
            ):(
              <div className="divide-y divide-slate-100">
                {sent.map((req) =>{

                  return (
                  <SentReqCard key={req._id} req={req.toUserId} onCancel={handleCancle} />
                  )
                })}
                {sent.length === 0 && <EmptyState message="You haven't sent any requests." />}
              </div>
            )
          )}

          {activeTab === 'connected' &&(
            conLoading?(
              <>
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
                <ShimmerRequestCard />
              </>
            ):(
              <div className="divide-y divide-slate-100">
                {connected.map((user) =>{ 
                  console.log(user)
                  return (
                    <ConnectedCard key={user._id} user={user} remove={removeCon} />
                  )
                })}
                {connected.length === 0 && <EmptyState message="No active connections yet." />}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRequests