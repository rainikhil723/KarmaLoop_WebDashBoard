// src/components/community/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ArrowLeft, Send, Shield } from 'lucide-react';

export default function ChatRoom({ communityId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [myIdentity, setMyIdentity] = useState(null);
  const [communityName, setCommunityName] = useState('');
  const dummyScroll = useRef();
  const inputRef = useRef();

  // Fetch community name
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

  // Fetch user identity
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

  // Listen to messages
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
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-[#1a1a1a] border-b border-gray-800">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0f0f0f] border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-400" />
        </button>
        <div className="flex-1">
          <h2 className="text-white font-semibold">{communityName || 'Chat Room'}</h2>
          <p className="text-xs text-gray-500">{messages.length} messages</p>
        </div>
        {myIdentity?.isAnonymous && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
            <Shield size={14} className="text-green-500" />
            <span className="text-xs text-gray-400">Anonymous Mode</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[#1a1a1a] border border-gray-800 rounded-2xl flex items-center justify-center mb-4">
              <Send size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium mb-1">No messages yet</p>
            <p className="text-sm text-gray-600">Be the first to start the conversation</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === auth.currentUser?.uid;
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] md:max-w-[60%] ${isMe ? 'order-1' : ''}`}>
                {/* Sender Info */}
                <div className={`flex items-center gap-2 mb-1.5 ${isMe ? 'justify-end' : ''}`}>
                  <span className={`text-xs font-medium ${isMe ? 'text-green-500' : 'text-gray-500'}`}>
                    {msg.senderName}
                  </span>
                  {msg.isAnonymous && (
                    <Shield size={10} className="text-gray-600" />
                  )}
                  <span className="text-[10px] text-gray-700">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div 
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-green-500 text-black rounded-br-md' 
                      : 'bg-[#1a1a1a] text-gray-200 border border-gray-800 rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={dummyScroll}></div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 bg-[#1a1a1a] border-t border-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input 
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl px-5 py-3.5 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none transition-colors text-sm pr-12"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="w-12 h-12 flex items-center justify-center bg-green-500 text-black rounded-xl hover:bg-green-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-700 mt-3">
          Chatting as <span className="text-gray-500 font-medium">{myIdentity?.displayName}</span>
          {myIdentity?.isAnonymous && ' · Anonymous'}
        </p>
      </div>
    </div>
  );
}
