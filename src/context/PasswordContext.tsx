'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PasswordContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export function PasswordProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read from localStorage on initial load (client side only)
  useEffect(() => {
    try {
      const hasAuthenticated = localStorage.getItem('gabriel-site-auth') === 'true';
      console.log('Site password auth state from localStorage:', hasAuthenticated);
      setIsAuthenticated(hasAuthenticated);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Update localStorage when authentication state changes
  useEffect(() => {
    if (isInitialized) {
      try {
        console.log('Setting site password auth in localStorage:', isAuthenticated);
        if (isAuthenticated) {
          localStorage.setItem('gabriel-site-auth', 'true');
        } else {
          localStorage.removeItem('gabriel-site-auth');
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    }
  }, [isAuthenticated, isInitialized]);

  return (
    <PasswordContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
}

export function usePasswordContext() {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePasswordContext must be used within a PasswordProvider');
  }
  return context;
}