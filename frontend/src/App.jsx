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

function App() {
  // #region agent log
  try {
    const logData = {
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'ALL',
      location: 'App.jsx:19',
      message: 'App component rendering',
      data: {},
      timestamp: Date.now()
    };
    fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(() => {});
  } catch (e) {}
  // #endregion
  try {
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
  } catch (error) {
    // #region agent log
    try {
      const logData = {
        sessionId: 'debug-session',
        runId: 'run1',
        hypothesisId: 'ALL',
        location: 'App.jsx:82',
        message: 'ERROR: App render error caught',
        data: { error: error.message, stack: error.stack },
        timestamp: Date.now()
      };
      fetch('http://127.0.0.1:7242/ingest/6c94317b-78aa-4ebc-9196-bd2f0cc47f34', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
      }).catch(() => {});
    } catch (e) {}
    // #endregion
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
