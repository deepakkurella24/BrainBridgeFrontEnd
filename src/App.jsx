import { Routes,Route } from 'react-router-dom'
import Body from './components/Body'
import AuthForm from './components/AuthForm'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setFailure, setSuccess } from './utils/userSlice'
import ProtectedRoutes from './ProtectedRoutes'
import NavBar from './components/NavBar'
import Profile from './components/Profile'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import MyRequests from './components/MyRequests'
import Messages from './components/Messages'
import FindMentors from './components/FindMentors'
function App() {
  const dispatch=useDispatch()
  const [toggle,setToggle]=useState(false);

  useEffect(()=>{
    axios.get('http://localhost:7777/auth/check',{withCredentials:true})
    .then((res)=>{
        let user=res.data.data
        dispatch(setSuccess(user))
        setToggle(true);
    })
    .catch((err)=>{
        console.log(err);
        dispatch(setFailure());
        setToggle(true);
    })
  },[])

  if(!toggle) return <h1 className='flex justify-center items-center'>loading...</h1>
  return (
    <Routes>
      
      <Route path='/' element={<LandingPage />} />
      <Route path='authForm' element={<><NavBar/><AuthForm/></>} />
      <Route element={<ProtectedRoutes/>} >
        <Route element={<Body/>}  >
          <Route path='/dashboard' index  element={<Dashboard/>} />
          <Route path='/requests' index  element={<MyRequests/>} />
          <Route path='/chat' index  element={<Messages/>} />
          <Route path='/mentors' index  element={<FindMentors/>} />
          <Route path='/profile' element={<Profile/>} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
