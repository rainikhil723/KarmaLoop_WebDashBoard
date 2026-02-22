import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../config/firebase';
import { doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { updateProfile, deleteUser } from 'firebase/auth';
import { seedDatabase } from '../hooks/useHistory'; 
import { 
  User, Settings as SettingsIcon, Trash2, 
  ChevronRight, Save, MapPin, Globe, 
  Github, Linkedin, Twitter, Shield, Calendar, Key, Loader2, Wrench, Zap
} from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, formData);
      
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }
      showToast("Identity configuration synchronized.", "success");
    } catch (error) {
      showToast("Synchronization failed.", "error");
    }
    setSaving(false);
  };

  const forceCreateHistory = async () => {
    if(!user) return;
    const today = new Date().toISOString().split('T')[0];
    
    try {
        await setDoc(doc(db, "users", user.uid, "history", today), {
            date: today,
            points: formData.points_total > 0 ? formData.points_total : 20,
            active: true
        }, { merge: true }); 
        
        showToast("System history overwritten for current cycle.", "success");
        setTimeout(() => window.location.reload(), 1500); 
    } catch (error) {
        console.error(error);
        showToast("History overwrite failed.", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("CRITICAL WARNING: This action is irreversible. Proceed with account termination?")) {
      try {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(auth.currentUser);
      } catch (error) {
        alert("Session expired. Re-authenticate to terminate account.");
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

  if (loading) return <div className="h-screen bg-[#050505] flex justify-center items-center"><Loader2 className="animate-spin text-pink-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-32 pb-20 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {toast.show && (
        <div className={`fixed top-24 right-8 px-6 py-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 text-white font-bold text-sm tracking-wide border backdrop-blur-xl animate-in slide-in-from-top-10 fade-in ${toast.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-100' : 'bg-green-500/20 border-green-500/50 text-green-100'}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row gap-8 px-4 md:px-8 max-w-[1400px] mx-auto relative z-10">

        <div className="w-full lg:w-96 flex-shrink-0 space-y-8">
            
            <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-pink-500/20 to-purple-600/20 blur-2xl"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="relative group">
                        <img 
                            src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                            alt="Profile" 
                            className="w-28 h-28 rounded-2xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] object-cover bg-[#111]"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-[#0a0a0a] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    
                    <h2 className="mt-6 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                        {formData.displayName || "Operator"}
                    </h2>
                    
                    <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full mt-3 flex items-center gap-2">
                      <Shield size={12} className="text-pink-400" />
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Active Status</p>
                    </div>
                    
                    {formData.show_bio && formData.bio && (
                        <p className="text-white/40 text-sm mt-6 font-medium leading-relaxed max-w-[250px] mx-auto">"{formData.bio}"</p>
                    )}

                    <div className="mt-8 w-full space-y-4 text-sm text-white/50 text-left bg-white/5 p-5 rounded-2xl border border-white/5">
                        {formData.show_location && formData.location && (
                            <div className="flex items-center gap-4"><MapPin size={16} className="text-cyan-400" /><span className="truncate">{formData.location}</span></div>
                        )}
                        {formData.show_website && formData.website && (
                            <div className="flex items-center gap-4"><Globe size={16} className="text-purple-400" /><a href={formData.website} className="hover:text-white transition-colors truncate">{formData.website.replace(/^https?:\/\//, '')}</a></div>
                        )}
                        {formData.show_github && formData.github && (
                            <div className="flex items-center gap-4"><Github size={16} className="text-white" /><span className="truncate">@{formData.github}</span></div>
                        )}
                        {formData.show_linkedin && formData.linkedin && (
                            <div className="flex items-center gap-4"><Linkedin size={16} className="text-blue-500" /><span className="truncate">/in/{formData.linkedin}</span></div>
                        )}
                        {formData.show_twitter && formData.twitter && (
                            <div className="flex items-center gap-4"><Twitter size={16} className="text-sky-400" /><span className="truncate">@{formData.twitter}</span></div>
                        )}
                    </div>
                </div>
            </div>

            <nav className="flex flex-col gap-2 bg-[#0a0a0a] p-3 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <button onClick={() => setActiveTab('basic')} className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold rounded-2xl transition-all ${activeTab === 'basic' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                    <User size={18} className={activeTab === 'basic' ? "text-pink-400" : ""} /> Identity Profile
                </button>
                <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-bold rounded-2xl transition-all ${activeTab === 'account' ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                    <SettingsIcon size={18} className={activeTab === 'account' ? "text-purple-400" : ""} /> System Configuration
                </button>
            </nav>
        </div>

        <div className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col">
            
            {activeTab === 'basic' && (
                <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h2 className="text-2xl font-black text-white tracking-tight">Identity Profile</h2>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Visibility Toggles</span>
                    </div>
                    
                    <div className="p-4 sm:p-8 space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white/5 rounded-2xl border border-white/5 mb-6">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 sm:mb-0 w-1/4">Avatar Source</label>
                            <div className="flex-1 flex items-center gap-4">
                                <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} alt="Avatar" className="w-14 h-14 rounded-xl border border-white/10 object-cover"/>
                                <span className="text-xs font-semibold text-white/30 tracking-wide">Linked via Auth Provider</span>
                            </div>
                        </div>

                        <FormRow label="Designation" name="displayName" value={formData.displayName} onChange={handleChange} />
                        <FormRow label="Coordinates" name="location" value={formData.location} onChange={handleChange} toggleName="show_location" isVisible={formData.show_location} onToggle={handleToggle} />
                        <FormRow label="Biography" name="bio" value={formData.bio} onChange={handleChange} type="textarea" placeholder="Enter log entry..." toggleName="show_bio" isVisible={formData.show_bio} onToggle={handleToggle} />
                        <FormRow label="Web Portal" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." toggleName="show_website" isVisible={formData.show_website} onToggle={handleToggle} />
                        
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <h3 className="text-[10px] font-black text-white/20 mb-6 uppercase tracking-widest pl-6">External Networks</h3>
                            <div className="space-y-2">
                              <FormRow label="GitHub" name="github" value={formData.github} onChange={handleChange} placeholder="username" toggleName="show_github" isVisible={formData.show_github} onToggle={handleToggle} />
                              <FormRow label="LinkedIn" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="username" toggleName="show_linkedin" isVisible={formData.show_linkedin} onToggle={handleToggle} />
                              <FormRow label="Twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="username" toggleName="show_twitter" isVisible={formData.show_twitter} onToggle={handleToggle} />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end mt-auto">
                        <button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-8 py-3.5 rounded-xl font-black text-sm tracking-wide flex items-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:transform-none">
                            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>} 
                            {saving ? 'Synchronizing...' : 'Commit Changes'}
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'account' && (
                <div className="p-8 space-y-8">
                     <div className="bg-white/5 rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                        <h2 className="text-lg font-black text-white mb-8 flex items-center gap-3 relative z-10"><Shield className="text-cyan-400" size={20}/> Core Protocol</h2>
                        <div className="space-y-6 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-4">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><Key size={14} className="text-white/20"/> Unique Identifier</span>
                                <span className="text-white/80 font-mono text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-white/10">{user?.uid}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-4">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><Calendar size={14} className="text-white/20"/> Initialization Date</span>
                                <span className="text-white font-bold text-sm">{formData.createdAt ? new Date(formData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2"><Shield size={14} className="text-white/20"/> Auth Status</span>
                                <span className="text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">Verified</span>
                            </div>
                        </div>
                     </div>

                     <div className="bg-cyan-500/5 rounded-3xl p-8 border border-cyan-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
                        <h2 className="text-lg font-black text-cyan-400 mb-6 flex items-center gap-3 relative z-10"><Wrench size={20}/> Developer Access</h2>
                        
                        <div className="space-y-4 relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 gap-4">
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Synthesize Historical Data</p>
                                    <p className="text-xs font-semibold text-white/40">Populates the matrix with 365 days of randomized activity.</p>
                                </div>
                                <button 
                                    onClick={() => seedDatabase(user.uid)} 
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
                                >
                                    Execute Script
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0a0a0a]/50 p-5 rounded-2xl border border-white/5 gap-4">
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Force Activity Override</p>
                                    <p className="text-xs font-semibold text-white/40">Forces a successful log entry for the current cycle.</p>
                                </div>
                                <button 
                                    onClick={forceCreateHistory} 
                                    className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2"
                                >
                                    <Zap size={14}/> Override Cycle
                                </button>
                            </div>
                        </div>
                     </div>

                     <div className="bg-red-500/5 rounded-3xl p-8 border border-red-500/10">
                        <h2 className="text-lg font-black text-red-500 mb-2">Danger Zone</h2>
                        <p className="text-xs font-bold text-red-400/70 mb-6 uppercase tracking-wide">
                            Account termination is irreversible. All matrix data will be permanently purged.
                        </p>
                        <button onClick={handleDeleteAccount} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-3 transition-colors">
                            <Trash2 size={18}/> Terminate Account
                        </button>
                     </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const FormRow = ({ label, name, value, onChange, placeholder, type = "text", toggleName, isVisible, onToggle }) => (
    <div className="flex flex-col lg:flex-row lg:items-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl group transition-all hover:bg-white/[0.04]">
        <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest w-full lg:w-1/4 mb-3 lg:mb-0 shrink-0">{label}</label>
        <div className="flex-1 w-full relative">
            {type === 'textarea' ? (
                <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows="3" className="w-full bg-[#050505] text-white border border-white/10 rounded-xl p-4 focus:border-pink-500/50 outline-none transition-colors placeholder:text-white/20 font-medium text-sm shadow-inner resize-none" />
            ) : (
                <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-[#050505] text-white border border-white/10 rounded-xl p-4 focus:border-pink-500/50 outline-none transition-colors placeholder:text-white/20 font-medium text-sm shadow-inner" />
            )}
        </div>
        {toggleName && (
            <div className="flex items-center gap-4 lg:ml-6 mt-4 lg:mt-0 shrink-0">
                <div 
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 border ${isVisible ? 'bg-pink-500/20 border-pink-500/50' : 'bg-[#050505] border-white/10'}`} 
                  onClick={() => onToggle(toggleName)}
                >
                    <div className={`absolute top-[3px] left-[3px] w-[16px] h-[16px] rounded-full transition-all duration-300 ${isVisible ? 'translate-x-6 bg-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]' : 'translate-x-0 bg-white/30'}`}></div>
                </div>
            </div>
        )}
    </div>
);

export default Settings;