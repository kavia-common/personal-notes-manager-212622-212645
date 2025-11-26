import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - Wraps protected elements; redirects to /login if not authed
 */
export default function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
