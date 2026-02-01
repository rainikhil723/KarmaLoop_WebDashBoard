import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { googleSignIn } = useAuth();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#1a1a1a] text-white px-4">
      {/* Card */}
      <div className="bg-[#282828] p-10 rounded-2xl border border-gray-700 shadow-2xl text-center w-full max-w-2xl">
        
        {/* Logo Animation */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500 animate-pulse">
            <LogIn size={40} className="text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Login to view your KarmaLoop Dashboard</p>

        <button 
          onClick={googleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition transform hover:scale-105"
        >
          <img 
            src="https://www.svgrepo.com/show/475656/google-color.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          Sign in with Google
        </button>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">Focus Mastery • KarmaLoop Web</p>
    </div>
  );
};

export default Login;