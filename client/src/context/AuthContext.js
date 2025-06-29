import { createContext, useContext, useEffect, useState } from 'react';

// Create context
const AuthContext = createContext();

// Hook to access context
export const useAuth = () => useContext(AuthContext);

// AuthProvider with localStorage restore + loading flag
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // ✅ added

  // Restore user from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setAuthLoading(false); // ✅ indicate we're done loading
  }, []);

  // Login method
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Logout method
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Default export
export default AuthProvider;
