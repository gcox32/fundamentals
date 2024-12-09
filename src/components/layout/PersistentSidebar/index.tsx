import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { 
    FaChevronLeft, 
    FaChevronRight,
    FaTimes
} from 'react-icons/fa';
import Link from 'next/link';
import NavLogo from '@/src/components/layout/NavLogo';
import { useSidebar } from '@/src/contexts/SidebarContext';
import { useSearch } from '@/src/contexts/SearchContext';
import { navGroups } from './config';

export default function PersistentSidebar() {
    const { isExpanded, setIsExpanded, isMobileView, isMobileOpen, setMobileOpen } = useSidebar();
    const { setNavGroups } = useSearch();
    const pathname = usePathname();

    useEffect(() => {
        setNavGroups(navGroups);
    }, [setNavGroups]);

    const sidebarContent = (
        <>
            {!isMobileView && (
                <button
                    className="toggle-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                </button>
            )}
            <NavLogo />
            <nav className="persistent-nav">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="nav-group">
                        <h3 className={`nav-group-title ${isExpanded || isMobileOpen ? 'expanded' : ''}`}>
                            {group.title}
                        </h3>
                        <ul>
                            {group.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                    <Link 
                                        href={item.href}
                                        className={pathname === item.href ? 'active' : ''}
                                    >
                                        <span className="icon">{item.icon}</span>
                                        {(isExpanded || isMobileOpen) && <span className="label">{item.label}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </>
    );

    if (isMobileView) {
        return (
            <>
                <div 
                    className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                />
                <div className={`mobile-sidebar ${isMobileOpen ? 'open' : ''}`}>
                    <button 
                        className="close-button"
                        onClick={() => setMobileOpen(false)}
                    >
                        <FaTimes />
                    </button>
                    {sidebarContent}
                </div>
            </>
        );
    }

    return (
        <div className={`persistent-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {sidebarContent}
        </div>
    );
} 