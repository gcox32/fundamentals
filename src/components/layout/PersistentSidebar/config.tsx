import { NavGroup } from './types';
import { 
    FaChartLine,
    FaSearch,
    FaBriefcase,
    FaNewspaper,
    FaChartBar,
    FaBell,
    FaCalculator 
} from 'react-icons/fa';

export const navGroups: NavGroup[] = [
    {
        title: 'Market Research',
        items: [
            { icon: <FaChartLine />, label: 'Overview', href: '/dashboard' },
            { icon: <FaSearch />, label: 'Stock Screener', href: '/dashboard/screener' },
            { icon: <FaNewspaper />, label: 'News & Analysis', href: '/dashboard/news' },
        ]
    },
    {
        title: 'Portfolio',
        items: [
            { icon: <FaBriefcase />, label: 'Holdings', href: '/portfolio/holdings' },
            { icon: <FaChartBar />, label: 'Performance', href: '/portfolio/performance' },
            { icon: <FaBell />, label: 'Alerts', href: '/portfolio/alerts' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'Investment Calculator', href: '/tools/calculator' },
        ]
    }
];