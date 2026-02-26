import axios from "axios";
import { Check, Plus, Search, UserMinus, X,Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EditGroupModal = ({ group, onClose, onSave }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [members, setMembers] = useState(group?.members || []);
  const userId=useSelector((store)=>store.userState.user._id);

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions,setSuggestions]=useState([]);


  const handleAddMember = (user) => {
    setMembers([...members, user]);
    setSearchInput("");
    setShowSuggestions(false);
    setIsAddingMember(false);
  };

  const handleRemoveMember = (memberId) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    
    console.log("Saving group updates:", { name: groupName, members });
    // TODO: Emit socket event or Axios post to update group settings
    
    if (onSave) onSave({ ...group, name: groupName, members });
    onClose();
  };

  useEffect(()=>{
    if (!searchInput) return;
    const timeOut=setTimeout(()=>{


        axios.get(`http://localhost:7777/user/search-suggestion-connections?q=${searchInput}`,{withCredentials:true})
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">Edit Group</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Update name and manage members.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-slate-200">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {/* Group Name */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Group Name</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-slate-400"><Users size={18} /></div>
              <input 
                type="text" 
                value={groupName} 
                onChange={(e) => setGroupName(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-400 font-medium" 
                placeholder="Group Name"
              />
            </div>
          </div>

          {/* Manage Members */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Manage Members</label>
              <button 
                type="button" 
                onClick={() => setIsAddingMember(!isAddingMember)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Add Member"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </div>
            
            {/* Add Member Search Input */}
            {isAddingMember && (
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text" 
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
                  placeholder="Search connections to add..."
                  autoFocus
                />
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && searchInput && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-40 overflow-y-auto">
                    {suggestions.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleAddMember(user);
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors border-b border-slate-50 last:border-0 flex items-center gap-3"
                      >
                        <img src={user.img} alt={user.name} className="w-6 h-6 rounded-full object-cover shadow-sm" />
                        {user.name}
                      </button>
                    ))}
                  </div>
                )}
                
                {showSuggestions && searchInput && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-100 rounded-xl shadow-lg shadow-slate-200/50 z-20 p-3 text-center text-xs text-slate-500">
                    No matches found.
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
              {members.length > 0 ? members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm group">
                  <div className="flex items-center gap-3">
                    <img src={member.profileURL || 'https://via.placeholder.com/150'} alt={member.name} className="w-8 h-8 rounded-full object-cover shadow-sm bg-slate-200" />
                    <span className="text-sm font-bold text-slate-700">{member.name}</span>
                  </div>
                  {
                    (member.id!==userId)&&(
                      <button 
                        type="button" 
                        onClick={() => handleRemoveMember(member.id)} 
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove Member"
                      >
                        <UserMinus size={16} />
                      </button>
                    )
                  }
                </div>
              )) : (
                <div className="p-4 text-center text-sm text-slate-500">No members left.</div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-auto">
            <button type="button" onClick={onClose} className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold transition-all">
              Cancel
            </button>
            <button type="submit" disabled={!groupName.trim()} className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${!groupName.trim() ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>
              <Check size={18} strokeWidth={3} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default EditGroupModal;