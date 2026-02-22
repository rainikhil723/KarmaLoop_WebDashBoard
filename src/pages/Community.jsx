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
      console.error(error);
      alert("Could not join community");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden flex flex-col">
      {!activeCommunity && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none"></div>
          <Navbar />
        </>
      )}

      {activeCommunity ? (
        <ChatRoom 
          communityId={activeCommunity} 
          onBack={() => setActiveCommunity(null)} 
        />
      ) : (
        <div className="pt-32 pb-16 px-4 md:px-8 lg:px-16 flex-1 relative z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-16 text-center md:text-left flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <p className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase">Connect & Collaborate</p>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 mb-6">
                The Network
              </h1>
              <p className="text-white/40 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                Join focused syndicates, share your progress, and maintain accountability alongside elite operators.
              </p>
            </div>
            
            <CommunityList onJoinClick={handleTryJoin} />
          </div>
          
          <JoinModal 
            isOpen={showJoinModal} 
            onClose={() => setShowJoinModal(false)}
            onConfirm={handleConfirmJoin}
            userOriginalName={auth.currentUser?.displayName || "Operator"}
          />
        </div>
      )}
    </div>
  );
};

export default Community;