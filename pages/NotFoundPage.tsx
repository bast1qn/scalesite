// ========================================================================
// 404 NOT FOUND PAGE
// ========================================================================
// Reference: Linear, Vercel, Stripe 404 pages
// Philosophy: Beautiful, helpful, not frustrating
// Features: Animated illustration, clear CTAs, maintains brand consistency
// ========================================================================

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from '@/lib/motion';
import { ArrowLeftIcon, HomeIcon, SearchIcon } from '../components/Icons';

interface NotFoundPageProps {
  setCurrentPage?: (page: string) => void;
}

/**
 * FloatingShape - Animated background shape
 * GPU-accelerated float animation
 */
const FloatingShape = ({
  className = '',
  delay = 0,
  duration = 8,
}: {
  className?: string;
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      className={`absolute rounded-full opacity-10 ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
};

/**
 * NotFoundPage - Beautiful 404 page with helpful navigation
 * Prevents user frustration with clear next steps
 */
const NotFoundPage = ({ setCurrentPage }: NotFoundPageProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    if (setCurrentPage) {
      setCurrentPage('home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 relative overflow-hidden"
      style={{ y }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingShape
          className="w-96 h-96 bg-primary-500 top-20 -left-20"
          delay={0}
          duration={10}
        />
        <FloatingShape
          className="w-80 h-80 bg-secondary-500 bottom-20 -right-20"
          delay={2}
          duration={12}
        />
        <FloatingShape
          className="w-64 h-64 bg-primary-400 top-1/2 left-1/2"
          delay={4}
          duration={15}
        />
      </div>

      {/* Mouse-following glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(75, 90, 237, 0.05), transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* 404 number */}
          <motion.h1
            className="text-[12rem] md:text-[16rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary-200 to-secondary-200 dark:from-primary-900/30 dark:to-secondary-900/30 select-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            404
          </motion.h1>

          {/* Error message */}
          <motion.div
            className="mt-[-4rem] mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Seite nicht gefunden
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Die von Ihnen gesuchte Seite existiert nicht, wurde verschoben oder ist temporär nicht verfügbar.
            </p>
          </motion.div>

          {/* Suggested actions */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          >
            {/* Go back button */}
            <motion.button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl shadow-premium hover:shadow-premium-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Zurück
            </motion.button>

            {/* Go home button */}
            <motion.button
              onClick={handleGoHome}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white font-semibold rounded-2xl shadow-premium hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HomeIcon className="w-4 h-4" />
              Startseite
            </motion.button>
          </motion.div>

          {/* Search placeholder (future feature) */}
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Suchen..."
                className="w-full px-6 py-4 pl-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-400 focus:ring-4 focus:ring-primary-500/8 transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Oder suchen Sie nach etwas anderem?
            </p>
          </motion.div>

          {/* Helpful links */}
          <motion.div
            className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Vielleicht suchen Sie nach:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'Leistungen', page: 'leistungen' },
                { label: 'Preise', page: 'preise' },
                { label: 'Projekte', page: 'projekte' },
                { label: 'Kontakt', page: 'contact' },
              ].map((link, index) => (
                <motion.button
                  key={link.page}
                  onClick={() => setCurrentPage?.(link.page)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 hover:scale-[1.02]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer info */}
      <motion.div
        className="absolute bottom-6 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Fehlercode: 404 • Falls das Problem weiterhin besteht, kontaktieren Sie uns bitte
        </p>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
