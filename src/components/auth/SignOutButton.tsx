"use client";

import React, { useState } from "react";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";
import Snackbar from "@/src/components/utils/Snackbar";
import styles from "@/src/components/layout/UserSidebar/styles.module.css";

export default function SignOutButton() {
  const { signOut } = useAuthenticator();
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSignOut = async () => {
    try {
      setShowSnackbar(true);
      await signOut();
      
      // Hide snackbar after 2 seconds and redirect
      setTimeout(() => {
        setShowSnackbar(false);
        router.push("/auth/sign-in");
      }, 2000);
    } catch (error) {
      console.error('Error signing out:', error);
      setShowSnackbar(false);
    }
  };

  return (
    <>
      <button onClick={handleSignOut} className={styles.logoutButton}>
        <span className="icon"><FaSignOutAlt /></span>
        Sign Out
      </button>

      <Snackbar
        message="Signing out..."
        type="info"
        visible={showSnackbar}
      />
    </>
  );
}
