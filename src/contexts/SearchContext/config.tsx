import { SearchResult } from '@/src/contexts/SearchContext';
import { 
    FaInfoCircle, 
    FaEnvelope, 
    FaUserCircle,
    FaFileAlt,
    FaCog,
    FaBell
} from 'react-icons/fa';

export const staticRoutes: SearchResult[] = [
  {
    label: 'About',
    href: '/about',
    icon: <FaInfoCircle />,
    category: '/'
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: <FaEnvelope />,
    category: '/'
  },
  {
    label: 'Profile',
    href: '/user/profile',
    icon: <FaUserCircle />,
    category: 'User'
  },
  {
    label: 'Settings',
    href: '/user/settings',
    icon: <FaCog />,
    category: 'User'
  },
  {
    label: 'Notifications',
    href: '/user/notifications',
    icon: <FaBell />,
    category: 'User'
  },
  {
    label: 'Privacy Policy',
    href: '/privacy-policy',
    icon: <FaFileAlt />,
    category: '/'
  },
  {
    label: 'Terms of Service',
    href: '/terms-of-service',
    icon: <FaFileAlt />,
    category: '/'
  }
]; 