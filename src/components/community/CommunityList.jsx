import React, { useState, useEffect } from 'react';
import { db, auth } from '../../config/firebase'; 
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Users, ArrowRight, X } from 'lucide-react';

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
      alert('Failed to create community');
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Action Bar */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-400 font-medium">{communities.length} Active Communities</span>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-all duration-200"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create New
        </button>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <div 
            key={community.id} 
            className="group bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:bg-[#1f1f1f] transition-all duration-300 cursor-pointer"
            onClick={() => onJoinClick(community.id)}
          >
            {/* Community Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl flex items-center justify-center mb-4 border border-green-500/20">
              <Users size={22} className="text-green-500" />
            </div>
            
            {/* Content */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
              {community.name}
            </h3>
            <p className="text-sm text-gray-500 mb-5 line-clamp-2 min-h-[40px]">
              {community.description || 'No description yet'}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <span className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                {community.memberCount || 0} members
              </span>
              <div className="flex items-center gap-1 text-xs font-medium text-gray-500 group-hover:text-green-400 transition-colors">
                Enter
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {communities.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] border border-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-400 mb-1 font-medium">No communities yet</p>
            <p className="text-sm text-gray-600">Be the first to create one</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-lg font-semibold text-white">Create Community</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateCommunity} className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-400 mb-2">Community Name</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Deep Focus Club"
                  className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none transition-colors text-sm"
                  required 
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="What's this community about?"
                  rows={3}
                  className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none transition-colors text-sm resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-800 text-gray-400 font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-lg bg-green-500 text-black font-semibold text-sm hover:bg-green-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}