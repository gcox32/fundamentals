"use client";

import React from "react";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/"); // Redirect to home page after sign-out
  };

  return <button onClick={handleSignOut}>Sign out</button>;
}
