import { createBrowserRouter } from 'react-router-dom';

import { Dashboard } from '../pages/Dashboard.jsx';
import { HomePage } from '../pages/Home.jsx';
import { UnauthorizedPage } from '../pages/Unauthorized.jsx';
import { GuestRoute } from '../modules/users/GuestRoute.jsx';
import { Login } from '../modules/users/Login.jsx';
import { PrivateRoute } from '../modules/users/PrivateRoute.jsx';
import { Profile } from '../modules/users/Profile.jsx';
import { RoleRoute } from '../modules/users/RoleRoute.jsx';
import { Signup } from '../modules/users/Signup.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <GuestRoute>
        <Signup />
      </GuestRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <RoleRoute allowedRoles={['admin']}>
        <Dashboard title="Admin Console" />
      </RoleRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
]);
