import { useEffect } from "react";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { useRouter } from "next/navigation";

export function useAuthRedirect(redirectTo: string = "/") {
  const { isAuthenticated } = useAuthenticator((context) => [context.isAuthenticated]);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  return isAuthenticated;
} 