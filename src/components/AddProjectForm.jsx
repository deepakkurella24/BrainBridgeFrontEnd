import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Plus, Check, Image as ImageIcon, UploadCloud, 
  Building2, Link as LinkIcon, Github, Tag, FileText, Users 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCache } from '../utils/userSlice';


const Badge = ({ children, onRemove }) => (
  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 transition-all cursor-default animate-in fade-in zoom-in-95 duration-200">
    {children}
    <button type="button" onClick={onRemove} className="p-0.5 hover:bg-blue-200/50 rounded-full transition-colors ml-0.5">
      <X size={14} className="opacity-70 hover:opacity-100" strokeWidth={3} />
    </button>
  </span>
);

const CollabBadge = ({ user, onRemove }) => (
  <span className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-default animate-in fade-in zoom-in-95 duration-200">
    <img src={user.profileURL} alt={user.name} className="w-5 h-5 rounded-full object-cover bg-slate-200 shadow-sm" />
    {user.name}
    <button type="button" onClick={onRemove} className="p-0.5 hover:bg-slate-200 rounded-full transition-colors ml-0.5">
      <X size={14} className="opacity-70 hover:opacity-100" strokeWidth={3} />
    </button>
  </span>
);

// Mock database of users for the autocomplete dropdown
// const AVAILABLE_USERS = [
//   { id: '1', name: "Sarah Chen", img: "https://i.pravatar.cc/150?u=1" },
//   { id: '2', name: "Marcus Johnson", img: "https://i.pravatar.cc/150?u=2" },
//   { id: '3', name: "Priya Patel", img: "https://i.pravatar.cc/150?u=3" },
//   { id: '4', name: "David Kim", img: "https://i.pravatar.cc/150?u=4" },
//   { id: '5', name: "Elena Rodriguez", img: "https://i.pravatar.cc/150?u=5" },
//   { id: '6', name: "Alex Thompson", img: "https://i.pravatar.cc/150?u=11" },
// ];

export default function AddProjectForm() {
  // State Management
  // const [title, setTitle] = useState('');
  // const [role, setRole] = useState('');
  const [desc, setDesc] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading,setLoading]=useState(false)
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [saved,setSaved]=useState(false)
  const [collaborators, setCollaborators] = useState([]);
  const [resCollaborators,setResCollaborators]=useState([]);
  const [collabInput, setCollabInput] = useState('');
  const [showCollabSuggestions, setShowCollabSuggestions] = useState(false);
  const cache=useSelector((state)=>state.userState.cache)
  const [error, setError] = useState(null);
  const [suggestions,setSuggestions]=useState([])
  const fileInputRef = useRef(null);
  const navigate=useNavigate()
  const dispatch=useDispatch();
  // Handlers
  const handleImageClick = () => fileInputRef.current?.click();
  
  const onClose=()=>navigate('/profile')
  useEffect(()=>{
      const timeOut=setTimeout(()=>{
          if(cache[collabInput]){
              setSuggestions(cache[collabInput])
          }
          else{
            axios.get(`http://localhost:7777/user/search-suggestion?q=${collabInput}`,{withCredentials:true})
            .then((res)=>{
              const data=res.data.data;
              setSuggestions(data[1]);
              dispatch(setCache({[data[0]]:data[1]}))
              console.log(data)
            })
            .catch((err)=>{
                console.log(err);
            })
          }
      },200)

      return () => clearTimeout(timeOut);

      
  },[collabInput])

  const uploadImage = async (file) => {
    if (!file) return
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SkillSwap");
    formData.append('cloud_name', 'dpvhfjzjd')
    const res = await axios.post("https://api.cloudinary.com/v1_1/dpvhfjzjd/image/upload", formData);
    setLoading(false);
    return res.data.secure_url;
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    setImageUrl(url);
  };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const url = URL.createObjectURL(file);
//       setImageUrl(url);
//     }
//   };

  // Tech Stack Handlers
  const handleTechBlur = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
    }
    setTechInput('');
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTechBlur();
    }
  };

  const removeTech = (indexToRemove) => {
    setTechStack(techStack.filter((_, index) => index !== indexToRemove));
  };

  // Collaborators Handlers
  // const filteredCollabs = AVAILABLE_USERS.filter(u => 
  //   u.name.toLowerCase().includes(collabInput.toLowerCase()) && 
  //   !collaborators.some(c => c.id === u.id)
  // );

  const handleSelectCollab = (user) => {
    setCollaborators([...collaborators, user]);
    setResCollaborators([...collaborators, user._id]);
    setCollabInput('');
    setShowCollabSuggestions(false);
  };

  const handleCollabKeyDown = (e) => {
    // If they press Enter and there's an exact match in the filtered list, select the first one
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelectCollab(suggestions[0]);
      }
    }
  };

  const removeCollab = (indexToRemove) => {
    setCollaborators(collaborators.filter((_, index) => index !== indexToRemove));
    setResCollaborators(resCollaborators.filter((_,index)=> index !== indexToRemove))
  };

  // Save Handler
  const handleSave = (e) => {
    e.preventDefault();
    if ( !techStack.length || !desc.trim() || collaborators.length<=4 ) {
      setError("Description and techstack are required.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    setError(null);
    
    // const newProject = {
    //   title, role, desc, liveLink, githubLink, techStack, collaborators, imageUrl
    // };
    
    // console.log("Saving Project:", newProject);
    
    axios.post('http://localhost:7777/project',{
       description:desc, projectURL:liveLink, gitHubURL:githubLink, techStack, collaborators:resCollaborators, projectImgURL:imageUrl
    },{withCredentials:true})
    .then((res)=>{
        setSaved(true);
        console.log(res.data)
        if(onClose) setTimeout(() => onClose(), 4000);
    }).catch((err)=>{
        setError(err.data);
        setTimeout(() => setError(null), 3000);
    })
    
    
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 font-medium";

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC] p-4 sm:p-6 font-sans">
      
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden mt-10 md:mt-0">
        
        
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />

        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Add New Project</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Showcase your best work and collaborations.</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="relative z-10 space-y-6">
          
          {/* Image Upload Area */}


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Title */}
            {/* <div className="relative sm:col-span-2">
              <div className="absolute left-4 top-3.5 text-slate-400"><FileText size={18} /></div>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
                className={inputClass} placeholder="Project Title (e.g. SkillSwap Platform)"
              />
            </div> */}

            {/* Role */}
            {/* <div className="relative sm:col-span-2">
              <div className="absolute left-4 top-3.5 text-slate-400"><Building2 size={18} /></div>
              <input 
                type="text" value={role} onChange={(e) => setRole(e.target.value)} 
                className={inputClass} placeholder="Your Role (e.g. Lead Frontend Developer)"
              />
            </div> */}

            {/* Live Link */}
            <div className="relative sm:col-span-2">
              <textarea 
                value={desc} onChange={(e) => setDesc(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 font-medium resize-none min-h-[120px]" 
                placeholder="Describe the project, challenges you faced, and what you learned..."
              />
            </div>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-slate-400"><LinkIcon size={18} /></div>
              <input 
                type="url" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} 
                className={inputClass} placeholder="Live URL (Optional)"
              />
            </div>

            {/* GitHub Link */}
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-slate-400"><Github size={18} /></div>
              <input 
                type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)} 
                className={inputClass} placeholder="GitHub URL (Optional)"
              />
            </div>

            {/* Description */}


            {/* Collaborators Section */}
            <div className="sm:col-span-2 bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                <Users size={14} /> Add Collaborators
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {collaborators.map((collab, index) => (
                  <CollabBadge key={index} user={collab} onRemove={() => removeCollab(index)} />
                ))}
              </div>

              <div className="relative">
                <input
                  type="text" 
                  value={collabInput}
                  onChange={(e) => {
                    setCollabInput(e.target.value);
                    setShowCollabSuggestions(true);
                  }}
                  onFocus={() => setShowCollabSuggestions(true)}
                  // Timeout ensures the menu hides if they click completely outside
                  onBlur={() => setTimeout(() => setShowCollabSuggestions(false), 200)}
                  onKeyDown={handleCollabKeyDown}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  placeholder="Type a name to search users (e.g. Sarah)"
                />
                
                {/* Autocomplete Dropdown */}
                {showCollabSuggestions && collabInput && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-48 overflow-y-auto">
                    {suggestions.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        // Changed from onClick to onMouseDown
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevents input from losing focus immediately
                          handleSelectCollab(user);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                      >
                        <img src={user.profileURL} alt={user.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                        {user.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {showCollabSuggestions && collabInput && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-20 p-4 text-center text-sm text-slate-500">
                    No matching users found.
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="sm:col-span-2 bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                <Tag size={14} /> Tech Stack Used
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {techStack.map((tech, index) => (
                  <Badge key={index} onRemove={() => removeTech(index)}>{tech}</Badge>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text" 
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onBlur={handleTechBlur}
                  onKeyDown={handleTechKeyDown}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  placeholder="Type a technology and press Enter (e.g. React, Node.js)"
                />
              </div>
            </div>
          </div>
          <div 
            onClick={handleImageClick}
            className={`w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group relative flex items-center justify-center
              ${imageUrl ? 'border-transparent bg-slate-100' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'}`}
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Project Preview" className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="bg-black/60 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm backdrop-blur-sm">
                     <ImageIcon size={18} /> Change Image
                   </div>
                </div>
              </>
            ) : (
                loading?(<span className="loading loading-spinner loading-xl"></span>):(
                    <div className="text-center px-4">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 text-blue-500 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">Upload Project Cover</p>
                        <p className="text-xs font-medium text-slate-400">PNG, JPG or WEBP (Max 5MB)</p>
                    </div>
                )
            )}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center border border-red-100 animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          {
            saved&&(<div className="p-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl text-center border border-green-100 animate-in fade-in zoom-in-95">
              saved successfully
            </div>)
          }

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-8">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              <Check size={18} strokeWidth={3} />
              Save Project
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}