
import { 
  Users, Edit,  Plus,
  Quote,
  LayoutGrid
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
  const [loading,setLoading]=useState(true)
  // State to track which project's collaborator modal is open
//   const [showCollaboratorsFor, setShowCollaboratorsFor] = useState(null);/project/user/:id
  const user=useSelector((store)=>store.userState.user);
  const [projects,setProjects]=useState([])
  const navigate=useNavigate();

  const removeProject=(id)=>{
    const resProjects=projects.filter((project)=>project._id!==id);
    setProjects(resProjects)
  }


  useEffect(()=>{
    axios.get(`http://localhost:7777/project/user/${user._id}`,{withCredentials:true})
    .then((res)=>{
      setLoading(false)
      setProjects(res.data.data.reverse())
    })
    
  },[user]);

  

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
              
              <div className="flex gap-3 w-full sm:w-auto">

                <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                onClick={()=>navigate('/profile-edit')}
                >
                  <Edit size={18}  />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-base sm:text-lg text-slate-700 mt-1">{user.role}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-slate-500">

                <span className="flex items-center gap-1.5 text-blue-600 font-medium hover:underline cursor-pointer"
                onClick={()=>navigate('/requests')}
                >
                  <Users size={16} />connections
                </span>

              </div>
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
            <h2 className="text-xl font-bold text-slate-900">My Projects</h2>
            <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors" onClick={()=>navigate('/add-project-form')} >
                <Plus size={16} /> Add Project
            </button>
          </div>

          {
            loading?(
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl transition-all hover:bg-slate-50">
                <span className="loading loading-spinner loading-xl"></span>
              </div>
            ):(
              projects.length?(
                <div className="space-y-6">
                  {projects.map((project) => (
                    //card
                    <ProjectCard key={project.id} project={project} user={project.createdBy} userId={user._id} isMyProfile={true} removeProject={removeProject} />
                  ))}
                </div>
              ):(
                  <div className="flex flex-col items-center justify-center py-12 px-4 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl transition-all hover:bg-slate-50">
                    
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 text-slate-400">
                      {<LayoutGrid size={28} strokeWidth={1.5} /> }
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-800 text-center">
                      { "Showcase your work" }
                    </h3>
                    
                    <p className="text-sm text-slate-500 text-center max-w-sm mt-2 leading-relaxed">
                      "Upload your best projects, case studies, or code repositories to share with your network."
                    </p>

                
                    <button className="mt-6 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:text-blue-600 hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-2 active:scale-95"  onClick={()=>navigate('/add-project-form')}  >
                      <Plus size={18} />
                      Add Your First Project
                    </button>
                    
                    
                  </div>
              )
            )
          }
        </div>

      </div>
    </div>
  );
};

export default MyProfile;