import { useEffect } from "react";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { redirect } from "next/navigation";

export function useAuthRedirect(redirectTo: string) {
  const { isAuthenticated } = useAuthenticator(context => ({
    isAuthenticated: context.isAuthenticated
  }));

  useEffect(() => {
    if (isAuthenticated) {
      redirect(redirectTo);
    }
  }, [isAuthenticated, redirectTo]);

  return isAuthenticated;
} 