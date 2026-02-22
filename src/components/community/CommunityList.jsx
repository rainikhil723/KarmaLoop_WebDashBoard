import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase'; 
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Users, ArrowRight, X, Hexagon } from 'lucide-react';

export default function CommunityList({ onJoinClick }) {
  const [communities, setCommunities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = collection(db, 'communities');
    
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const communityData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCommunities(communityData);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'communities'), {
        name: newName,
        description: newDesc,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        memberCount: 0 
      });

      setNewName('');
      setNewDesc('');
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert('Failed to initialize syndicate');
    }
    setLoading(false);
  };

  return (
    <div className="w-full relative z-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
          <span className="text-xs text-white/60 font-bold uppercase tracking-widest">{communities.length} Active Syndicates</span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl text-sm font-black tracking-wide hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
        >
          <Plus size={18} strokeWidth={3} />
          Initialize New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div 
            key={community.id} 
            className="group relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-500 cursor-pointer overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(6,182,212,0.15)] hover:-translate-y-1"
            onClick={() => onJoinClick(community.id)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-colors"></div>

            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors relative z-10">
              <Hexagon size={24} className="text-white/40 group-hover:text-cyan-400 transition-colors" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-500 transition-all relative z-10">
              {community.name}
            </h3>
            <p className="text-sm font-medium text-white/40 mb-8 line-clamp-2 min-h-[40px] relative z-10">
              {community.description || 'No data provided for this sector.'}
            </p>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg">
                <Users size={12} className="text-white/30" />
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                  {community.memberCount || 0} Operators
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black text-white/30 transition-all duration-300">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}

        {communities.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-[#0a0a0a] rounded-3xl border border-white/5 border-dashed">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6">
              <Hexagon size={32} className="text-white/20" />
            </div>
            <p className="text-xl font-black text-white mb-2">Network Void</p>
            <p className="text-sm font-medium text-white/40">Be the pioneer to establish the first syndicate.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 relative z-10">
              <h2 className="text-2xl font-black text-white tracking-tight">Initialize Syndicate</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-90 transition-all duration-300"
              >
                <X size={18} className="text-white/50" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="p-8 relative z-10">
              <div className="mb-6 space-y-2">
                <label className="flex text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Designation</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Protocol Alpha"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:border-cyan-500/50 focus:bg-white/5 focus:outline-none transition-all duration-300 text-sm shadow-inner"
                  required 
                />
              </div>
              <div className="mb-10 space-y-2">
                <label className="flex text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1">Directives</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Define the primary objective..."
                  rows={3}
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:border-cyan-500/50 focus:bg-white/5 focus:outline-none transition-all duration-300 text-sm resize-none shadow-inner"
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/40 font-bold text-sm hover:bg-white/5 hover:text-white transition-all"
                >
                  Abort
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black tracking-wide text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none flex items-center justify-center"
                >
                  {loading ? 'Processing...' : 'Execute'}
                </button>
              </div>
            </form>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
        </div>
      )}
    </div>
  );
}