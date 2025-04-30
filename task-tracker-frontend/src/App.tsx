import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ValueRank from './pages/ValueRank';
import { AuthProvider } from './context/auth/AuthContext';
import { RankingProvider } from './context/ranking/RankingContext';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  console.log('App - Rendering with routes');
  
  return (
    <AuthProvider>
      <RankingProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/valuerank" element={<ValueRank />} />
              </Routes>
            </div>
          </div>
        </Router>
      </RankingProvider>
    </AuthProvider>
  );
};

export default App;
