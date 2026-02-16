import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFailure } from '../utils/userSlice'
import { GitPullRequest } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const NavBar = () => {
    const navigate=useNavigate();
    let userObj=useSelector((store)=>store.userState.user)
    console.log(userObj);
    const dispatch=useDispatch()
    console.log(userObj)
    return (
        <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl cursor-pointer" onClick={()=>navigate('/home')} >
                <GitPullRequest size={28} />
                <span>SkillSwap</span>
            </div>
        </div>
        {userObj&&(<div className="flex gap-2">
            {/* <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" /> */}
            <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src={userObj.profileURL} />
                </div>
            </div>
            <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </a>
                </li>
                <li><a>Settings</a></li>
                <li onClick={()=>{
                    axios.post(
                    'http://localhost:7777/auth/logOut',
                    {},
                    { withCredentials: true }
                    ).then((res)=>{
                        console.log(res);
                        dispatch(setFailure());
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }} className='bg-red-500 text-white text-2xl font-bold rounded-l' ><a>LogOut</a></li>
            </ul>
            </div>
        </div>)}
        </div>
    )
}

export default NavBar