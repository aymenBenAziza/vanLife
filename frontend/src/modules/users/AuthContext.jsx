import { createContext, useEffect, useState } from 'react';

import { setAccessToken } from '../../services/api/client.js';
import {
  getProfileRequest,
  loginRequest,
  logoutRequest,
  refreshSessionRequest,
  signupRequest,
  updateProfileRequest,
} from './api.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(localStorage.getItem('vanlife_access_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (accessToken) {
          try {
            const profile = await getProfileRequest();
            setUser(profile.user);
            return;
          } catch (profileError) {
            const refreshed = await refreshSessionRequest();
            setAccessTokenState(refreshed.accessToken);
            localStorage.setItem('vanlife_access_token', refreshed.accessToken);
            setUser(refreshed.user);
            return;
          }
        }

        const refreshed = await refreshSessionRequest();
        setAccessTokenState(refreshed.accessToken);
        localStorage.setItem('vanlife_access_token', refreshed.accessToken);
        setUser(refreshed.user);
      } catch (error) {
        setAccessTokenState(null);
        setUser(null);
        localStorage.removeItem('vanlife_access_token');
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = (data) => {
    setAccessTokenState(data.accessToken);
    localStorage.setItem('vanlife_access_token', data.accessToken);
    setUser(data.user);
    setAccessToken(data.accessToken);
  };

  const signup = async (payload) => {
    const data = await signupRequest(payload);
    handleAuthSuccess(data);
    return data.user;
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    handleAuthSuccess(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
      setAccessTokenState(null);
      localStorage.removeItem('vanlife_access_token');
      setAccessToken(null);
    }
  };

  const refreshSession = async () => {
    const data = await refreshSessionRequest();
    handleAuthSuccess(data);
    return data.user;
  };

  const updateProfile = async (payload) => {
    const data = await updateProfileRequest(payload);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: Boolean(user),
        isLoading,
        signup,
        login,
        logout,
        refreshSession,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
