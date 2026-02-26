import React, { useRef, useState } from 'react'
import { Pencil, Check, X, Plus, Target, Camera,AlertCircle, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {  setSuccess } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom';

function validateForm(name, role, bio, wanted, offered, goal) {
  if (!name || name.trim().length < 3) return "Name must be at least 3 characters";
  if (name.length > 30) return "Name cannot exceed 30 characters";
  
  if (!role || role.trim().length < 3) return "Role must be at least 3 characters";
  if (role.length > 20) return "Role cannot exceed 20 characters";

  if (!bio || bio.trim().length < 10) return "Bio must be at least 10 characters";
  if (bio.length > 150) return "Bio cannot exceed 150 characters";

  if (!goal || goal.trim().length < 5) return "Goal must be at least 5 characters";
  if (goal.length > 80) return "Goal cannot exceed 80 characters";

  
  for (const item of offered) {
    if (wanted.includes(item)) return `"${item}" cannot be in both Offered and Wanted`;
  }

  return null;
}

const Badge = ({ children, variant, isEdit, index, arr, setArr }) => {
  const baseClasses = "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-default animate-in fade-in zoom-in-95 duration-200";
  const variants = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 group-hover:bg-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-slate-100"
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    let filteredArr = arr.filter((ele, ind) => ind !== index);
    setArr(filteredArr);
  }

  return (
    <span className={`${baseClasses} ${variants[variant]}`}>
      {children}
      {isEdit && (
        <button 
          onClick={handleRemove}
          className="p-0.5 hover:bg-black/5 rounded-full transition-colors ml-0.5"
        >
          <X size={12} className="opacity-60 hover:opacity-100" strokeWidth={3} />
        </button>
      )}
    </span>
  );
};

const Card = ({ children, className }) => (
  <div className={`bg-white rounded-[2.25rem] w-full max-w-[420px] p-7 shadow-2xl shadow-slate-200/60 border border-slate-200/60 ${className}`}>
    {children}
  </div>
);

const EditProfile = () => {
  const user=useSelector((store)=>store.userState.user);
  const dispatch=useDispatch()
  let [error,setError]=useState(null);
  const [isEdit, setIsEdit] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [about, setAbout] = useState(user.about);
  const [offeredSkills, setOfferedSkills] = useState(user.offered);
  const [wantedSkills, setWantedSkills] = useState(user.wanted);
  const [offeredInput, setOfferedInput] = useState('');
  const [wantedInput, setWantedInput] = useState('');
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(user.profileURL)
  const [goal, setGoal] = useState(user.goal)
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate()

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

  const handleOfferedBlur = () => {
    
    if(offeredInput.trim()){
      // setOfferedInput(offeredInput.toLowerCase())
      setOfferedSkills([...new Set([...offeredSkills, offeredInput])]);
    }
    setOfferedInput('');
    setToggle(false);
  }

  const handleWantedBlur = () => {
    if(wantedInput.trim()){
      // setWantedInput(wantedInput.toLowerCase())
      setWantedSkills([...new Set([...wantedSkills, wantedInput])]);
    }
    setWantedInput('');
    setToggle2(false);
  }


  const handleSave=async () =>{

    //validtion

    let validation=validateForm(name, role, about, wantedSkills, offeredSkills, goal);
    if(validation){
      setError(validation);
      return;
    }
    setName(name.trim());
    setAbout(about.trim());
    setRole(role.trim());
    setGoal(goal.trim());

    axios.patch('http://localhost:7777/profile/edit',{
      name,
      role,
      profileURL:imageUrl,
      wanted:wantedSkills,
      offered:offeredSkills,
      about,
      goal
    },{withCredentials:true})
    .then((res)=>{

        let user=res.data.data
        dispatch(setSuccess(user))
        setError(null);
        setIsEdit(!isEdit)
    }).catch((err)=>{
        console.log(err.response.data)
        setError(err.response.data.message)
        // setErr(err.data.error)
    })
    setIsEdit(false);
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    setImageUrl(url);
  };

  const handleClick = () => fileInputRef.current.click();

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-center outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 text-sm";

  return (
    <>
      <button 
        className="fixed z-40 top-20 left-4 md:top-8 md:left-72 flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white text-slate-700 font-semibold text-xs md:text-sm rounded-full shadow-md border border-slate-200 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg transition-all active:scale-95 group" 
        onClick={() => navigate('/profile')} 
      >
        <ExternalLink className="text-slate-400 group-hover:text-blue-500 transition-colors w-3.5 h-3.5 md:w-4 md:h-4" />
        {/* <span className="hidden sm:inline">View Profile</span>className="sm:hidden" */}
        <span >View Profile</span>
      </button>
      <div className="flex items-center justify-center mt-9 md:mt-0 min-h-screen bg-[#F8FAFC] p-6">
        <Card className="group transition-all duration-500 flex flex-col relative overflow-hidden">
          
          {/* Background Accent */}
          <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-b from-blue-50 to-transparent" />

          <div className="relative flex flex-col items-center text-center h-full z-10">

            {/* Avatar Section */}
            <div className="relative mb-5">
              <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-white border border-slate-100 shadow-xl relative z-10 transition-transform duration-500 ${isEdit ? 'scale-105' : 'group-hover:scale-105'}`}>
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="EditProfile" 
                    className={`w-full h-full object-cover transition-all ${isEdit ? 'brightness-75 cursor-pointer' : ''}`}
                  />
                  {isEdit && (
                    <div onClick={handleClick} className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white cursor-pointer transition-opacity">
                      {
                        !loading?(
                          <>
                            <Camera size={22} />
                            <span className="text-[9px] font-bold uppercase mt-1">Edit</span>
                          </>
                        ):(<span className="loading loading-spinner loading-xl"></span>)
                      }


                    </div>
                  )
                }
                </div>
              </div>
              
              {!isEdit ? (
                <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-green-500 border-4 border-white rounded-full z-20 shadow-md" />
              ) : (
                <button onClick={handleClick} className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 text-white border-4 border-white rounded-full z-20 shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all">
                  <Pencil size={14} />
                </button>
              )}
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleChange} className="hidden" />
            </div>

            {/* Identity Section */}
            <div className="w-full mb-6">
              {isEdit ? (
                <div className="flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)} 
                    className={`${inputStyle} font-bold text-slate-800 text-xl`} placeholder="Full Name"
                  />
                  <input 
                    type="text" value={role} onChange={(e) => setRole(e.target.value)} 
                    className={`${inputStyle} text-xs font-semibold text-slate-500 uppercase tracking-widest`} placeholder="Current Role"
                  />
                  <textarea 
                    value={about} onChange={(e) => setAbout(e.target.value)} 
                    className={`${inputStyle} text-sm text-slate-600 leading-relaxed py-2.5 resize-none`} placeholder="Bio..." rows="2"
                  />
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-800 text-xl mb-1 tracking-tight">{name}</h3>
                  <p className="text-[11px] font-bold text-blue-600 mb-4 uppercase tracking-[0.2em]">{role}</p>
                  <p className='text-slate-500 text-sm leading-relaxed px-2'>{about}</p>
                </>
              )}
            </div>
            
            <div className="w-full space-y-6 text-left mb-7">
              {/* Offered Skills */}
              <div className="animate-in fade-in duration-500 delay-100">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Skills Offered</p>
                  </div>
                  {isEdit && (
                    <button 
                      onClick={() => setToggle(!toggle)}
                      className={`p-1 rounded-lg transition-all ${toggle ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      {toggle ? <X size={14} /> : <Plus size={14} strokeWidth={3} />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                  {toggle && isEdit && (
                    <input
                      autoFocus
                      type="text" placeholder="New skill..."
                      value={offeredInput}
                      className="px-3 py-1.5 text-xs border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 outline-none w-28 animate-in slide-in-from-left-2 duration-200"
                      onChange={(e) => setOfferedInput(e.target.value.toLowerCase())}
                      onBlur={handleOfferedBlur}
                      onKeyDown={(e) => e.key === 'Enter' && handleOfferedBlur()}
                    />
                  )}
                  {offeredSkills.map((s, index) => (
                    <Badge key={index} variant="blue" isEdit={isEdit} arr={offeredSkills} setArr={setOfferedSkills} index={index}>{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Wanted Skills */}
              <div className="animate-in fade-in duration-500 delay-200">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Skills Wanted</p>
                  </div>
                  {isEdit && (
                    <button 
                      onClick={() => setToggle2(!toggle2)}
                      className={`p-1 rounded-lg transition-all ${toggle2 ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                    >
                      {toggle2 ? <X size={14} /> : <Plus size={14} strokeWidth={3} />}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                  {toggle2 && isEdit && (
                    <input
                      autoFocus
                      value={wantedInput}
                      type="text" placeholder="New skill..."
                      className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-4 focus:ring-slate-500/10 outline-none w-28 animate-in slide-in-from-left-2 duration-200"
                      onChange={(e) => setWantedInput(e.target.value.toLowerCase())}
                      onBlur={handleWantedBlur}
                      onKeyDown={(e) => e.key === 'Enter' && handleWantedBlur()}
                    />
                  )}
                  {wantedSkills.map((s, index) => (
                    <Badge key={index} variant="slate" isEdit={isEdit} arr={wantedSkills} setArr={setWantedSkills} index={index}>{s}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Goal Section */}
            <div className={`w-full p-4 rounded-2xl transition-all border ${isEdit ? 'bg-slate-50 border-slate-200 shadow-inner' : 'bg-blue-50/40 border-blue-100/50'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                  <Target size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Goal Of Learning</p>
                  {isEdit ? (
                    <input
                      type='text' value={goal} onChange={(e) => setGoal(e.target.value)} 
                      className="w-full bg-transparent text-[13px] text-slate-700 font-bold border-b border-slate-300 focus:border-blue-500 outline-none py-0.5"
                      placeholder="Describe mission..."
                    />
                  ) : (
                    <p className="text-[13px] text-slate-700 font-bold leading-tight italic">"{goal}"</p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="absolute bottom-16 w-full flex items-center justify-center gap-2 text-[10px] text-red-500 font-bold bg-red-50 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={12} />
                {error}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex w-full mt-8 gap-3">
              {!isEdit ? (
                <button
                  onClick={() => setIsEdit(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[15px] font-bold shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
                >
                  <Pencil size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { 
                      setIsEdit(false);
                      setName(user.name);
                      setRole(user.role);
                      setAbout(user.about);
                      setOfferedSkills(user.offered);
                      setWantedSkills(user.wanted);
                      setGoal(user.goal);
                      setImageUrl(user.profileURL)
                      setError(null);;
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[14px] font-bold transition-all"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                  >
                    <Check size={18} />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>
        <style>
          {
          `@keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }`
          }
        </style>
      </div>
    </>
  );
};

export default EditProfile;
