import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-violet-950">
             
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>

            
            <div className="absolute bottom-0 right-0 h-112.5 w-112.5 rounded-full bg-cyan-500/20 blur-[140px] animate-pulse"></div>

            
            <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse"></div>
                <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <h1
                            onClick={() => navigate("/")}
                            className="cursor-pointer text-3xl font-black tracking-tight text-white transition hover:scale-105"
                        >
                            Code<span className="text-violet-500">Room</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <button onClick={()=>navigate("/signin")} className="text-slate-300 transition hover:text-white"> Login </button>
                        <Button text="Sign Up" varient="primary" size="md" onClick={()=> navigate("/signup")}/>
                    </div>
                </nav>
                <section className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
                    <p className="mb-4 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-300 backdrop-blur">
                    Real-Time Collaborative Coding
                    </p>
                        <h1 className="max-w-5xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                            Code Better.
                            <br />
                            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                                Together.
                            </span>
                            <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                                Write, collaborate and execute code in real time.
                            </p>
                            <div className="mt-6">
                                <button  onClick={() => navigate("/signup")} className="rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:border-violet-400 hover:bg-violet-500/20">
                                    Get Started
                                </button>
                               
                            </div>
                        </h1>

                </section>
               <div className="flex justify-center items-center">
                    <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                    Build, collaborate, and execute code seamlessly in real time.
                </p>
               </div>
                

        </div>
    );
}