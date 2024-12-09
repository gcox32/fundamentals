'use client';

import { ThemeProvider } from "@/src/contexts/ThemeContext";
import Navigation from "@/src/components/layout/Navigation";
import Footer from "@/src/components/layout/Footer";
import { SidebarProvider, useSidebar } from "@/src/contexts/SidebarContext";
import { SearchProvider } from "@/src/contexts/SearchContext";

function MainContent({ children }: { children: React.ReactNode }) {
  const { isExpanded } = useSidebar();

  return (
    <div className={`app-container ${isExpanded ? 'sidebar-expanded' : ''}`}>
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <SidebarProvider>
            <SearchProvider>
              <MainContent>
                {children}
              </MainContent>
            </SearchProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 