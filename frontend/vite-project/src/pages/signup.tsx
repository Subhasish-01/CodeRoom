import { Input } from "../components/Input"
import { Button } from "../components/Button"
import {useRef} from 'react'
import axios from 'axios'
import { BACKEND_URL } from "../config";
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";

export function Signup(){
   const usernameRef=useRef<HTMLInputElement>(null);
   const passwordRef=useRef<HTMLInputElement>(null);
   const navigate=useNavigate();
    async function signup(){
        const username=usernameRef.current?.value;
        const password =passwordRef.current?.value;
        if (!username || !password) {
            toast.error("Please fill all fields");
            return;
         }
        try{
          await axios.post(`${BACKEND_URL}/signup`,{
            username,
            password
          })
         navigate("/signin");
         toast.success("you have signed up!")
        }catch(error){
          toast.error("Signup failed");
          console.log(error);
        }
    }

  return(
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
         <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-2">
              Create Account 
          </h1>

          <p className="text-sm sm:text-base text-center text-slate-600 mb-8">
              Join CodeRoom and start collaborating with your friends.
          </p>
              <div className="flex flex-col gap-4">
                <Input inputref={usernameRef} placeholder="Username"></Input>
                <Input inputref={passwordRef} placeholder="Password"></Input>
              </div>
              <div  className = " pt-4">
                <div className="flex justify-center items-col">
                <Button onClick={signup} varient="primary" text="Signup" size="md"/>
                </div>
                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <button
                        onClick={() => navigate("/signin")}
                        className="text-violet-600 hover:text-violet-700 font-semibold cursor-pointer"
                    >
                        Sign In
                    </button>
                </div>
              </div>

         </div>
    </div>
  )
}