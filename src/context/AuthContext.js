import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// 2. Creates the Provider Component
export const AuthProvider = ({ children }) => {
  // Initializes state by safely reading from sessionStorage
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

  // Make the login function async
  const login = async (userData) => {
    return new Promise((resolve) => {
      if (userData && typeof userData === 'object') {
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        // Resolve the promise after the state has been set.
        // We add a tiny delay to give the browser time to process the cookie.
        setTimeout(resolve, 50); 
      } else {
        resolve();
      }
    });
  };

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