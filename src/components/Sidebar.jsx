import React from 'react';
import { MapPin, Github, Linkedin, Globe, Twitter, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

// Ab ye userData prop lega (Jo DB se aayega)
const Sidebar = ({ userData }) => {
  // Default values agar data abhi load nahi hua
  const data = userData || {};

  return (
    <div className="bg-[#282828] rounded-xl p-6 h-fit shadow-lg border border-gray-700 col-span-1">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
             <img 
               src={data.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
               alt="Avatar" 
               className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] shadow-glow object-cover"
             />
             <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#282828]"></div>
        </div>
        
        <h2 className="mt-4 text-xl font-bold text-gray-100">{data.displayName || "User"}</h2>
        <p className="text-green-400 text-sm font-mono mt-1">Rank: Focus Master</p>
        
        {/* Dynamic Bio (Check Toggle) */}
        {data.show_bio && data.bio && (
             <p className="text-gray-400 text-sm mt-3 leading-relaxed italic">"{data.bio}"</p>
        )}
        
        <Link to="/settings" className="mt-5 w-full bg-green-700/20 hover:bg-green-600/30 text-green-400 border border-green-600 py-2 rounded font-medium flex items-center justify-center gap-2 transition-all">
          <Edit size={16} /> Edit Profile
        </Link>
      </div>

      {/* Dynamic Details List */}
      <div className="mt-6 space-y-3 text-sm text-gray-300">
        
        {data.show_location && data.location && (
            <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span>{data.location}</span>
            </div>
        )}

        {data.show_website && data.website && (
            <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-500" />
                <a href={data.website} target="_blank" rel="noreferrer" className="hover:text-green-400 transition truncate">Website</a>
            </div>
        )}

        {data.show_github && data.github && (
            <div className="flex items-center gap-3">
                <Github size={16} className="text-gray-500" />
                <span className="hover:text-green-400 transition truncate">@{data.github}</span>
            </div>
        )}

        {data.show_linkedin && data.linkedin && (
            <div className="flex items-center gap-3">
                <Linkedin size={16} className="text-gray-500" />
                <span className="hover:text-green-400 transition truncate">/in/{data.linkedin}</span>
            </div>
        )}

        {data.show_twitter && data.twitter && (
            <div className="flex items-center gap-3">
                <Twitter size={16} className="text-gray-500" />
                <span className="hover:text-green-400 transition truncate">@{data.twitter}</span>
            </div>
        )}
      </div>

      {/* Community Stats (Footer - Always Visible) */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-sm">
        <h3 className="font-bold mb-3 text-gray-200">Karma Stats</h3>
        <div className="flex justify-between mb-2">
          <span className="text-gray-400">Total Hours</span>
          <span className="text-white">--</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Global Rank</span>
          <span className="text-white">--</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;