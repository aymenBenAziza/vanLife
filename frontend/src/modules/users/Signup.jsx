import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Navbar } from '../../components/Navbar.jsx';
import { useAuth } from './useAuth.js';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(initialState);
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
      await signup(form);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar publicMode />
      <div className="auth-shell">
        <div className="auth-layout auth-layout-reversed">
          <section className="auth-hero">
          <span className="eyebrow">Customer Access</span>
          <h1>Create your VanLife account in a few quick steps.</h1>
          <p>
            New registrations are created as customer accounts, giving you a safe starting point for bookings and
            future rental workflows.
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <strong>15 min</strong>
              <span>Access token lifetime</span>
            </div>
            <div className="stat-card">
              <strong>7 days</strong>
              <span>Refresh session window</span>
            </div>
            <div className="stat-card">
              <strong>100%</strong>
              <span>Responsive auth screens</span>
            </div>
          </div>
          </section>

          <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-header">
            <span className="auth-badge">Register</span>
            <h2>Create account</h2>
            <p>Set up your secure VanLife access.</p>
          </div>

          {error ? <div className="alert error">{error}</div> : null}

          <div className="grid-2">
            <label>
              First name
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label>
              Last name
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
          </div>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>

          <span className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </span>
          </form>
        </div>
      </div>
    </>
  );
};
