import { NavGroup } from './types';
import { 
    FaSearch,
    FaBriefcase,
    FaChartBar,
    FaBell,
    FaCalculator,
    FaChartLine,
    FaThumbsUp
} from 'react-icons/fa';

export const navGroups: NavGroup[] = [
    {
        title: 'Research',
        items: [
            { icon: <FaSearch />, label: 'Valuation', href: '/research/valuation' },
            { icon: <FaChartBar />, label: 'Leading Indicators', href: '/research/leading-indicators' },
            { icon: <FaThumbsUp />, label: 'Sentiment', href: '/research/sentiment' },
        ]
    },
    {
        title: 'Portfolio',
        items: [
            { icon: <FaBriefcase />, label: 'Holdings', href: '/portfolio' },
            { icon: <FaChartLine />, label: 'Performance', href: '/portfolio/performance' },
            { icon: <FaBell />, label: 'Alerts', href: '/portfolio/alerts' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'DCF Calculator', href: '/tools/calculator' },
        ]
    }
];