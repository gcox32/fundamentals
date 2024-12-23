'use client'

import { useSearchParams, useRouter } from "next/navigation";
import { Authenticator } from "@/src/components/auth/Authenticator";

export default function ChangePassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const username = searchParams.get('username');

  if (!username) {
    router.replace('/auth/sign-in');
    return null;
  }

  return (
    <div className="auth-form-container">
      <h2>Change Password</h2>
      <Authenticator 
        initialState="changePassword" 
        email={username}
      />
    </div>
  );
} 