import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './Components/ProtectedRoute';
import ErrorBoundary from './Components/ErrorBoundary';
import PageTransition from './Components/PageTransition';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Homepage from './Pages/Homepage';
import Dashboard from './Pages/Dashboard';
import Challenges from './Pages/Challenges';
import ChallengeDetail from './Pages/ChallengeDetail';
import Leaderboard from './Pages/Leaderboard';
import ChatAI from './Pages/ChatAI';
import Profile from './Pages/Profile';
import About from './Pages/About';
import Settings from './Pages/Settings';

function App() {
    return (
      <ErrorBoundary>
        <ToastProvider>
        <UserProvider>
          <Router>
              <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0C0C0C', color: '#F8F8F8' }}>
              <Header />
                <main className="flex-grow">
                  <PageTransition>
              <Routes>
                      <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
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
                        path="/challenges/:id"
                        element={
                          <ProtectedRoute>
                            <ChallengeDetail />
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
                <Route
                  path="/about"
                  element={<About />}
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                      <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
                  </PageTransition>
                </main>
                <Footer />
            </div>
          </Router>
        </UserProvider>
        </ToastProvider>
      </ErrorBoundary>
    );
}

export default App;
