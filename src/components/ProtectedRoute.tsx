import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  userRole: string | undefined;
  allowedRoles: string[];
  children: React.ReactNode;
  isLoading: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  userRole, 
  allowedRoles, 
  children, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
