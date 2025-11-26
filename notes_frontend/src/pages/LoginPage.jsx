import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../services/authApi';
import { saveAuth } from '../services/auth';

/**
 * PUBLIC_INTERFACE
 * LoginPage - Email/password login, saves token and redirects to /notes
 */
export default function LoginPage({ onAuthed }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/notes';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      // Expecting res like { access_token, token, user, ... }
      const token = res?.access_token || res?.token || res?.jwt || '';
      if (!token) throw new Error('Missing token from server');
      saveAuth(token, res?.user || null);
      onAuthed?.();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Welcome back</div>
            <div className="card-sub">Login to manage your notes</div>
          </div>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="helper">Use your registered email address.</div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          New here? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
