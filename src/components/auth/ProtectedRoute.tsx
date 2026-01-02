import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { BilgeLogo } from '@/components/BilgeLogo';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isConfigured } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <BilgeLogo size="lg" animated />
        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Yukleniyor...</span>
        </div>
      </div>
    );
  }

  // In demo mode (no Supabase), allow access
  if (!isConfigured) {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// PublicRoute - redirects to /chat if already authenticated
interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isLoading, isConfigured } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <BilgeLogo size="lg" animated />
        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Yukleniyor...</span>
        </div>
      </div>
    );
  }

  // In demo mode, redirect to chat
  if (!isConfigured) {
    return <Navigate to="/chat" replace />;
  }

  // Redirect to chat if already authenticated
  if (user) {
    const from = location.state?.from?.pathname || '/chat';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
