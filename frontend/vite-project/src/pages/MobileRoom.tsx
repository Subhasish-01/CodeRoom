import {useState} from 'react';
import type { DesktopRoomProps } from './DesktopRoom';
import { socket } from '../services/socket';
import { Button } from '../components/Button';
import Editor from "@monaco-editor/react";
import { MenuIcon } from '../assets/Menu';
import { ChatIcon } from '../assets/Chat';
import { ArrowLeftIcon } from '../assets/ArrowLeft';

export function MobileRoom({roomId,code,language,isRunning,setCode,setLanguage,runCode
    ,users,copyRoomId,leaveRoom,messages,message,setMessage,sendMessage,currentUser,messageEndRef,setInput,input,output
}:DesktopRoomProps){
    const [view,setView] = useState<"editor" | "chat">("editor");

    const [showSidebar,setShowSidebar]=useState(false);
    return(
        <>
            <div
                className={`lg:hidden h-screen bg-slate-900 transition-opacity duration-300 ${
                    showSidebar ? "opacity-75" : "opacity-100"
                }`}
            >
            <div className="h-16 border-b border-slate-700 px-4 flex items-center justify-between">
                <button onClick={()=>setShowSidebar(true)} className="text-white text-2xl cursor-pointer">
                    <MenuIcon/>
                </button>
                <select
                   value={language}
                   onChange={(e)=>{
                    const lang = e.target.value;
                    setLanguage(lang);
                    socket.emit("language-change",JSON.stringify({
                        roomId,
                        language:lang
                    }))
                   }} className="bg-slate-800 text-white rounded-lg px-3 py-2">
                    <option value="cpp">C++</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                   </select>
                   
                    <div className = "flex gap-2">
                        <button onClick={()=>setView("chat")} className="text-xl cursor-pointer"> <ChatIcon/> </button>
                        <Button text={isRunning?"Running":"Run"} size="sm" varient="secondary" onClick={()=>{
                            runCode();
                            
                        }}/>
                    </div>
            </div>
           
             {view==="editor" && (
                <div className="h-[calc(100vh-64px)] flex flex-col">
                    <div className="flex-1 basis-0 min-h-0 overflow-hidden">
                    <Editor height="100%" options={{automaticLayout:true}}theme="vs-dark" language={language} value={code} onChange={(value)=>{
                        const newCode = value || "";
                        setCode(newCode);
                        socket.emit("code-change",JSON.stringify({
                            roomId,
                            code:newCode
                        }))
                         socket.emit("clear-output",JSON.stringify({
                            roomId
                           
                        }))
                    }}/>
                    </div>
                    <div className="border-t border-slate-700 bg-slate-950 p-3 space-y-3 h-64 overflow-y-auto hide-scrollbar">
                        <div>
                             <p className="text-white font-semibold mb-2">
                            Custom Input
                        </p>
                        <textarea value={input} onChange={(e)=>{
                            const newInput=e.target.value;
                            setInput(newInput);
                            socket.emit("input-change",JSON.stringify({
                                roomId,
                                input:newInput
                            }));
                            
                            socket.emit("clear-output",JSON.stringify({
                               roomId
                             }))
                            
                        }} placeholder="Enter i/p ..."
                         className="w-full h-24 bg-slate-800 text-white rounded-lg p-3 outline-none resize-none"/>
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-2">
                            Output
                        </p>
                        <pre className="h-24 bg-slate-900 text-green-400 rounded-lg p-3 overflow-auto whitespace-pre-wrap hide-scrollbar">
                            {output}
                        </pre>
                        </div>

                    </div>
                </div>
             )}
             {view==="chat" && (
                <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-900">
                    <div className="h-14 border border-slate-700 flex items-center px-4">
                        <button onClick={()=>setView("editor")} className="text-white text-lg cursor-pointer">
                            <ArrowLeftIcon/>
                        </button>
                        <h2 className="text-white font-semibold text-lg">
                            Chat
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg,index)=>{
                        const isMe=msg.sender===currentUser;
                        return(
                        <div
                            
                            key={index}
                            className={`flex mb-2 ${isMe?"justify-end":"justify-start"}`}>
                            <div
                            className={` text-white p-3 rounded-lg mb-2  max-w-[70%] break-all ${isMe?"bg-slate-600 text-white":"bg-slate-800 text-white"}`}
                            >
                                
                                <span className="text-xs font-semibold mb-1">
                                    {msg.sender}
                                </span>
                                <span>: </span>
                                <span>{msg.message}</span>
                                </div>
                        </div>
                        );
                        
                    })}
                    <div ref={messageEndRef}></div>
                    </div>
                    <div className="border-t border-slate-700 p-3 flex gap-2">
                        <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            sendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-lg outline-none"
                    />
                    <Button onClick={sendMessage} varient="primary" size="md" text="Send"></Button>

                    </div>
                </div>
             )}
             </div>
             
                 <div className = {`fixed inset-0 z-50 flex transition-opacity duration-300 ${showSidebar?"pointer-events-auto":"pointer-events-none"}`} onClick={()=>setShowSidebar(false)}>
                         
                         <div className={`relative w-72 h-full bg-slate-950 border-r border-slate-700 p-5 flex flex-col transition-transform duration-300 ease-in-out ${showSidebar?"translate-x-0":"-translate-x-full"}`} onClick={(e)=>e.stopPropagation()}>
                             <div className="p-6 border-b border-slate-700">
                                <p className="text-slate-400 text-sm">
                                    ROOM ID
                                </p>
                                <h1 className="text-3xl font-bold text-violet-500 mt-2">
                                    {roomId}
                                </h1>
                            </div>
                            <div className="mt-8 flex-1">
                                <p className="text-slate-400 mb-3">
                                    CONNECTED
                                </p>
                                <div className="space-y-2">
                                    {users.map((user,index)=>(
                                        <div key={index} className="bg-slate-800 text-white rounded-lg px-3 py-2">
                                            🟢 {user}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Button text="Copy Room" size="md" varient="primary" fullwidth onClick={copyRoomId}/>
                                <Button text="Leave Room" size="md" varient="secondary" fullwidth onClick={leaveRoom}/>
                            </div>
                        
                     </div>
                </div>
             
        </>
    )
}
