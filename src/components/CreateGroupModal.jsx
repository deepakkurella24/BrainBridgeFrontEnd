import axios from "axios";
import { AlertCircle, Check, Search, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

const CreateGroupModal = ({ onClose, onCreate }) => {
  const [groupName, setGroupName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [resSelectedUsers,setResSelectedUsers]=useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions,setSuggestions]=useState([])
  const [error,setError]=useState(null)


  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setResSelectedUsers([...resSelectedUsers,user._id]);
    setSearchInput("");
    setShowSuggestions(false);
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(u => u.id !== userId));
    setResSelectedUsers(resSelectedUsers.filter(u => u !== userId));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0 || selectedUsers.length>5 ){
        setError('invalid form')
        return;
    };
    
    console.log("Creating group:", );
    axios.post('http://192.168.137.1:7777/chat/create-group',{
        groupName: groupName,
        members: selectedUsers
    },{withCredentials:true})
    .then((res)=>{
        console.log(res.data.data);
        onCreate();
        onClose();
    })
    .catch((err)=>{
        setError(err.data)
    })
    

    
  };


    useEffect(()=>{
        if (!searchInput) return;
        const timeOut=setTimeout(()=>{


            axios.get(`http://192.168.137.1:7777/user/search-suggestion-connections?q=${searchInput}`,{withCredentials:true})
            .then((res)=>{
                const data=res.data.data;
                setSuggestions(data[1]);
                console.log(data)
            })
            .catch((err)=>{
                console.log(err);
            })

        },200)

        return () => clearTimeout(timeOut);

      
    },[searchInput])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose}
      />
      

      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Create Group</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Start a conversation with multiple people.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleCreate} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Group Name</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-slate-400"><Users size={18} /></div>
              <input 
                type="text" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 font-medium" 
                placeholder="e.g. Frontend Core Team"
                autoFocus
              />
            </div>
          </div>


          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Add Members</label>
            

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                {selectedUsers.map((user) => (
                  <span key={user.id} className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-200 shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200">
                    <img src={user.img} alt={user.name} className="w-5 h-5 rounded-full object-cover bg-slate-200" />
                    {user.name}
                    <button type="button" onClick={() => handleRemoveUser(user.id)} className="p-0.5 hover:bg-slate-100 rounded-full transition-colors ml-0.5 text-slate-400 hover:text-red-500">
                      <X size={14} strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
            )}


            <div className="relative">
              <Search className="absolute left-4 top-3 text-slate-400" size={16} />
              <input
                type="text" 
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                placeholder="Search connections..."
              />
              

              {showSuggestions && searchInput && suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-48 overflow-y-auto">
                  {suggestions.map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectUser(user);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                    >
                      <img src={user.profileURL} alt={user.name} className="w-7 h-7 rounded-full object-cover shadow-sm" />
                      {user.name}
                    </button>
                  ))}
                </div>
              )}
              
              {showSuggestions && searchInput && suggestions.length === 0 && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-20 p-4 text-center text-sm text-slate-500">
                  No matches found.
                </div>
              )}
            </div>
          </div>
            {error && (
              <div className="absolute bottom-16 w-full flex items-center justify-center gap-2 text-[10px] text-red-500 font-bold bg-red-50 py-1.5 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                <AlertCircle size={12} />
                {error}
              </div>
            )}
          

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!groupName.trim() || selectedUsers.length === 0}
              className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${(!groupName.trim() || selectedUsers.length === 0) ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}
            >
              <Check size={18} strokeWidth={3} />
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};




export default CreateGroupModal;