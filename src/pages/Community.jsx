// src/pages/Community.jsx
import React, { useState } from 'react';
import { db, auth } from "../config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import Navbar from '../components/Navbar';

import CommunityList from '../components/community/CommunityList';
import JoinModal from '../components/community/JoinModal';
import ChatRoom from '../components/community/ChatRoom';

const Community = () => {
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  const handleTryJoin = async (communityId) => {
    if (!auth.currentUser) return alert("Please login first");

    const userId = auth.currentUser.uid;
    const memberRef = doc(db, 'communities', communityId, 'members', userId);
    const memberSnap = await getDoc(memberRef);

    if (memberSnap.exists()) {
      setActiveCommunity(communityId);
    } else {
      setSelectedCommunityId(communityId);
      setShowJoinModal(true);
    }
  };

  const handleConfirmJoin = async (identity) => {
    const userId = auth.currentUser.uid;
    
    try {
      await setDoc(doc(db, 'communities', selectedCommunityId, 'members', userId), {
        displayName: identity.name,
        isAnonymous: identity.isAnonymous,
        joinedAt: serverTimestamp(),
      });

      setShowJoinModal(false);
      setActiveCommunity(selectedCommunityId);
      
    } catch (error) {
      console.error("Error joining:", error);
      alert("Could not join community");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {!activeCommunity && <Navbar />}

      {activeCommunity ? (
        <ChatRoom 
          communityId={activeCommunity} 
          onBack={() => setActiveCommunity(null)} 
        />
      ) : (
        <div className="px-4 py-8 md:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-2">Connect & Collaborate</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Communities</h1>
              <p className="text-gray-400 text-lg max-w-xl">Join focused groups, share progress, and stay accountable with like-minded individuals.</p>
            </div>
            
            <CommunityList onJoinClick={handleTryJoin} />
          </div>
          
          <JoinModal 
            isOpen={showJoinModal} 
            onClose={() => setShowJoinModal(false)}
            onConfirm={handleConfirmJoin}
            userOriginalName={auth.currentUser?.displayName || "User"}
          />
        </div>
      )}
    </div>
  );
};

export default Community;