import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings'; 
import Rankings from './pages/Rankings'; 
import Community from './pages/Community'; // 👈 IMPORT THE NEW PAGE

const AppContent = () => {
  const { user } = useAuth();
  
  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/community" element={<Community />} /> {/* 👈 NEW ROUTE */}
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      {/* ❌ REMOVED the hardcoded CommunityList from here */}
    </Router>
  );
}

export default App;