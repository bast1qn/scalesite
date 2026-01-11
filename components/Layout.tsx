
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BackToTopButton } from './BackToTopButton';

interface LayoutProps {
  children: React.ReactNode;
  setCurrentPage: (page: string) => void;
  currentPage: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, setCurrentPage, currentPage }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header setCurrentPage={setCurrentPage} currentPage={currentPage} />

      <main className="flex-grow w-full">
        {children}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
      <BackToTopButton />
    </div>
  );
};
