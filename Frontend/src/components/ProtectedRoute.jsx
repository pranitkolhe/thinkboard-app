import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get loading state here too

  // If still loading, don't render anything yet (App.jsx handles the spinner)
  if (loading) {
    return null; 
  }

  // If loading is finished and there's no user, redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If loading is finished and there IS a user, render the child component
  return children;
};

export default ProtectedRoute;