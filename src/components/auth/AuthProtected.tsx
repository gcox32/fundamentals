'use client';

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { redirect } from "next/navigation";

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
    redirect(redirectTo);
  }

  return <>{children(user)}</>;
} 