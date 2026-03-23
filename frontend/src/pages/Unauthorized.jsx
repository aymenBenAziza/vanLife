import { Link } from 'react-router-dom';

import { Navbar } from '../components/Navbar.jsx';

export const UnauthorizedPage = () => (
  <>
    <Navbar />
    <div className="auth-shell page-shell-with-nav">
      <div className="auth-card">
        <div className="auth-card-header">
          <span className="auth-badge">Restricted</span>
          <h2>Access denied</h2>
          <p>Your role does not allow access to this area.</p>
        </div>
        <Link className="link-button" to="/">
          Return to dashboard
        </Link>
      </div>
    </div>
  </>
);
