import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authApi';
import { saveAuth } from '../services/auth';

/**
 * PUBLIC_INTERFACE
 * RegisterPage - Email/password registration, then logs in user
 */
export default function RegisterPage({ onAuthed }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setSubmitting(true);
    try {
      const res = await register({ email, password });
      const token = res?.access_token || res?.token || res?.jwt || '';
      if (!token) throw new Error('Missing token from server');
      saveAuth(token, res?.user || null);
      onAuthed?.();
      navigate('/notes', { replace: true });
    } catch (err) {
      setError(err?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Create your account</div>
            <div className="card-sub">Start writing smarter notes</div>
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
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
            <div className="helper">At least 6 characters.</div>
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              className="input"
              type="password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
            />
          </div>
          {error && <div className="error" role="alert">{error}</div>}
          <button className="btn btn-amber" type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div style={{ marginTop: 12, fontSize: 14 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
