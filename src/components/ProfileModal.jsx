import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X, Save, Sparkles, MapPin, Building2, Github, Linkedin, MessageSquare } from 'lucide-react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    github: user?.github || "",
    linkedin: user?.linkedin || "",
    college: user?.college || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, formData);
      onClose(); 
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div 
        className="relative bg-[#0a0a0a]/90 backdrop-blur-2xl p-8 rounded-3xl w-full max-w-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ animation: 'modalSlideUp 0.3s ease-out forwards' }}
      >
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-pink-500/20 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
              Edit Identity
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:rotate-90 transition-all duration-300 border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 relative z-10">
          
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
              <MessageSquare size={12} /> Bio / Headline
            </label>
            <input 
              name="bio" value={formData.bio} onChange={handleChange}
              placeholder="Ex: Crafting code & chasing consistency"
              className="w-full bg-white/5 text-white/90 border border-white/10 rounded-xl p-3.5 focus:border-pink-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium text-sm shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                <MapPin size={12} /> Location
              </label>
              <input 
                name="location" value={formData.location} onChange={handleChange}
                placeholder="Delhi, India"
                className="w-full bg-white/5 text-white/90 border border-white/10 rounded-xl p-3.5 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium text-sm shadow-inner"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
                <Building2 size={12} /> Institution / Org
              </label>
              <input 
                name="college" value={formData.college} onChange={handleChange}
                placeholder="USICT"
                className="w-full bg-white/5 text-white/90 border border-white/10 rounded-xl p-3.5 focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium text-sm shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
               <Github size={12} /> GitHub Alias
             </label>
             <div className="flex">
               <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-xl px-4 flex items-center text-white/30 text-sm font-medium">github.com/</span>
               <input 
                 name="github" value={formData.github} onChange={handleChange}
                 placeholder="username"
                 className="w-full bg-white/5 text-white/90 border border-white/10 rounded-r-xl p-3.5 focus:border-pink-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium text-sm shadow-inner"
               />
             </div>
          </div>
          
          <div className="space-y-1.5">
             <label className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">
               <Linkedin size={12} /> LinkedIn URL
             </label>
             <div className="flex">
               <span className="bg-white/5 border border-white/10 border-r-0 rounded-l-xl px-4 flex items-center text-white/30 text-sm font-medium">linkedin.com/in/</span>
               <input 
                 name="linkedin" value={formData.linkedin} onChange={handleChange}
                 placeholder="username"
                 className="w-full bg-white/5 text-white/90 border border-white/10 rounded-r-xl p-3.5 focus:border-pink-500/50 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium text-sm shadow-inner"
               />
             </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 relative z-10 pt-4 border-t border-white/5">
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-bold text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl flex items-center gap-2 font-black text-sm tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Syncing..." : <><Save size={16} /> Save Identity</>}
          </button>
        </div>

      </div>
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;