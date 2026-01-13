/**
 * Simple Router Context
 *
 * Provides navigation function to components without full router library
 * Used by ProtectedRoute for redirecting unauthorized users
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';

interface RouterContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navigate: (page: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentPage: 'home',
  setCurrentPage: () => {},
  navigate: () => {}
});

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

// Hook to get just navigate function (for ProtectedRoute)
export const useNavigate = () => {
  const { setCurrentPage } = useRouter();
  return (page: string) => {
    // Update URL hash
    if (typeof window !== 'undefined') {
      window.location.hash = page;
    }
    setCurrentPage(page);
  };
};

interface RouterProviderProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const RouterProvider = ({
  children,
  currentPage,
  setCurrentPage
}: RouterProviderProps) => {
  // Sync with URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1);
      if (hash && hash !== currentPage) {
        setCurrentPage(hash);
      }

      // Listen for hash changes
      const handleHashChange = () => {
        const newHash = window.location.hash.slice(1);
        if (newHash) {
          setCurrentPage(newHash);
        }
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [currentPage, setCurrentPage]);

  return (
    <RouterContext.Provider value={{ currentPage, setCurrentPage, navigate: (page) => setCurrentPage(page) }}>
      {children}
    </RouterContext.Provider>
  );
};
