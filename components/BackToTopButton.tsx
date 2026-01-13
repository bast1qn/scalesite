import { ArrowUpIcon } from './Icons';
import { scrollToTop, useScroll } from '../lib/utils';

export const BackToTopButton = () => {
  const isScrolled = useScroll(300);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg transition-all duration-300 ease-in-out transform active:scale-[0.98] ${
        isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
      aria-label="Nach oben scrollen"
    >
      <ArrowUpIcon />
    </button>
  );
};