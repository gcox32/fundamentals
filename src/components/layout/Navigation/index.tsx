"use client";

import React, { useState } from "react";
import { FaCog, FaBars } from "react-icons/fa";
import Sidebar from "@/src/components/layout/Sidebar";
import PageSettingsSidebar from "@/src/components/layout/PageSettingsSidebar";
import UserSidebar from "@/src/components/layout/UserSidebar";
import { useRouter } from "next/navigation";
import "./styles.css";
import PersistentSidebar from "@/src/components/layout/PersistentSidebar";
import { useSidebar } from "@/src/contexts/SidebarContext";
import SearchBar from "@/src/components/layout/SearchBar";

export default function Navigation() {

    const user = {
        name: 'Demo Account',
        avatar: 'https://ui-avatars.com/api/?name=Demo+Account&background=random&color=fff&size=100.png'
      };

    const router = useRouter();
    const [pageSettingsSidebarOpen, setPageSettingsSidebarOpen] = useState(false);
    const [userSidebarOpen, setUserSidebarOpen] = useState(false);
    const { isExpanded, setIsExpanded, isMobileView, setMobileOpen } = useSidebar();

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
                            backgroundImage: `url(${user.avatar})`
                        }}
                    />
                </div>
            </nav>

            <Sidebar
                isOpen={pageSettingsSidebarOpen}
                onClose={() => setPageSettingsSidebarOpen(false)}
                position="right"
            >
                <PageSettingsSidebar />
            </Sidebar>

            <Sidebar
                isOpen={userSidebarOpen}
                onClose={() => setUserSidebarOpen(false)}
                position="right"
            >
                <UserSidebar user={user} />
            </Sidebar>
        </>
    );
}