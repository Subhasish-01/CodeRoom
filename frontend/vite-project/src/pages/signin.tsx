import { Input } from "../components/Input"
import { Button } from "../components/Button"
import {useRef,useState} from 'react'
import axios from 'axios'
import { BACKEND_URL } from "../config";
import {useNavigate} from 'react-router-dom'
import { socket } from "../services/socket";
import toast from "react-hot-toast";

export function Signin(){
   const usernameRef=useRef<HTMLInputElement>(null);
   const passwordRef=useRef<HTMLInputElement>(null);
   const navigate=useNavigate();
   const [isLoading, setIsLoading] = useState(false);
    async function signin(){
        const username=usernameRef.current?.value;
        const password =passwordRef.current?.value;
        if (!username || !password) {
            toast.error("Please fill all fields");
            return;
         }
        try{
         const response= await axios.post(`${BACKEND_URL}/signin`,{
            username,
            password
          })
          const jwt=response.data.token;
          sessionStorage.setItem("token",jwt);
          socket.auth={
            token:jwt
          };
          socket.connect();
          
         navigate("/home");
         
        }catch(error){
          toast.error("Signin failed");
          console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

  return(
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 ">
         <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-2">
                    Welcome Back 
                </h1>

                <p className="text-sm sm:text-base text-center text-slate-600 mb-8">
                    Sign in to continue collaborating in CodeRoom.
                </p>
                <Input inputref={usernameRef} placeholder="Username"></Input>
                <Input inputref={passwordRef} placeholder="Password"></Input>
              </div>
              <div  className = "pt-4">
                <div className="flex justify-center items-center">
                <Button onClick={signin} varient="primary" text={isLoading?"Signing In...":"Signin"} size="md"/>
                </div>
                <div className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <button
                        onClick={() => navigate("/signup")}
                        className="text-violet-600 hover:text-violet-700 font-semibold cursor-pointer"
                    >
                        Sign Up
                    </button>
                </div>
              </div>
            
         </div>
    </div>
  )
}