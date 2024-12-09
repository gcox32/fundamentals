import { NavGroup } from './types';
import { 
    FaTachometerAlt, 
    FaChartLine, 
    FaHistory, 
    FaUsers, 
    FaMapMarkerAlt, 
    FaBlog, 
    FaCalculator 
} from 'react-icons/fa';

export const navGroups: NavGroup[] = [
    {
        title: 'Dashboard',
        items: [
            { icon: <FaTachometerAlt />, label: 'Dashboard', href: '/dashboard' },
            { icon: <FaChartLine />, label: 'KPIs', href: '/dashboard/kpis' },
            { icon: <FaHistory />, label: 'Logs', href: '/dashboard/logs' },
        ]
    },
    {
        title: 'Management',
        items: [
            { icon: <FaUsers />, label: 'Users', href: '/management/users' },
            { icon: <FaMapMarkerAlt />, label: 'Tracking', href: '/management/tracking' },
            { icon: <FaBlog />, label: 'Blog', href: '/management/blog' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'Calculator', href: '/tools/calculator' },
        ]
    }
];