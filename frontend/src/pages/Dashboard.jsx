import { Link } from 'react-router-dom';

import { useAuth } from '../modules/users/useAuth.js';

export const Dashboard = ({ title = 'VanLife Dashboard' }) => {
  const { user } = useAuth();

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="page-header">
          <div>
            <span className="eyebrow">Camper Van Rental Platform</span>
            <h1>{title}</h1>
            <p>
              Signed in as {user?.firstName} {user?.lastName} ({user?.role}).
            </p>
          </div>
          <Link className="secondary-button" to="/profile">
            Open profile
          </Link>
        </div>
        <div className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <span className="auth-badge">Module 01</span>
            <h2>Authentication is live and ready for the next backend modules.</h2>
            <p>
              This dashboard is now a responsive base layer for fleet, reservations, contracts, payments, and branch
              operations.
            </p>
          </div>
          <div className="dashboard-summary">
            <div className="meta-card">
              <span>Current role</span>
              <strong>{user?.role}</strong>
            </div>
            <div className="meta-card">
              <span>Account status</span>
              <strong>{user?.status}</strong>
            </div>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <h2>Authentication ready</h2>
            <p>JWT access control, refresh sessions, role checks, and profile management are active.</p>
          </div>
          <div className="dashboard-panel">
            <h2>Next module</h2>
            <p>Fleet Management can plug into this protected shell next.</p>
          </div>
          <div className="dashboard-panel">
            <h2>Responsive foundation</h2>
            <p>The UI now adapts to phones, tablets, laptops, and wider dashboards without changing the auth flow.</p>
          </div>
          <div className="dashboard-panel">
            <h2>Security baseline</h2>
            <p>Access tokens, refresh cookies, and role-aware routing are already wired into the frontend shell.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
