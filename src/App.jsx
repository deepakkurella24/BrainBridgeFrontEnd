import { Routes,Route } from 'react-router-dom'
import Body from './components/Body'
import AuthForm from './components/AuthForm'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setFailure, setSuccess } from './utils/userSlice'
import ProtectedRoutes from './ProtectedRoutes'
import NavBar from './components/NavBar'
// import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import MyRequests from './components/MyRequests'
import Messages from './components/Messages'
import FindMentors from './components/FindMentors'
import SearchResults from './components/SearchResults'
import MyProfile from './components/MyProfile'
import AddProjectForm from './components/AddProjectForm'
import Profile from './components/Profile'
import ChatLayout from './components/ChatLayout'
import ChatWindow from './components/ChatWindow'
import EmptyChatState from './components/EmptyChatState'
function App() {
  const dispatch=useDispatch()
  const [toggle,setToggle]=useState(false);

  useEffect(()=>{
    axios.get('http://192.168.137.1:7777/auth/check',{withCredentials:true})
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
          <Route path="/chat" element={<ChatLayout />}>
         
            <Route index element={<EmptyChatState />} />

            <Route path=":chatId" element={<ChatWindow />} />
          </Route>
          <Route path='/mentors' index  element={<FindMentors/>} />
          <Route path='/profile' element={<MyProfile/>} />
          <Route path='/profile-edit' element={<EditProfile/>} />
          <Route path='/results' element={<SearchResults />} />
          <Route path='/add-project-form' element={<AddProjectForm />} />
          <Route path='/view/:id' element={<Profile />} />
        </Route>
      </Route>

    </Routes>
  )
}

export default App
