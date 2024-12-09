'use client';

import { useProtectedRoute } from "@/hooks/useProtectedRoute";

interface AuthProtectedProps {
  children: (user: any) => React.ReactNode;
  redirectTo?: string;
}

export default function AuthProtected({ 
  children, 
  redirectTo = '/auth/sign-in' 
}: AuthProtectedProps) {
  const { user, isAuthenticated } = useProtectedRoute(redirectTo);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children(user)}</>;
} 