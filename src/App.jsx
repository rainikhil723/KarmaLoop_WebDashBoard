import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DevAuthProvider } from './context/DevAuthContext'; // 🔐 Developer mode gating

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings'; 
import Rankings from './pages/Rankings'; 
import Community from './pages/Community';

const AppContent = () => {
  const { user } = useAuth();
  
  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/rankings" element={<Rankings />} />
      <Route path="/community" element={<Community />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* 🔐 DevAuthProvider wraps everything so any component can check isDevMode */}
        <DevAuthProvider>
          <AppContent />
        </DevAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;