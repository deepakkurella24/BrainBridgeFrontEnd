import React, { useState } from 'react';
import { MoreVertical, Github, Globe, Plus, Edit3, Trash2 } from 'lucide-react';
import { timeAgo } from '../utils/utilities';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectCard = ({ project, user,userId,isMyProfile,removeProject }) => {
  // State to handle inline expansion of collaborators
  const navigate=useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const [showAllCollabs, setShowAllCollabs] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const allCollabs = project.collaborators || [];

  const handleNavigate=(id)=>{
    if(id===userId) return
    else{
      navigate('/view/'+id);
      
    }
  }

  const handleRemoveProject=(id)=>{
    axios.post(`http://localhost:7777/project/remove/`+id,{},{withCredentials:true})
    .then((res)=>{
      console.log(res.data);
      removeProject(id);
    })
    .catch((err)=>console.log(err))
  }

  // console.log(user);
  const DESC_MAX_LENGTH = 150;
  const desc = typeof project?.description === 'string' ? project.description : '';
  const isLongDesc = desc.length > DESC_MAX_LENGTH;
  const displayDesc = isLongDesc && !isDescExpanded 
    ? `${desc.slice(0, DESC_MAX_LENGTH)}...` 
    : desc;

return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative transition-all hover:shadow-md">
      
      {/* Options Menu (Edit/Delete) */
         isMyProfile&&(<div className="absolute top-0 right-0 z-20">
          {/* Trigger Button */}
          <button 
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors relative z-40" 
            onClick={() => setShowMenu(!showMenu)} 
          >
            <MoreVertical size={20} />
          </button>

          {/* Dropdown Menu & Overlay */}
          {showMenu && (
            <>
              {/* Invisible full-screen overlay to close menu when clicking outside */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setShowMenu(false)}
              />
              
              {/* Dropdown Box */}
              <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg shadow-slate-200/50 border border-slate-100 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* <button 
                  onClick={() =>{
                    setShowMenu(false);
                    // navigate(`/edit-project/${project.id}`)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-bold transition-colors flex items-center gap-2 border-b border-slate-100"
                >
                  <Edit3 size={16} /> Edit Project
                </button> */}
                <button 
                  onClick={() =>{
                    setShowMenu(false);
                    handleRemoveProject(project._id);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </>
          )}
        </div>)
      }
      {/* Post Header: User & Collaborators */}
      <div className="p-4 sm:p-6 pb-2 pr-12">
        <div className="flex gap-3">
          {/* Author Avatar */}
          <img src={user.profileURL} alt={user.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100" />
          
          <div className="flex-1 min-w-0">
            {/* Name & Collaboration Text */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight" onClick={()=>handleNavigate(user._id)} >
              {user.name} 
              
              {allCollabs.length > 0 && (
                <span className="font-normal text-slate-500 mx-1">collaborated with</span>
              )}
              
              {/* Dynamic Collaborators Text */}
              {allCollabs.length === 1 && (
                <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(allCollabs[0]._id)} >{allCollabs[0].name}</span>
              )}
              
              {allCollabs.length === 2 && (
                <span>
                  <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(allCollabs[0]._id)} >{allCollabs[0].name}</span>
                  <span className="font-normal text-slate-500 mx-1">and</span>
                  <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(allCollabs[1]._id)} >{allCollabs[1].name}</span>
                </span>
              )}

              {/* Default collapsed view for > 2 collaborators */}
              {allCollabs.length > 2 && !showAllCollabs && (
                <span>
                  <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(allCollabs[0]._id)} >{allCollabs[0].name}</span>
                  <span className="font-normal text-slate-500">, </span>
                  <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(allCollabs[1]._id)} >{allCollabs[1].name}</span>
                  <span className="font-normal text-slate-500 mx-1">and</span>
                  <span 
                    className="font-bold hover:text-blue-600 cursor-pointer underline decoration-dotted underline-offset-2"
                    onClick={() => setShowAllCollabs(true)}
                  >
                    {allCollabs.length - 2} others
                  </span>
                </span>
              )}

              {/* Expanded view for > 2 collaborators */}
              {allCollabs.length > 2 && showAllCollabs && (
                <span>
                  {allCollabs.map((c, i) => {
                    const isLast = i === allCollabs.length - 1;
                    const isSecondToLast = i === allCollabs.length - 2;
                    return (
                      <React.Fragment key={i}>
                        <span className="font-bold hover:text-blue-600 cursor-pointer" onClick={()=>handleNavigate(c._id)} >{c.name}</span>
                        {!isLast && (
                          <span className="font-normal text-slate-500">
                            {isSecondToLast ? " and " : ", "}
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                  <span 
                    className="font-normal text-xs text-slate-400 cursor-pointer hover:text-slate-600 ml-1 whitespace-nowrap"
                    onClick={() => setShowAllCollabs(false)}
                  >
                    (less)
                  </span>
                </span>
              )}
            </h3>
            
            {/* Author Role & Timestamp */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
              <span className="text-[10px] text-slate-300">•</span>
              <p className="text-xs text-slate-400 whitespace-nowrap">{timeAgo(project.createdAt)}</p>
            </div>
          </div>

          {/* Overlapping Collaborator Avatars (Desktop only) */}
          {allCollabs.length > 0 && (
            <div className="hidden md:flex -space-x-2 shrink-0 self-start mr-2">
              {allCollabs.slice(0, 3).map((c, i) => (
                <img key={i} src={c.profileURL} alt={c.name} title={c.name} className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm relative" style={{ zIndex: 10 - i }} />
              ))}
              {allCollabs.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm relative z-0">
                  +{allCollabs.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Body: Description & Tech Stack */}
      <div className="px-4 sm:px-6 mb-5 mt-2">
        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
          {displayDesc}
          {isLongDesc && (
            <button 
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="text-slate-500 hover:text-blue-600 font-semibold ml-1 transition-colors outline-none"
            >
              {isDescExpanded ? 'see less' : '...see more'}
            </button>
          )}
        </p>
        
        {/* Tech Stack Tags */}
        {project.techStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map(tech => (
              <span key={tech} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Embedded Project Media & Links */}
      {project.projectImgURL && (
        <div className="border-t border-slate-100 bg-slate-50">
          <img src={project.projectImgURL} alt={project.title} className="w-full h-48 sm:h-72 object-cover border-b border-slate-100" />
          
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            
            {/* Action Buttons (GitHub / Live Link) */}
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              {project.gitHubURL && (
                <a 
                  href={project.gitHubURL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm"
                >
                  <Github size={16} /> Code
                </a>
              )}
              {project.projectURL && (
                <a 
                  href={project.projectURL} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-xl shadow-sm shadow-blue-200 text-white hover:bg-blue-700 transition-all font-bold text-sm"
                >
                  <Globe size={16} /> Live Demo
                </a>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};


export default ProjectCard;