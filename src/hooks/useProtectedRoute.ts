import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export function useProtectedRoute(redirectTo: string = '/auth/sign-in') {
  const { user, authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus
  ]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      const nextUrl = `${redirectTo}?next=${window.location.pathname}`;
      router.push(nextUrl);
    }
  }, [authStatus, router, redirectTo]);

  return { user, isAuthenticated: authStatus === "authenticated" };
} 