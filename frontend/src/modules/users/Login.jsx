import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Navbar } from '../../components/Navbar.jsx';
import { useAuth } from './useAuth.js';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(form);
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar publicMode />
      <div className="auth-shell">
        <div className="auth-layout">
          <section className="auth-hero">
          <span className="eyebrow">VanLife Platform</span>
          <h1>Run camper van rentals with one clean workspace.</h1>
          <p>
            Manage users, reservations, fleet operations, and customer journeys from a secure responsive admin
            experience.
          </p>
          <div className="hero-points">
            <div className="hero-point">
              <strong>JWT sessions</strong>
              <span>Short-lived access tokens with refresh support.</span>
            </div>
            <div className="hero-point">
              <strong>Role-aware access</strong>
              <span>Separate customer, staff, and admin experiences.</span>
            </div>
            <div className="hero-point">
              <strong>Built for growth</strong>
              <span>Ready to connect the next rental modules cleanly.</span>
            </div>
          </div>
          </section>

          <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-header">
            <span className="auth-badge">Sign in</span>
            <h2>Welcome back</h2>
            <p>Use your account to access the VanLife dashboard.</p>
          </div>

          {error ? <div className="alert error">{error}</div> : null}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>

          <span className="auth-footer">
            No account yet? <Link to="/signup">Create one</Link>
          </span>
          </form>
        </div>
      </div>
    </>
  );
};
