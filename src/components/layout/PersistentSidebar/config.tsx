import { NavGroup } from './types';
import { 
    FaSearch,
    FaBriefcase,
    FaChartBar,
    FaBell,
    FaCalculator,
    FaBook
} from 'react-icons/fa';
import EventideIcon from '@/components/common/icons/EventideIcon';

export const navGroups: NavGroup[] = [
    {
        title: 'Market Research',
        items: [
            { icon: <FaSearch />, label: 'Overview', href: '/dashboard' },
            { icon: <FaBook />, label: 'Research Hub', href: '/research-hub' },
            { icon: <FaChartBar />, label: 'Impact', href: '/impact' },
        ]
    },
    {
        title: 'Portfolio',
        items: [
            { icon: <FaBriefcase />, label: 'Holdings', href: '/portfolio' },
            { icon: <FaChartBar />, label: 'Performance', href: '/portfolio/performance' },
            { icon: <FaBell />, label: 'Alerts', href: '/portfolio/alerts' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'Calculator', href: '/tools/calculator' },
        ]
    }
];