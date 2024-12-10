'use client';

import { ThemeProvider } from "@/src/contexts/ThemeContext";
import Navigation from "@/src/components/layout/Navigation";
import Footer from "@/src/components/layout/Footer";
import { SidebarProvider, useSidebar } from "@/src/contexts/SidebarContext";
import { SearchProvider } from "@/src/contexts/SearchContext";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { useAuthenticator } from "@/hooks/useAuthenticator";

function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();
  const { user, isAuthenticated, isLoading } = useAuthenticator();

  return (
    <AuthProtected>
      {(user) => (
        <div className={`app-container ${isExpanded ? 'sidebar-expanded' : ''}`}>
          <Navigation />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      )}
    </AuthProtected>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <SearchProvider>
          <MainContent>
            {children}
          </MainContent>
        </SearchProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
} 