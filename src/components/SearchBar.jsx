import axios from 'axios';
import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCache2 } from '../utils/userSlice';

const SearchBar = ({text}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions,setSuggestions]=useState([])
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const cache2=useSelector((state)=>state.userState.cache)

  function handleSearchSubmit(a){
    if(a) setSearchQuery(a.trim());
    else setSearchQuery(searchQuery.trim());
    if(!searchQuery.length) return;
    navigate(`/results?search_query=${a || searchQuery}`);
  }


  useEffect(()=>{
    if (!searchQuery) return;
    const timeOut=setTimeout(()=>{
        if(cache2[searchQuery]){
            setSuggestions(cache2[searchQuery])
        }
        else{
          axios.get(`http://localhost:7777/user/names-skills-suggetion?q=${searchQuery}`,{withCredentials:true})
          .then((res)=>{
            const data=res.data.data;
            setSuggestions(data[1]);
            dispatch(setCache2({[data[0]]:data[1]}))
            console.log(data)
          })
          .catch((err)=>{
              console.log(err);
          })
        }
    },200)

    return () => clearTimeout(timeOut);

      
  },[searchQuery])



// useEffect(() => {
//   if (!searchQuery) return;

//   const timeOut = setTimeout(() => {
//     if (cache2[searchQuery]) {
//       setSuggestions(cache2[searchQuery]);
//     } else {
//       const currentQuery = searchQuery;

//       axios
//         .get(
//           `http://localhost:7777/user/names-skills-suggetion?q=${currentQuery}`,
//           { withCredentials: true }
//         )
//         .then((res) => {
//           const [q, list] = res.data.data;

//           // ❗ prevent stale response overwrite
//           if (currentQuery !== q) return;

//           setSuggestions(list);
//           dispatch(setCache2([q, list]));
//         })
//         .catch((err) => console.log(err));
//     }
//   }, 200);

//   return () => clearTimeout(timeOut);
// }, [searchQuery]);


  return (
      <div className=" mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{text}</h1>
          {/* <p className="text-slate-500 font-medium">People who have the skills you want.</p>  */}
        </div>
        <div className="relative w-full md:w-[450px]">
          <div className="flex w-full bg-white border border-slate-200 rounded-full overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all shadow-sm">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              // Delay onBlur so the suggestion click event can fire before menu hides
              onBlur={() => setTimeout(() => setShowSuggestions(false), 400)}
              placeholder="Search skills..." 
              className="flex-1 pl-6 pr-4 py-3.5 text-sm bg-transparent outline-none placeholder:text-slate-400" 
            />
            
            {/* Search Button */}
            <button className="px-6 md:px-8 bg-blue-500 border-l border-slate-200 text-white hover:bg-blue-600  transition-colors flex items-center justify-center" onClick={handleSearchSubmit} >
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {suggestions.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    
                    handleSearchSubmit(skill.value);
                    // setShowSuggestions(true);
                  }}
                  className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium transition-colors border-b border-slate-50 last:border-0"
                >
                  {/* {skill.name} */}
                  {skill.type === "name" ? "👤 " : "🛠️ "}
                  {skill.value}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}

export default SearchBar