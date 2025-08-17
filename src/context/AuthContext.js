import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize state by safely reading from sessionStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from sessionStorage on initial load");
      return null;
    }
  });

  const isAuthenticated = !!user;

  // Login function updates state and sessionStorage
  const login = (userData) => {
    if (userData && typeof userData === 'object') {
      try {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (error) {
        console.error("Failed to save user to sessionStorage", error);
      }
    }
  };

  // Logout function clears state and sessionStorage
  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create and EXPORT the custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};