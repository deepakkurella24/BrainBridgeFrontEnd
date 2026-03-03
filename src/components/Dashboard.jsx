import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ShimmerCard from './ShimmerCard';
import axios from 'axios';
import { setFeed, setHasMore, setLoading } from '../utils/feedSlice';
import { Search, UserX } from 'lucide-react';
import CardsContainer from './CardsContainer';

const Dashboard = () => {
  const [page,setPage]=useState(1);
  const users=useSelector((store)=>store.feedState.feed);
  const hasMore=useSelector((store)=>store.feedState.hasMore);
  const loading=useSelector((store)=>store.feedState.loading);
  const dispatch=useDispatch();

  function getData(){
    axios.get(`http://192.168.137.1:7777/user/feed?page=${page}&limit=4`,{withCredentials:true})
    .then((res)=>{
      if(page===1) dispatch(setLoading(false));
      let feed=res.data.data;
      if(!res.data.hasMore) dispatch(setHasMore(false))
      dispatch(setFeed(feed));
    })
    .catch((err)=>console.log(err));
  }


  useEffect(() => {
    if (!hasMore) return;
    const onScroll = () => {
      if(window.innerHeight + window.scrollY >=document.body.offsetHeight - 50){
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", onScroll);


    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore]);

  useEffect(()=>{
    getData();
  },[])

  useEffect(() => {
    if(page === 1) return;
    getData();
  }, [page]);

  if(loading || users.length === 0 ) return (
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

  return (<CardsContainer users={users} hasMore={hasMore} parent={'dashboard'} />)

}

export default Dashboard