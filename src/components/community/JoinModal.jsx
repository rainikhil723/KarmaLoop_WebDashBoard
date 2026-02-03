import React, { useState } from 'react';
import { User, Shield, X, ArrowRight } from 'lucide-react';

export default function JoinModal({ isOpen, onClose, onConfirm, userOriginalName }) {
  const [mode, setMode] = useState('real');
  const [anonName, setAnonName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mode === 'real') {
      onConfirm({ name: userOriginalName, isAnonymous: false });
    } else {
      if (!anonName.trim()) return alert("Please choose a name");
      onConfirm({ name: anonName, isAnonymous: true });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-semibold text-white">Join Community</h2>
            <p className="text-xs text-gray-500 mt-0.5">Choose how you want to appear</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-3">
          {/* Real Identity Option */}
          <button 
            onClick={() => setMode('real')}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
              mode === 'real' 
                ? 'bg-green-500/10 border-green-500/50' 
                : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                mode === 'real' ? 'bg-green-500/20' : 'bg-gray-800'
              }`}>
                <User size={18} className={mode === 'real' ? 'text-green-500' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${mode === 'real' ? 'text-white' : 'text-gray-300'}`}>
                    {userOriginalName}
                  </span>
                  {mode === 'real' && (
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-medium">
                      SELECTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Your verified profile identity</p>
              </div>
            </div>
          </button>

          {/* Anonymous Option */}
          <button 
            onClick={() => setMode('anonymous')}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
              mode === 'anonymous' 
                ? 'bg-green-500/10 border-green-500/50' 
                : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                mode === 'anonymous' ? 'bg-green-500/20' : 'bg-gray-800'
              }`}>
                <Shield size={18} className={mode === 'anonymous' ? 'text-green-500' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${mode === 'anonymous' ? 'text-white' : 'text-gray-300'}`}>
                    Anonymous Mode
                  </span>
                  {mode === 'anonymous' && (
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-medium">
                      SELECTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Chat with a custom alias</p>
              </div>
            </div>
          </button>

          {/* Anonymous Name Input */}
          {mode === 'anonymous' && (
            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Choose Your Alias</label>
              <input 
                type="text" 
                placeholder="e.g. NightOwl, FocusMaster"
                value={anonName}
                onChange={(e) => setAnonName(e.target.value)}
                autoFocus
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none transition-colors text-sm"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-800 text-gray-400 font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 rounded-lg bg-green-500 text-black font-semibold text-sm hover:bg-green-400 transition-colors flex items-center justify-center gap-2"
          >
            Join Chat
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}