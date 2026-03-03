import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import CardsContainer from './CardsContainer';
import { UserX } from 'lucide-react';
import ShimmerCard from './ShimmerCard';

const SearchResults = () => {
    const [users,setUsers]=useState([]);
    const [searchParams] = useSearchParams();
    const [loading,setLoading]=useState(true);
    const query=searchParams.get('search_query');

    function updateTo(id,status){
        let resUser=users.map((user)=>{
            if(user._id===id){
                return {...user,status}
            }
            return user;
        })
        setUsers(resUser);
    }

    useEffect(()=>{
        // setLoading(true);
        axios.get(`http://192.168.137.1:7777/user/search?q=${query}`,{withCredentials:true})
        .then((res)=>{
            setLoading(false);
            setUsers(res.data.data);
        })
        .catch((err)=>{
            console.log(err);

        })
    },[query]);


    if(loading || users.length===0 ) return (
        <>
        {
            loading ? (
            /* ADDED: w-full here */
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ShimmerCard/>
                <ShimmerCard/>
                <ShimmerCard/>
                <ShimmerCard/>
                <ShimmerCard/>
                <ShimmerCard/>
            </div>
            ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-40 text-center animate-in fade-in zoom-in-95 duration-300 w-full">
                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center mb-4 border border-slate-100">
                    <UserX size={40} strokeWidth={1.5} />
                </div>
                <h3 className="text-slate-800 font-extrabold text-xl mb-2">No matches found</h3>
                <p className="text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                    We couldn't find anyone matching your criteria. Try adjusting your skills.
                </p>
            </div>
            )
        }
        </>
    )

    return (
        <CardsContainer users={users} hasMore={false} updateTo={updateTo} />
    )
}

export default SearchResults