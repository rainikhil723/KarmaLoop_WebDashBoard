import React, { useState } from 'react';
import { User, Shield, X, ArrowRight, Fingerprint } from 'lucide-react';

export default function JoinModal({ isOpen, onClose, onConfirm, userOriginalName }) {
  const [mode, setMode] = useState('real');
  const [anonName, setAnonName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mode === 'real') {
      onConfirm({ name: userOriginalName, isAnonymous: false });
    } else {
      if (!anonName.trim()) return alert("Alias is required for Ghost Protocol.");
      onConfirm({ name: anonName, isAnonymous: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4" style={{ animation: 'modalEntry 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Identity Configuration</h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Select broadcast signature</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-90 transition-all duration-300"
          >
            <X size={18} className="text-white/50" />
          </button>
        </div>

        <div className="p-8 space-y-4 relative z-10">
          <button 
            onClick={() => setMode('real')}
            className={`w-full p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group ${
              mode === 'real' 
                ? 'bg-gradient-to-r from-cyan-500/10 to-transparent border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                : 'bg-[#111] border-white/5 hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              mode === 'real' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/30 group-hover:text-white/50'
            }`}>
              <Fingerprint size={24} />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-3">
                <span className={`font-black text-lg tracking-tight ${mode === 'real' ? 'text-white' : 'text-white/60'}`}>
                  {userOriginalName}
                </span>
                {mode === 'real' && (
                  <span className="text-[9px] font-bold bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-md uppercase tracking-widest">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-white/40 mt-1">Standard operator profile</p>
            </div>
          </button>

          <button 
            onClick={() => setMode('anonymous')}
            className={`w-full p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 group ${
              mode === 'anonymous' 
                ? 'bg-gradient-to-r from-purple-500/10 to-transparent border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                : 'bg-[#111] border-white/5 hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
              mode === 'anonymous' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/30 group-hover:text-white/50'
            }`}>
              <Shield size={24} />
            </div>
            <div className="text-left flex-1">
              <div className="flex items-center gap-3">
                <span className={`font-black text-lg tracking-tight ${mode === 'anonymous' ? 'text-white' : 'text-white/60'}`}>
                  Ghost Protocol
                </span>
                {mode === 'anonymous' && (
                  <span className="text-[9px] font-bold bg-purple-500/20 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded-md uppercase tracking-widest">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-white/40 mt-1">Encrypted alias mask</p>
            </div>
          </button>

          {mode === 'anonymous' && (
            <div className="pt-4 pb-2 animate-in fade-in slide-in-from-top-2">
              <label className="flex text-[10px] font-bold text-white/40 uppercase tracking-widest pl-1 mb-2">Assign Alias</label>
              <input 
                type="text" 
                placeholder="e.g. Cipher, Null"
                value={anonName}
                onChange={(e) => setAnonName(e.target.value)}
                autoFocus
                className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:border-purple-500/50 focus:bg-white/5 focus:outline-none transition-all duration-300 text-sm shadow-inner"
              />
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-white/5 flex gap-4 relative z-10 bg-white/[0.02]">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-xl border border-white/10 text-white/40 font-bold text-sm hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className={`flex-1 px-6 py-4 rounded-xl font-black tracking-wide text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-3 shadow-lg ${
              mode === 'real'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'
            }`}
          >
            Establish Link
            <ArrowRight size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
      <style>{`@keyframes modalEntry { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
    </div>
  );
}