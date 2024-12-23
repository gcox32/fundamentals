'use client';

import { ThemeProvider } from "@/src/contexts/ThemeContext";
import Navigation from "@/src/components/layout/Navigation";
import Footer from "@/src/components/layout/Footer";
import { SidebarProvider, useSidebar } from "@/src/contexts/SidebarContext";
import { SearchProvider } from "@/src/contexts/SearchContext";
import AuthProtected from "@/src/components/auth/AuthProtected";
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs);

function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

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