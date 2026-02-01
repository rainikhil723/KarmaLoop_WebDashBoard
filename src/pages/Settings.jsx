import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../config/firebase';
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { updateProfile, deleteUser } from 'firebase/auth';
import { seedDatabase } from '../hooks/useHistory'; 
import { 
  User, Settings as SettingsIcon, Trash2, 
  ChevronRight, Save, MapPin, Globe, 
  Github, Linkedin, Twitter, Shield, Calendar, Key, Loader2, Wrench
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔔 Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // 📝 Form State
  const [formData, setFormData] = useState({
    displayName: '',
    photoURL: '', 
    gender: '', show_gender: true,
    location: '', show_location: true,
    birthday: '', show_birthday: false,
    bio: '', show_bio: true,
    website: '', show_website: true,
    github: '', show_github: true,
    linkedin: '', show_linkedin: true,
    twitter: '', show_twitter: true,
    points_total: 0,
    createdAt: null,
  });

  // 📥 Fetch Real Data
  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({ 
            ...prev, 
            ...data, 
            displayName: user.displayName || data.displayName || '',
            photoURL: user.photoURL || data.photoURL || '',
            createdAt: user.metadata.creationTime
          }));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  // 💾 Save Logic
  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, formData);
      
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }
      showToast("Profile settings saved!", "success");
    } catch (error) {
      showToast("Failed to save changes.", "error");
    }
    setSaving(false);
  };

  // 🛠️ Developer Tool: Force Create History for Today
  const forceCreateHistory = async () => {
    if(!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    try {
        // Create specific document for TODAY in 'history' subcollection
        await setDoc(doc(db, "users", user.uid, "history", today), {
            date: today,
            points: formData.points_total > 0 ? formData.points_total : 20, // Use existing points or default 20
            active: true
        }, { merge: true }); // Merge prevents overwriting if exists
        
        showToast("✅ History created for Today!", "success");
        setTimeout(() => window.location.reload(), 1500); // Reload to see green dot
    } catch (error) {
        console.error(error);
        showToast("Failed to create history.", "error");
    }
  };

  // 🗑️ Delete Account
  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL WARNING: This will permanently delete your account. Are you sure?")) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(auth.currentUser);
      } catch (error) {
        alert("Please logout and login again to delete your account.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (loading) return <div className="h-screen bg-[#1a1a1a] flex justify-center items-center text-white"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-200 font-sans pt-20 pb-10">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-24 right-6 px-6 py-3 rounded-lg shadow-2xl z-50 text-white font-medium animate-fade-in ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 lg:px-8 max-w-[1600px] mx-auto">

        {/* ================= LEFT SIDEBAR (Live Preview) ================= */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            
            {/* Live Profile Card */}
            <div className="bg-[#282828] rounded-xl p-6 border border-gray-700 shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="relative group">
                        <img 
                            src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full border-4 border-[#1a1a1a] shadow-lg object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#282828]"></div>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-bold text-white">
                        {formData.displayName || "User"}
                    </h2>
                    <p className="text-green-400 text-xs font-mono mt-1 mb-3">Rank: Focus Master</p>
                    
                    {formData.show_bio && formData.bio && (
                        <p className="text-gray-400 text-sm mt-2 leading-relaxed italic">"{formData.bio}"</p>
                    )}

                    {/* Dynamic Meta Details */}
                    <div className="mt-6 w-full space-y-3 text-sm text-gray-300 text-left bg-[#333] p-4 rounded-lg border border-gray-600">
                        {formData.show_location && formData.location && (
                            <div className="flex items-center gap-3"><MapPin size={16} className="text-gray-500" /><span className="truncate">{formData.location}</span></div>
                        )}
                        {formData.show_website && formData.website && (
                            <div className="flex items-center gap-3"><Globe size={16} className="text-gray-500" /><a href={formData.website} className="text-blue-400 hover:underline truncate">Website</a></div>
                        )}
                        {formData.show_github && formData.github && (
                            <div className="flex items-center gap-3"><Github size={16} className="text-gray-500" /><span className="truncate">@{formData.github}</span></div>
                        )}
                        {formData.show_linkedin && formData.linkedin && (
                            <div className="flex items-center gap-3"><Linkedin size={16} className="text-gray-500" /><span className="truncate">/in/{formData.linkedin}</span></div>
                        )}
                        {formData.show_twitter && formData.twitter && (
                            <div className="flex items-center gap-3"><Twitter size={16} className="text-gray-500" /><span className="truncate">@{formData.twitter}</span></div>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
                <button onClick={() => setActiveTab('basic')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'basic' ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-500' : 'text-gray-400 hover:bg-[#282828] hover:text-white'}`}>
                    <User size={18} /> Basic Info
                </button>
                <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === 'account' ? 'bg-blue-600/10 text-blue-500 border-l-2 border-blue-500' : 'text-gray-400 hover:bg-[#282828] hover:text-white'}`}>
                    <SettingsIcon size={18} /> Account
                </button>
            </nav>
        </div>

        {/* ================= RIGHT CONTENT (Form) ================= */}
        <div className="flex-1">
            
            {/* TAB 1: BASIC INFO */}
            {activeTab === 'basic' && (
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Basic Info</h2>
                        <span className="text-xs text-gray-400 italic">Toggle the switch to show/hide on profile</span>
                    </div>
                    
                    <div className="p-0">
                        {/* Avatar Row */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 hover:bg-gray-50 transition">
                            <label className="text-sm font-semibold text-gray-500 w-1/4">Avatar</label>
                            <div className="flex-1 flex items-center gap-4">
                                <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} alt="Avatar" className="w-16 h-16 rounded-xl border object-cover"/>
                                <span className="text-sm text-gray-500 italic">Using Google Account Photo</span>
                            </div>
                        </div>

                        {/* Input Rows */}
                        <FormRow label="Name" name="displayName" value={formData.displayName} onChange={handleChange} />
                        <FormRow label="Location" name="location" value={formData.location} onChange={handleChange} toggleName="show_location" isVisible={formData.show_location} onToggle={handleToggle} />
                        <FormRow label="Bio / Headline" name="bio" value={formData.bio} onChange={handleChange} type="textarea" placeholder="Tell us about yourself..." toggleName="show_bio" isVisible={formData.show_bio} onToggle={handleToggle} />
                        <FormRow label="Website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." toggleName="show_website" isVisible={formData.show_website} onToggle={handleToggle} />
                        
                        <div className="bg-gray-50 p-6 border-t border-gray-100 mt-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Social Links</h3>
                            <FormRow label="GitHub" name="github" value={formData.github} onChange={handleChange} placeholder="username" toggleName="show_github" isVisible={formData.show_github} onToggle={handleToggle} />
                            <FormRow label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="username" toggleName="show_linkedin" isVisible={formData.show_linkedin} onToggle={handleToggle} />
                            <FormRow label="Twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="username" toggleName="show_twitter" isVisible={formData.show_twitter} onToggle={handleToggle} />
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-md font-bold shadow-md flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>} 
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* TAB 2: ACCOUNT */}
            {activeTab === 'account' && (
                <div className="space-y-6">
                     {/* 1. Account Details */}
                     <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Account Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 flex items-center gap-2"><Key size={16}/> User ID</span>
                                <span className="text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{user?.uid}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar size={16}/> Joined On</span>
                                <span className="text-gray-900 font-medium">{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-500 flex items-center gap-2"><Shield size={16}/> Email Status</span>
                                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Verified</span>
                            </div>
                        </div>
                     </div>

                     {/* 2. DEVELOPER ZONE (Tools for Testing) */}
                     <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                        <h2 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><Wrench size={20}/> Developer Zone</h2>
                        
                        <div className="space-y-3">
                            {/* Seed Button */}
                            <div className="flex items-center justify-between bg-white p-3 rounded border border-blue-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Seed Last 365 Days</p>
                                    <p className="text-xs text-gray-500">Fills empty graph with random data.</p>
                                </div>
                                <button 
                                    onClick={() => seedDatabase(user.uid)} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                                >
                                    🚀 Seed Data
                                </button>
                            </div>

                            {/* Force Today Button */}
                            <div className="flex items-center justify-between bg-white p-3 rounded border border-blue-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-800">Force "Green Dot" Today</p>
                                    <p className="text-xs text-gray-500">Creates today's history entry immediately.</p>
                                </div>
                                <button 
                                    onClick={forceCreateHistory} 
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                                >
                                    ✅ Fix Today
                                </button>
                            </div>
                        </div>
                     </div>

                     {/* 3. Danger Zone */}
                     <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                        <h2 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
                        <p className="text-sm text-red-600 mb-6">
                            Deleting your account is permanent. All focus data and points will be lost.
                        </p>
                        <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 shadow-sm">
                            <Trash2 size={16}/> Delete My Account
                        </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Reuse FormRow Component (Cleaner)
const FormRow = ({ label, name, value, onChange, placeholder, type = "text", toggleName, isVisible, onToggle }) => (
    <div className="flex flex-col md:flex-row md:items-start p-6 border-b border-gray-100 hover:bg-gray-50 transition group">
        <label className="text-sm font-semibold text-gray-500 w-full md:w-1/4 mb-2 md:mb-0 pt-2">{label}</label>
        <div className="flex-1 w-full">
            {type === 'textarea' ? (
                <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows="3" className="w-full bg-transparent text-gray-900 border border-gray-300 rounded p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition" />
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-transparent text-gray-900 border-b border-transparent group-hover:border-gray-300 focus:border-blue-500 p-2 outline-none transition placeholder-gray-400" />
            )}
        </div>
        {toggleName && (
            <div className="flex items-center gap-4 ml-4 mt-2 md:mt-0">
                <div className="flex flex-col items-center gap-1 cursor-pointer group/toggle" onClick={() => onToggle(toggleName)}>
                    <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${isVisible ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>
        )}
        {!toggleName && <div className="hidden md:block w-10 text-right pt-2 text-gray-300"><ChevronRight size={16} /></div>}
    </div>
);

export default Settings;