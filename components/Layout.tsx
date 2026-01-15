import { type ReactNode, memo } from 'react';
import { Header, Footer, BackToTopButton } from './index';

interface LayoutProps {
  children: ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

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
