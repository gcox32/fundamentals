import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { FaUser, FaCog, FaBell, FaSignOutAlt } from 'react-icons/fa';
import styles from './styles.module.css';
import Snackbar from '@/src/components/utils/Snackbar';

interface UserSidebarProps {
  user: {
    name: string;
    backgroundImage: string;
  };
}

export default function UserSidebar({ user }: UserSidebarProps) {
  const router = useRouter();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSignOut = async () => {
    console.log('Simulating sign out...');
    setShowSnackbar(true);
    
    // Hide snackbar after 3 seconds and redirect
    setTimeout(() => {
      setShowSnackbar(false);
      router.push("/");
    }, 3000);
  };

  return (
    <>
      <div className={styles.userSidebar}>
        <div className={styles.userInfo}>
          <div 
            className={styles.userAvatar}
            style={{
              backgroundImage: `url(${user.backgroundImage})`
            }}
          />
          <h2 className={styles.userName}>{user.name}</h2>
        </div>

        <div className={styles.settingsGroup}>
          <nav>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/user/profile" className={styles.navLink}>
                  <span className={styles.icon}><FaUser /></span>
                  Edit Profile
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/user/settings" className={styles.navLink}>
                  <span className={styles.icon}><FaCog /></span>
                  Account Settings
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/user/notifications" className={styles.navLink}>
                  <span className={styles.icon}><FaBell /></span>
                  Notifications
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className={styles.logoutContainer}>
          <button onClick={handleSignOut} className={styles.logoutButton}>
            <span className={styles.icon}><FaSignOutAlt /></span>
            Sign Out
          </button>
        </div>
      </div>

      <Snackbar
        message="Signed out successfully"
        type="success"
        visible={showSnackbar}
      />
    </>
  );
} 