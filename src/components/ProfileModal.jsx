import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X, Save } from 'lucide-react';

const ProfileModal = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Form State
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
      onClose(); // Close modal on success
      window.location.reload(); // Refresh to show new data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
      <div className="bg-[#282828] p-6 rounded-lg w-full max-w-lg border border-gray-700 shadow-2xl">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Bio / Headline</label>
            <input 
              name="bio" value={formData.bio} onChange={handleChange}
              placeholder="Ex: Coding Enthusiast & Bio Student"
              className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded p-2 focus:border-green-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400">Location</label>
              <input 
                name="location" value={formData.location} onChange={handleChange}
                placeholder="India"
                className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">College/Company</label>
              <input 
                name="college" value={formData.college} onChange={handleChange}
                placeholder="IIT Delhi"
                className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded p-2 focus:border-green-500 outline-none"
              />
            </div>
          </div>

          <div>
             <label className="text-xs text-gray-400">GitHub Username</label>
             <input 
               name="github" value={formData.github} onChange={handleChange}
               placeholder="rainikhil723"
               className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded p-2 focus:border-green-500 outline-none"
             />
          </div>
          
          <div>
             <label className="text-xs text-gray-400">LinkedIn Username</label>
             <input 
               name="linkedin" value={formData.linkedin} onChange={handleChange}
               placeholder="nikhil-rai-265"
               className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded p-2 focus:border-green-500 outline-none"
             />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2 font-bold"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Details</>}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;