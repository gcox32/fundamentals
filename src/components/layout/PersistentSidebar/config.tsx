import { NavGroup } from './types';
import { 
    FaSearch,
    FaBriefcase,
    FaChartBar,
    FaBell,
    FaCalculator,
    FaChartLine,
    FaThumbsUp,
    FaChartPie
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
            { icon: <FaBriefcase />, label: 'Construction', href: '/portfolio' },
            { icon: <FaChartPie />, label: 'Assessment', href: '/portfolio/assessment' },
            { icon: <FaBell />, label: 'Screener', href: '/portfolio/screener' },
        ]
    },
    {
        title: 'Tools',
        items: [
            { icon: <FaCalculator />, label: 'DCF Calculator', href: '/tools/dcf' },
            { icon: <FaChartLine />, label: 'Simulator', href: '/tools/simulator' },
        ]
    }
];