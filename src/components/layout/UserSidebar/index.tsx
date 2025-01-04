import React from 'react';
import Link from 'next/link';
import { FaUser, FaCog, FaBell } from 'react-icons/fa';
import styles from './styles.module.css';
import SignOutButton from '@/src/components/auth/SignOutButton';
import { Schema } from '@/amplify/data/resource';

interface UserSidebarProps {
  user: Schema['User'] & {
    profile?: {
      avatar?: string | null;
      firstName?: string | null;
      lastName?: string | null;
    };
  };
}

export default function UserSidebar({ user }: UserSidebarProps) {
  const avatarUrl = user?.profile?.avatar || 'https://ui-avatars.com/api/?name=Demo+Account&background=random&color=fff&size=100.png';
  const displayName = user?.profile?.firstName ? `${user.profile.firstName} ${user.profile.lastName}` : 'Demo Account';

  return (
    <div className={styles.userSidebar}>
      <div className={styles.userInfo}>
        <div 
          className={styles.userAvatar}
          style={{
            backgroundImage: `url(${avatarUrl})`
          }}
        />
        <h2 className={styles.userName}>{displayName}</h2>
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
        <SignOutButton />
      </div>
    </div>
  );
} 