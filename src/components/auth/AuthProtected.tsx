'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import AuthLoadingState from "./AuthLoadingState";

interface AuthProtectedProps {
  children: (user: any) => React.ReactNode;
  redirectTo?: string;
}

export default function AuthProtected({ children, redirectTo = '/auth/sign-in' }: AuthProtectedProps) {
  const { user, isAuthenticated, isLoading } = useAuthenticator(context => ({
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading
  }));
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const nextUrl = `${redirectTo}?next=${encodeURIComponent(window.location.pathname)}`;
      router.replace(nextUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) return <AuthLoadingState />;
  if (!isAuthenticated) return null;
  
  return children(user);
} 