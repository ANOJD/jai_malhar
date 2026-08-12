import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/api.service.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem('jm_admin_token'));
  const [adminUser, setAdminUser] = useState(() => {
    const stored = localStorage.getItem('jm_admin_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.adminLogin(credentials);
      localStorage.setItem('jm_admin_token', result.token);
      localStorage.setItem('jm_admin_user', JSON.stringify(result.user));
      setIsAdmin(true);
      setAdminUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jm_admin_token');
    localStorage.removeItem('jm_admin_user');
    setIsAdmin(false);
    setAdminUser(null);
  }, []);

  const value = { isAdmin, adminUser, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
