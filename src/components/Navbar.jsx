import React from 'react';
import { Download, Users, Trophy, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // 👈 1. Import Zaroori Hai

const Navbar = ({ onPrint }) => { // 👈 onEditProfile hata diya, ab zaroorat nahi
  const { user, logOut } = useAuth();

  return (
    <nav className="w-full bg-[#282828] border-b border-gray-700 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      
      {/* 1. Left: Logo */}
      <Link to="/" className="flex items-center gap-3"> {/* Logo pe click karke Home */}
         <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-black">K</div>
         <span className="text-xl font-bold tracking-tight text-white">KarmaLoop</span>
      </Link>

      {/* 2. Center: Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
         <Link to="/" className="text-white hover:text-green-400 transition">Dashboard</Link>
         <Link to="/rankings" className="hover:text-green-400 transition flex items-center gap-1"><Trophy size={16}/> Rankings</Link>
         <Link to="/community" className="hover:text-green-400 transition flex items-center gap-1"><Users size={16}/> Community</Link>
      </div>

      {/* 3. Right: Actions */}
      <div className="flex items-center gap-4">
         {/* Print Report Button */}
         <button 
           onClick={onPrint}
           className="hidden md:flex items-center gap-2 bg-[#333] hover:bg-[#444] text-white px-3 py-1.5 rounded text-sm border border-gray-600 transition"
         >
            <Download size={14} /> Report
         </button>

         {/* Profile Dropdown */}
         <div className="flex items-center gap-3 border-l border-gray-600 pl-4">
            <span className="text-sm text-gray-300 hidden sm:block">{user?.displayName}</span>
            
            {/* 👇 YAHAN CHANGE KIYA HAI */}
            <Link to="/settings"> 
                <img 
                  src={user?.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-500 cursor-pointer hover:border-green-500 hover:scale-110 transition"
                />
            </Link>

            <button onClick={logOut} className="text-red-400 hover:text-red-300 ml-2" title="Logout">
               <LogOut size={18} />
            </button>
         </div>
      </div>
    </nav>
  );
};

export default Navbar;