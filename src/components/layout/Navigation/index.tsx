"use client";

import React, { useState } from "react";
import { FaCog, FaBars } from "react-icons/fa";
import Sidebar from "@/src/components/layout/Sidebar";
import PageSettingsSidebar from "@/src/components/layout/PageSettingsSidebar";
import UserSidebar from "@/src/components/layout/UserSidebar";
import Link from "next/link";
import "./styles.css";
import PersistentSidebar from "@/src/components/layout/PersistentSidebar";
import { useSidebar } from "@/src/contexts/SidebarContext";
import SearchBar from "@/src/components/layout/SearchBar";
import { useAuthenticator } from "@/hooks/useAuthenticator";
import { useUser } from '@/src/contexts/UserContext';

interface NavigationProps {
    hiddenCards: Set<string>;
    onShowAllCards: () => void;
}

export default function Navigation({ hiddenCards, onShowAllCards }: NavigationProps) {
    const { user: authUser, isAuthenticated } = useAuthenticator(context => ({
        user: context.user,
        isAuthenticated: context.isAuthenticated
    }));
    const { user } = useUser();

    const [pageSettingsSidebarOpen, setPageSettingsSidebarOpen] = useState(false);
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);
    const { isExpanded, isMobileView, setMobileOpen } = useSidebar();

    const avatarUrl = user?.profile?.avatar || 'https://ui-avatars.com/api/?name=Demo+Account&background=random&color=fff&size=100.png';

    if (!isAuthenticated) {
        return (
            <nav className="main-nav">
                <div className="nav-controls">
                    <Link href="/auth/sign-in" className="nav-link">
                        Sign In
                    </Link>
                    <Link href="/auth/sign-up" className="nav-button">
                        Get Started
                    </Link>
                </div>
            </nav>
        );
    }

    return (
        <>
            <PersistentSidebar />
            <nav className={`main-nav ${isExpanded ? 'sidebar-expanded' : ''}`}>
                {isMobileView && (
                    <button
                        className="hamburger-button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open menu"
                    >
                        <FaBars />
                    </button>
                )}
                <SearchBar />
                <div className="nav-controls">
                    <button
                        className="icon-button"
                        aria-label="Settings"
                        onClick={() => setPageSettingsSidebarOpen(true)}
                    >
                        <FaCog className="settings-icon" />
                    </button>
                    <button
                        className="avatar-button"
                        aria-label="User menu"
                        onClick={() => setUserSidebarOpen(true)}
                        style={{
                            backgroundImage: `url(${avatarUrl})`
                        }}
                    />
                </div>
            </nav>

            <Sidebar
                isOpen={pageSettingsSidebarOpen}
                onClose={() => setPageSettingsSidebarOpen(false)}
                position="right"
            >
                <PageSettingsSidebar 
                />
            </Sidebar>

            <Sidebar
                isOpen={userSidebarOpen}
                onClose={() => setUserSidebarOpen(false)}
                position="right"
            >
                <UserSidebar user={user as any} />
            </Sidebar>
        </>
    );
}