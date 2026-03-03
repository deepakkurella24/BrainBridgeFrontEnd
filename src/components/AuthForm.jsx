import React, { useEffect } from 'react'
import { useState,useRef } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSuccess } from '../utils/userSlice';
function AuthForm() {
    const navigate=useNavigate()
    const [isSignUp,setIsSignUp]=useState(true);
    const [err,setErr]=useState(null);
    const [isCreated,setIsCreated]=useState(false);
    const email=useRef(null);
    const password=useRef(null);
    const firstName=useRef(null);
    const lastName=useRef(null);
    const isLoggedIn=useSelector((store)=>store.userState.isLoggedIn)
    const dispatch=useDispatch();

    const validateForm=(email,password,userName)=>{
        const isValidEmail=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        const isValidPassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
        if(!isValidEmail) return "invalid Email";
        if(!isValidPassword) return "invalid password";
        if(userName.length===0) return "enter name"
        return null;
    }

    const handleSubmit=()=>{
    // e.preventDefault()
    if(!isSignUp){
        //signup
        const validation=validateForm(email.current.value,password.current.value,firstName.current.value)
        setErr(validation);
        console.log(email.current.value,password.current.value);
        if(validation) return;

        
        axios.post('http://192.168.137.1:7777/auth/signUp',{
            name:firstName.current.value+' '+lastName.current.value,
            email :email.current.value ,
            password:password.current.value
        },{withCredentials:true})
        .then((res)=>{
            console.log(res)
            setIsCreated(true)
        }).catch((err)=>{
            // console.log(err.response.data.error)
            setErr(err.data.error)
        })

    }
    else{

        
        
        axios.post('http://192.168.137.1:7777/auth/logIn',{
            email :email.current.value ,
            password:password.current.value
        },{withCredentials:true})
        .then((res)=>{
            
            let user=res.data.data;
            console.log(user)
            dispatch(setSuccess(user))
            // navigate('/')
        }).catch((err)=>{
            
            setErr(err.response.data.error)
        })
    }


    }

    

    useEffect(() => {
    if (isLoggedIn) {
        navigate("/profile");
    }
    }, [isLoggedIn, navigate]);
    if(isLoggedIn) return <h1 className='flex justify-center items-center'>loading...</h1>
    return (
    
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 bg-gray-200">
        <div className="bg-white rounded-md px-6 py-6 
                        w-full sm:w-10/12 md:w-7/12 lg:w-5/12 xl:w-3/12">

            <p className="text-blue-600 text-2xl md:text-3xl font-bold mb-3 mt-1.5">
            {isSignUp ? "Sign In" : "Sign Up"}
            </p>

            <form onSubmit={(e) => e.preventDefault()}>
            {!isSignUp && (
                <>
                <input
                    type="text"
                    ref={firstName}
                    placeholder="First Name"
                    className="text-black border border-blue-600 bg-gray-100
                            placeholder-black w-full py-2 px-2 my-2 rounded-md"
                />

                <input
                    type="text"
                    ref={lastName}
                    placeholder="Last Name"
                    className="text-black border border-blue-600 bg-gray-100
                            placeholder-black w-full py-2 px-2 my-2 rounded-md"
                />
                </>
            )}

            <input
                type="email"
                ref={email}
                placeholder="Email"
                className="text-black border border-blue-600 bg-gray-100
                            placeholder-black w-full py-2 px-2 my-2 rounded-md"
            />

            <input
                type="password"
                ref={password}
                placeholder="Password"
                className="text-black border border-blue-600 bg-gray-100
                            placeholder-black w-full py-2 px-2 my-2 rounded-md"
            />

            <p className="text-red-500  text-sm md:text-lg">{err}</p>
            {!isSignUp&&isCreated&&(<p className="text-green-400 font-bold text-sm md:text-lg">account created please login</p>)}

            <input
                type="button"
                value={isSignUp ? "Sign In" : "Sign Up"}
                className="cursor-pointer bg-blue-600 text-white font-bold 
                        rounded-md w-full py-2 my-3"
                onClick={handleSubmit}
            />
            </form>

            <div className="text-sm md:text-base mb-2.5">
                <span className="text-black">
                    {!isSignUp ? "Have an Account?" : "New to BrainBridge?"}
                </span>

                <span
                    className="text-blue-600 cursor-pointer hover:underline ml-2"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setErr(null);
                        setIsCreated(false)
                    }}
                >
                    {!isSignUp ? "Sign In now." : "Sign Up now."}
                </span>
            </div>

        </div>
        </div>

  
    )
}

export default AuthForm