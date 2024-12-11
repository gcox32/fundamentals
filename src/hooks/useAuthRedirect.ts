import { useEffect } from "react";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { redirect } from "next/navigation";

export function useAuthRedirect(redirectTo: string) {
  const { isAuthenticated } = useAuthenticator(context => ({
    isAuthenticated: context.isAuthenticated
  }));

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    if (isAuthenticated) {
      console.log('redirecting to', redirectTo)
      redirect(redirectTo);
    }
  }, [isAuthenticated, redirectTo]);

  return isAuthenticated;
} 