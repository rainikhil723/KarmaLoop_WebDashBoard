import React from 'react';
import { Download, Users, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onPrint }) => {
  const { user, logOut } = useAuth();

  return (
    <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-6xl backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-6 py-3 flex justify-between items-center transition-all duration-300">
        
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] group-hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:scale-105 transition-all duration-300">
            K
          </div>
          <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Karma<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Loop</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/60">
          <Link to="/" className="hover:text-white transition-colors duration-300">
            Dashboard
          </Link>
          <Link to="/rankings" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
            <Trophy size={16} className="text-purple-400" /> 
            Rankings
          </Link>
          <Link to="/community" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
            <Users size={16} className="text-blue-400" /> 
            Community
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={onPrint}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Download size={14} /> 
            Report
          </button>

          <div className="flex items-center gap-4 pl-5 border-l border-white/10">
            <span className="hidden sm:block text-sm font-medium text-white/80">
              {user?.displayName}
            </span>

            <Link to="/settings">
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-transparent hover:border-pink-500 transition-all duration-300 shadow-lg object-cover cursor-pointer"
              />
            </Link>

            <button
              onClick={logOut}
              className="text-white/40 hover:text-red-400 transition-colors duration-300"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;