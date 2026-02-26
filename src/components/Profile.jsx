import { 
  Users, Edit,  Plus,
  Quote,
  UserPlus,
  Clock,
  X,
  Check,
  UserCheck,
  MessageSquare,
  FolderOpen,
  Store
} from 'lucide-react';

// import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';



const Profile = () => {
  const id=useSelector((store)=>store.userState.user._id);
  const [loading,setLoading]=useState(true)
  const [loading2,setLoading2]=useState(true);
  const {id:userId} = useParams();
  // const [userId,setUserId]=useState(id)

  const [user, setUser] = useState({
    offered: [],
    wanted: []
  });
  const [projects,setProjects]=useState([])
  const navigate=useNavigate();
  // console.log(userId)
  if(id===userId){
    navigate('/profile');
  }
   function handleSendSwapReq(id){
    // setShowReq(!show)
    axios.post(`http://localhost:7777/request/send/${id}`,{},{withCredentials:true})
    .then((res)=>{
      console.log(res.data.message)

      updateTo('sent');
    })  
    .catch((err)=>{
      console.log(err);
    })


  }


  function updateTo(status){
    setUser({...user,status})
  }

  function handleCancle(id){
 
    // setShowReq(!show)
    axios.post(`http://localhost:7777/request/cancel/${id}`,{},{withCredentials:true})
    .then((res)=>{
      console.log(res.data.message)

      updateTo('none')

    })
    .catch((err)=>{
      console.log(err);
    })
  }

  function handleReview(id,status,requestId){
    // console.log(requestId,'requestId');
    console.log(requestId)
    axios.post(`http://localhost:7777/request/review/${status}/${requestId}`,{},{withCredentials:true})
    .then((res)=>{
      // removeRecieved(requestId)
      console.log(res.data);
      updateTo(status==='rejected'?'none':'accepted')
    })
    .catch((err)=>console.log(err.data));
  }



  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    axios.get(`http://localhost:7777/view/${userId}`,{withCredentials:true})
    .then((res)=>{
      setUser(res.data.data);
      setLoading(false)
    })
    axios.get(`http://localhost:7777/project/user/${userId}`,{withCredentials:true})
    .then((res)=>{
      setProjects(res.data.data.reverse())
      setLoading2(false)
    })
  },[userId]);
  
  if (loading)<span className="loading loading-spinner loading-xl"></span>
  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-slate-900 pb-12 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* 1. Header Card (My Profile Style) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-100 to-slate-200 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          </div>
          
          <div className="px-6 sm:px-8 pb-8 relative">
            {/* Avatar & Actions Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-12 sm:-mt-16 mb-4 gap-4">
              <div className="relative group cursor-pointer">
                <img 
                  src={user.profileURL} 
                  alt={user.name} 
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white object-cover shadow-md transition-all group-hover:brightness-90"
                />

              </div>
              
              {/* <div className="flex gap-3 w-full sm:w-auto">

                <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                onClick={()=>navigate('/profile-edit')}
                >
                  <Edit size={18}  />
                  connect
                </button>
              </div> */}
              <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                
                {/* STATE: NONE */}
                {user.status === 'none' && (
                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200 active:scale-95" onClick={()=>handleSendSwapReq(user._id)} >
                        <UserPlus size={18} />
                        Connect
                    </button>
                )}

                {/* STATE: SENT */}
                {user.status === 'sent' && (
                    <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-500 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2 group active:scale-95" onClick={()=>handleCancle(user._id)} >
                        <Clock size={18} className="group-hover:hidden" />
                        <X size={18} className="hidden group-hover:block" />
                        <span className="group-hover:hidden">Request Sent</span>
                        <span className="hidden group-hover:block">Cancel Request</span>
                    </button>
                )}

                {/* STATE: RECEIVED */}
                {user.status === 'received' && (
                    <>
                        <button className="flex-1 sm:flex-none p-2.5 px-4 sm:px-2.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center active:scale-95" title="Reject"
                         onClick={()=>handleReview(user._id,'rejected',user.reqId)} 
                        >
                            <X size={20} />
                            <span className="sm:hidden ml-2 font-bold text-sm">Reject</span>
                        </button>
                        <button className="flex-[2] sm:flex-none px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200 active:scale-95"
                        onClick={()=>handleReview(user._id,'accepted',user.reqId)} 
                        >
                            <Check size={18} strokeWidth={3} />
                            Accept
                        </button>
                    </>
                )}

                {/* STATE: ACCEPTED (CONNECTED) */}
                {user.status === 'accepted' && (
                    <>
                        <button className="p-2.5 px-4 sm:px-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center gap-2 cursor-default font-bold text-sm">
                            <UserCheck size={18} />
                            <span className="hidden sm:inline">Connected</span>
                        </button>
                        <button className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200 active:scale-95">
                            <MessageSquare size={18} />
                            Message
                        </button>
                    </>
                )}

              </div>
            </div>

            {/* User Info */}
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-base sm:text-lg text-slate-700 mt-1">{user.role}</p>
              
              {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">

                <span className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={()=>navigate('/requests')}
                >
                  <Users size={16} />connections
                </span>

              </div> */}
            </div>
          </div>
        </div>

        {/* 2. About Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6 relative group">

          <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line pr-8">
            {user.about}
          </p>
        </div>

        {/* 3. Skills Exchange Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6 relative group">

          <h2 className="text-xl font-bold text-slate-900 mb-6">Skills Exchange</h2>
          
          <div className="grid sm:grid-cols-2 gap-8 pr-8">
            {/* Offered */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Offerd Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.offered.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Wanted */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> Wanted Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.wanted.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-sm font-medium rounded-lg border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className='my-2 mt-8' >
            <div className="flex items-center gap-1.5 mb-1.5">
              <Quote size={12} className="text-blue-500 fill-blue-500 opacity-50" />
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.15em] font-extrabold">Goal Of Learning</p>
            </div>
            <p className="text-[13px] text-slate-700 font-bold leading-relaxed italic line-clamp-2">
              "{user.goal}"
            </p>
          </div>
        </div>

        {/* 4. My Projects (LinkedIn Post Style) */}
        <div className="mb-6">

          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-bold text-slate-900">Projects</h2>
            {/* <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors" onClick={()=>navigate('/add-project-form')} >
                <Plus size={16} /> Add Project
            </button> */}
          </div>

          {/* <div className="space-y-6">
            {projects.map((project) => (
              //card
              <ProjectCard key={project.id} project={project} user={project.createdBy} />
            ))}
          </div> */}
          {
            loading2?(
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl transition-all hover:bg-slate-50">
                <span className="loading loading-spinner loading-xl"></span>
              </div>
            ):(
              projects.length?(
                <div className="space-y-6">
                  {projects.map((project) => (
                    //card
                    <ProjectCard key={project.id} project={project} user={project.createdBy} userId={id}  />
                  ))}
                </div>
              ):(
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl transition-all hover:bg-slate-50">
                  
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-400">
                    {<FolderOpen size={28} strokeWidth={1.5} />}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-800 text-center">
                    { "No projects yet"}
                  </h3>
                  
                  <p className="text-sm text-slate-500 text-center max-w-sm mt-2 leading-relaxed">
                    {
                       "This user hasn't added any projects to their portfolio yet. Check back later!"
                    }
                  </p>
                </div>
              )
            )
          }
        </div>

      </div>
    </div>
  );
};

export default Profile;