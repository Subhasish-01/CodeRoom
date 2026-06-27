import { Button } from "../components/Button"
import axios from 'axios'
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import { useEffect, useState ,useRef } from "react";
import toast from "react-hot-toast";
import {socket} from "../services/socket"


export function Home(){
    const navigate = useNavigate();
    const roomRef=useRef<HTMLInputElement>(null);
    const [username,setUsername] = useState("");
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/me`,{
            headers:{
                authorization:
                sessionStorage.getItem("token")
            }
        }).then((res)=>{
            setUsername(
                res.data.username
            )
        })
    },[]);
    async function createRoom(){
        try{
        const response = await axios.post(`${BACKEND_URL}/room/create`,
            {},
            {
                headers:{
                    authorization:sessionStorage.getItem("token")
                }
            }
        );
        navigate(
            `/room/${response.data.roomId}`
        );
       }
       catch(e){
        toast.error("Unable to create room")
       }
    }
    async function joinRoom(){
        try{
                const roomId =
            roomRef.current?.value;

            if (!roomId) {
                toast.error("Please enter Room ID")
                return;
            }

            await axios.get(
            `${BACKEND_URL}/room/${roomId}`,
            {
                headers: {
                authorization:
                    sessionStorage.getItem("token")
                }
            }
            );

            navigate(`/room/${roomId}`);
        } 
        catch(e){
            toast.error("Room not found")
        }
    }
    function logout(){
        socket.disconnect();
        sessionStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/signin");
    }
    return (
        <div className="min-h-screen bg-slate-900 flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-2">
                    CodeRoom
                </h1>
                 <p className="text-sm sm:text-base text-slate-800 text-center mb-8">
                    Create or join a collaborative coding room
                  </p>
                  <div className="mb-6">
                    <div className="mb-2 flex items-center justify-between">
                    <p className="text-slate-600 text-md mb-2">
                        Logged in as 
                    </p>
                    <button onClick={logout} className="rounded-full border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-100">
                        Logout
                    </button>
                    </div>
                     <div className="bg-slate-100 text-blue px-4 py-3 rounded-lg">
                        {username}
                     </div>
                     
                  </div>
            <div className = "space-y-4">
                <Input placeholder="Room ID" inputref={roomRef} fullwidth/>
                <div className="flex justify-center items-center pt-4">
                <Button text="Join Room" varient="secondary" size="md" onClick={joinRoom} />
                </div>
            </div>
            <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-600"></div>

            <span className="px-4 text-slate-400">
            OR
            </span>

            <div className="flex-1 border-t border-slate-600"></div>
        </div>
            <Button text="Create Room" varient="primary" size="md" fullwidth onClick={createRoom}/>
            </div>

        </div>
    )
}