import { Link } from 'react-router-dom';

import { Navbar } from '../components/Navbar.jsx';
import { useAuth } from '../modules/users/useAuth.js';
import { Dashboard } from './Dashboard.jsx';

export const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="screen-center">Loading VanLife...</div>;
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <>
      <Navbar publicMode />
      <div className="landing-shell">
        <section className="landing-hero">
          <div className="landing-copy">
            <span className="eyebrow">VanLife</span>
            <h1>Discover camper van adventures before you ever sign in.</h1>
            <p>
              Browse the VanLife platform, explore how rentals are managed, and create an account only when you are
              ready to book, manage, or operate.
            </p>
            <div className="landing-actions">
              <Link className="landing-primary" to="/signup">
                Start your account
              </Link>
              <Link className="landing-secondary" to="/login">
                Login
              </Link>
            </div>
          </div>

          <div className="landing-showcase">
            <div className="showcase-panel">
              <span>Smart reservations</span>
              <strong>Real rental workflows for customers and staff.</strong>
            </div>
            <div className="showcase-grid">
              <div className="showcase-card">
                <span>Fleet ready</span>
                <strong>Camper van categories, assignments, and locations.</strong>
              </div>
              <div className="showcase-card">
                <span>Secure access</span>
                <strong>JWT auth, refresh sessions, and role-based routing.</strong>
              </div>
              <div className="showcase-card">
                <span>Responsive UI</span>
                <strong>Comfortable flow across mobile, tablet, and desktop.</strong>
              </div>
              <div className="showcase-card">
                <span>Modular build</span>
                <strong>Ready for fleet, bookings, contracts, and finance modules.</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
