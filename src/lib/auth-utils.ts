/**
 * Authentication utilities for handling both NextAuth and direct authentication
 */

import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';

/**
 * Check if a request has valid authentication (either NextAuth or direct auth)
 */
export function hasValidAuth(req: NextRequest): boolean {
  // Check for direct auth token only - site-auth flag is not sufficient
  const directAuthCookie = req.cookies.get('gabriel-auth-token');
  
  // Only return true if we have a valid auth token
  return !!directAuthCookie?.value;
}

/**
 * Get the authentication state from cookies on the server side
 */
export function getAuthStateFromCookies() {
  try {
    // Check for cookies in a way that works with both client and server components
    let hasDirectAuth = false;
    let hasSiteAuth = false;
    
    if (typeof document !== 'undefined') {
      // Client-side
      hasDirectAuth = document.cookie.includes('gabriel-auth-token=');
      hasSiteAuth = document.cookie.includes('gabriel-site-auth=true');
    } else {
      // Server-side - we can't reliably check cookies in server components
      // due to Next.js limitations, so we'll just return false
      hasDirectAuth = false;
      hasSiteAuth = false;
      
      // This is handled by our middleware and client-side checks instead
      console.log('Server-side cookie check skipped - relying on client-side checks');
    }
    
    return {
      hasDirectAuth,
      hasSiteAuth,
      isAuthenticated: hasDirectAuth || hasSiteAuth
    };
  } catch (error) {
    console.error('Error getting auth state from cookies:', error);
    return {
      hasDirectAuth: false,
      hasSiteAuth: false,
      isAuthenticated: false
    };
  }
}

/**
 * Get the authentication state from localStorage on the client side
 */
export function getAuthStateFromLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      hasDirectAuth: false,
      hasSiteAuth: false,
      isAuthenticated: false,
      email: null,
      user: null
    };
  }
  
  try {
    const authUser = localStorage.getItem('gabriel-auth-user');
    const authToken = localStorage.getItem('gabriel-auth-token');
    const authEmail = localStorage.getItem('gabriel-auth-email');
    
    // Check for auth cookies as well - only consider auth-token as valid
    const hasAuthCookie = document.cookie.includes('gabriel-auth-token=');
    
    // Only consider authenticated if we have a valid token or user data
    const hasValidAuth = !!authToken || !!hasAuthCookie;
    
    let parsedUser = null;
    try {
      if (authUser) {
        parsedUser = JSON.parse(authUser);
      }
    } catch (e) {
      console.error('Failed to parse auth user data:', e);
    }
    
    return {
      hasDirectAuth: hasValidAuth,
      hasSiteAuth: false, // Deprecated - no longer using site-auth flag
      isAuthenticated: hasValidAuth,
      email: parsedUser?.email || authEmail || null,
      user: parsedUser
    };
  } catch (error) {
    console.error('Error getting auth state from localStorage:', error);
    return {
      hasDirectAuth: false,
      hasSiteAuth: false,
      isAuthenticated: false,
      email: null,
      user: null
    };
  }
}
