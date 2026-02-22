import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Hexagon } from 'lucide-react';

const Login = () => {
  const { googleSignIn } = useAuth();

  return (
    <div className="relative h-screen flex flex-col justify-center items-center bg-[#050505] text-white px-4 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-[120px] rounded-full pointer-events-none animate-pulse duration-1000"></div>

      <div className="relative z-10 bg-[#0a0a0a]/80 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center w-full max-w-md group">
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>

        <div className="mb-10 flex justify-center relative">
          <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"></div>
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)] group-hover:scale-105 group-hover:rotate-6 transition-all duration-500 relative z-10">
            <Hexagon size={48} className="text-white fill-white/20" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
          KarmaLoop
        </h1>
        <p className="text-white/40 mb-10 font-medium tracking-wide">
          Authenticate to access your dashboard.
        </p>

        <button 
          onClick={googleSignIn}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-100 text-black font-black py-4 px-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Initialize Session
        </button>
      </div>
      
      <p className="absolute bottom-8 text-white/20 text-xs font-bold uppercase tracking-widest">
        Focus Mastery Interface • v2.0
      </p>
    </div>
  );
};

export default Login;