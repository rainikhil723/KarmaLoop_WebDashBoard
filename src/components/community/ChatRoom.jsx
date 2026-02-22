import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Shield, Zap } from 'lucide-react';

export default function ChatRoom({ communityId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [myIdentity, setMyIdentity] = useState(null);
  const [communityName, setCommunityName] = useState('');
  const dummyScroll = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const fetchCommunity = async () => {
      const communityRef = doc(db, 'communities', communityId);
      const snap = await getDoc(communityRef);
      if (snap.exists()) {
        setCommunityName(snap.data().name);
      }
    };
    fetchCommunity();
  }, [communityId]);

  useEffect(() => {
    const fetchIdentity = async () => {
      const userId = auth.currentUser.uid;
      const memberRef = doc(db, 'communities', communityId, 'members', userId);
      const snap = await getDoc(memberRef);
      if (snap.exists()) {
        setMyIdentity(snap.data());
      }
    };
    fetchIdentity();
  }, [communityId]);

  useEffect(() => {
    const messagesRef = collection(db, 'communities', communityId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => {
        dummyScroll.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [communityId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !myIdentity) return;

    await addDoc(collection(db, 'communities', communityId, 'messages'), {
      text: newMessage,
      timestamp: serverTimestamp(),
      senderId: auth.currentUser.uid,
      senderName: myIdentity.displayName, 
      isAnonymous: myIdentity.isAnonymous
    });

    setNewMessage('');
    inputRef.current?.focus();
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-20 flex items-center justify-between px-6 py-5 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft size={18} className="text-white/70" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              {communityName || 'Encrypted Channel'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{messages.length} Transmissions</p>
            </div>
          </div>
        </div>

        {myIdentity?.isAnonymous && (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Shield size={14} className="text-purple-400" />
            <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Ghost Protocol</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 py-8 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-6 rotate-12">
              <Zap size={32} className="text-white/40" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">Channel Initialized</h3>
            <p className="text-sm text-white/40 font-medium">Commence the transmission.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
            >
              <div className={`flex flex-col max-w-[85%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
                
                <div className="flex items-center gap-2 mb-2 px-1">
                  {!isMe && msg.isAnonymous && <Shield size={10} className="text-purple-400" />}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-pink-400' : 'text-cyan-400'}`}>
                    {msg.senderName}
                  </span>
                  <span className="text-[9px] font-bold text-white/20">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                
                <div 
                  className={`px-5 py-3.5 text-sm font-medium leading-relaxed shadow-lg backdrop-blur-md ${
                    isMe 
                      ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl rounded-tr-sm shadow-[0_5px_20px_rgba(236,72,153,0.3)]' 
                      : 'bg-[#111] border border-white/10 text-white/90 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={dummyScroll} className="h-4"></div>
      </div>

      <div className="relative z-20 px-4 md:px-8 py-5 bg-[#0a0a0a]/80 backdrop-blur-2xl border-t border-white/10">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Transmit message..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/20 focus:border-pink-500/50 focus:bg-white/10 focus:outline-none transition-all duration-300 text-sm shadow-inner"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="w-14 h-14 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-30 disabled:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
        <div className="max-w-5xl mx-auto flex justify-center mt-3">
           <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">
             Identity Protocol: <span className="text-white/60">{myIdentity?.displayName}</span>
             {myIdentity?.isAnonymous && <span className="text-purple-400 ml-1">[GHOST]</span>}
           </p>
        </div>
      </div>
    </div>
  );
}