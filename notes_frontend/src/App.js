import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';
import { getToken, clearAuth } from './services/auth';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const [isAuthed, setIsAuthed] = useState(!!getToken());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    clearAuth();
    setIsAuthed(false);
  };

  return (
    <div className="App">
      <Router>
        <header className="navbar">
          <div className="navbar-inner">
            <Link to="/" className="brand">
              Notes Pro
            </Link>
            <nav className="nav-links">
              {!isAuthed ? (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link to="/register" className="nav-link btn btn-amber">Register</Link>
                </>
              ) : (
                <>
                  <Link to="/notes" className="nav-link">My Notes</Link>
                  <button className="nav-link btn btn-outline" onClick={handleLogout}>Logout</button>
                </>
              )}
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </nav>
          </div>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to={isAuthed ? '/notes' : '/login'} replace />} />
            <Route path="/login" element={<LoginPage onAuthed={() => setIsAuthed(true)} />} />
            <Route path="/register" element={<RegisterPage onAuthed={() => setIsAuthed(true)} />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute isAuthenticated={isAuthed}>
                  <NotesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">© {new Date().getFullYear()} Notes Pro</footer>
      </Router>
    </div>
  );
}

export default App;
