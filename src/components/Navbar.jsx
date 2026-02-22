import React, { useState } from 'react';
import { Download, Users, Trophy, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = ({ onPrint }) => {
  const { user, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-6xl h-[60px] backdrop-blur-2xl bg-[#0a0a0a]/70 border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-6 flex justify-between items-center transition-all duration-300">
          
          <Link to="/" className="flex items-center gap-3 group h-full">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <img 
                src={logo} 
                alt="KarmaLoop Logo" 
                className="w-14 h-14 object-contain group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_30px_rgba(236,72,153,0.6)] group-hover:drop-shadow-[0_0_40px_rgba(236,72,153,0.8)] brightness-110"
              />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Karma<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Loop</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#a0aec0]">
            <Link to="/" className="hover:text-white transition-colors duration-300">
              Dashboard
            </Link>
            <Link to="/rankings" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <Trophy size={16} /> 
              Rankings
            </Link>
            <Link to="/community" className="flex items-center gap-2 hover:text-white transition-colors duration-300">
              <Users size={16} /> 
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

            <div className="hidden md:flex items-center gap-4 pl-5 border-l border-white/10">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-24 inset-x-4 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 space-y-4">
            
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <img
                src={user?.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover"
              />
              <span className="text-sm font-medium text-white/80">
                {user?.displayName}
              </span>
            </div>

            {/* Navigation Links */}
            <Link 
              to="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy size={20} className="text-[#a0aec0]" />
              <span className="font-semibold">Dashboard</span>
            </Link>

            <Link 
              to="/rankings" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Trophy size={20} className="text-[#a0aec0]" />
              <span className="font-semibold">Rankings</span>
            </Link>

            <Link 
              to="/community" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users size={20} className="text-[#a0aec0]" />
              <span className="font-semibold">Community</span>
            </Link>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                onClick={() => {
                  onPrint();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 backdrop-blur-md transition-all duration-300"
              >
                <Download size={16} /> 
                Download Report
              </button>

              <Link 
                to="/settings"
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 backdrop-blur-md transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>

              <button
                onClick={() => {
                  logOut();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium border border-red-500/20 transition-all duration-300"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;