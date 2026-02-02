import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings'; // 👈 Import kiya
import Rankings from './pages/Rankings'; // 👈 Rankings page

const AppContent = () => {
  const { user } = useAuth();
  
  if (!user) return <Login />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} /> {/* 👈 Naya Route */}
      <Route path="/rankings" element={<Rankings />} /> {/* 👈 Rankings Route */}
    </Routes>
  );
};

function App() {
  return (
    <Router> {/* Router zaroori hai ab navigation ke liye */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;