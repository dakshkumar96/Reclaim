import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './Components/ProtectedRoute';
import ErrorBoundary from './Components/ErrorBoundary';
import Navbar from './Components/Navbar';
import Header from './Components/Header';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Dashboard from './Pages/Dashboard';
import Challenges from './Pages/Challenges';
import Leaderboard from './Pages/Leaderboard';
import ChatAI from './Pages/ChatAI';
import Profile from './Pages/Profile';

function App() {
  try {
    return (
      <ErrorBoundary>
        <UserProvider>
          <Router>
            <div className="min-h-screen" style={{ backgroundColor: '#0C0C0C', color: '#F8F8F8' }}>
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/challenges"
                  element={
                    <ProtectedRoute>
                      <Challenges />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <Leaderboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <ChatAI />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
              <Navbar />
            </div>
          </Router>
        </UserProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App render error:', error);
    return (
      <div style={{ padding: '20px', color: '#F8F8F8', backgroundColor: '#0C0C0C', minHeight: '100vh' }}>
        <h1>Error loading app</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}

export default App;
