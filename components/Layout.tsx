import { type ReactNode } from 'react';
import { Header, Footer, BackToTopButton } from './index';

interface LayoutProps {
  children: ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

// PERFORMANCE: Memoize Layout to prevent unnecessary re-renders
// Only re-renders when currentPage changes
export const Layout = memo(({ children, setCurrentPage, currentPage }: LayoutProps) => {
  const isDashboard = currentPage === 'dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />}

      <main className="flex-grow w-full">
        {children}
      </main>

      {!isDashboard && <Footer setCurrentPage={setCurrentPage} />}
      {!isDashboard && <BackToTopButton />}
    </div>
  );
});

Layout.displayName = 'Layout';
