import { useContext, type ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from '@/lib/motion';
import { AuthContext, useLanguage } from '../contexts';
import { UserCircleIcon, ArrowRightIcon } from './Icons';
import { useSwipeable } from '../lib/hooks';

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    setCurrentPage: (page: string) => void;
    currentPage: string;
    navItems: Array<{ page: string; label: string }>;
}

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        transition: {
            when: 'afterChildren',
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
    open: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.07,
            delayChildren: 0.1,
        },
    },
};

const overlayVariants: Variants = {
    closed: {
        opacity: 0,
        transition: { duration: 0.3, ease: 'easeInOut' },
    },
    open: {
        opacity: 1,
        transition: { duration: 0.3, ease: 'easeInOut' },
    },
};

const itemVariants: Variants = {
    closed: {
        x: -50,
        opacity: 0,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
    open: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 30,
        },
    },
};

interface NavItemProps {
    page: string;
    label: string;
    currentPage: string;
    onClick: (page: string) => void;
    index: number;
}

const NavItem = ({ page, label, currentPage, onClick, index }: NavItemProps) => {
    const isActive = currentPage === page;

    return (
        <motion.button
            variants={itemVariants}
            onClick={() => onClick(page)}
            className={`w-full max-w-xs text-lg font-medium transition-all duration-300 px-8 py-4 rounded-xl text-center min-h-12 ${
                isActive
                    ? 'text-white bg-gradient-to-r from-primary-600 to-violet-600 shadow-premium'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-soft'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {label}
        </motion.button>
    );
};
interface ActionButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
    icon?: ReactNode;
}

const ActionButton = ({ children, onClick, variant = 'secondary', icon }: ActionButtonProps) => {
    const baseClasses = 'w-full flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-xl transition-all duration-300 min-h-12';

    const variantClasses = variant === 'primary'
        ? 'text-white bg-gradient-to-r from-primary-600 to-violet-600 hover:shadow-premium font-semibold'
        : 'text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-soft';

    return (
        <motion.button
            variants={itemVariants}
            onClick={onClick}
            className={`${baseClasses} ${variantClasses}`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
        >
            {icon}
            <span>{children}</span>
        </motion.button>
    );
};

export const MobileNavigation = ({
    isOpen,
    onClose,
    setCurrentPage,
    currentPage,
    navItems,
}: MobileNavigationProps) => {
    const { user, logout } = useContext(AuthContext);
    const { t } = useLanguage();

    const handleNavClick = (page: string) => {
        setCurrentPage(page);
        onClose();
    };

    const handleLogout = () => {
        logout();
        setCurrentPage('home');
        onClose();
    };

    // Swipe handlers for closing menu
    const swipeHandlers = useSwipeable({
        onSwipedRight: onClose,
        onSwipedDown: onClose,
        swipeDuration: 250,
        swipeThreshold: 50,
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 lg:hidden bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl"
                        style={{ zIndex: 40 }}
                    >
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-violet-500/5 pointer-events-none" />

                        {/* Animated decorative elements */}
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: 180 }}
                            exit={{ scale: 0, rotate: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute top-20 right-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"
                        />
                        <motion.div
                            initial={{ scale: 0, rotate: 0 }}
                            animate={{ scale: 1, rotate: -180 }}
                            exit={{ scale: 0, rotate: 0 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute bottom-20 left-10 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"
                        />

                        {/* Navigation */}
                        <nav
                            className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 relative z-10"
                            {...swipeHandlers}
                        >
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="flex flex-col items-center gap-4 w-full"
                            >
                                {navItems.map((item, index) => (
                                    <NavItem
                                        key={item.page}
                                        page={item.page}
                                        label={item.label}
                                        currentPage={currentPage}
                                        onClick={handleNavClick}
                                        index={index}
                                    />
                                ))}

                                {/* Divider with animation */}
                                <motion.div
                                    variants={itemVariants}
                                    className="w-24 h-px bg-slate-200 dark:bg-slate-700 my-4"
                                />

                                {/* User actions */}
                                {user ? (
                                    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                                        <ActionButton
                                            variant="primary"
                                            onClick={() => handleNavClick('configurator')}
                                            icon={
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                                </svg>
                                            }
                                        >
                                            Konfigurator
                                        </ActionButton>

                                        <ActionButton
                                            onClick={() => handleNavClick('dashboard')}
                                            icon={<UserCircleIcon className="w-5 h-5" />}
                                        >
                                            {t('nav.dashboard')}
                                        </ActionButton>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={handleLogout}
                                            className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 py-3"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t('nav.logout')}
                                        </motion.button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                                        <ActionButton
                                            variant="primary"
                                            onClick={() => handleNavClick('preise')}
                                            icon={<ArrowRightIcon className="w-5 h-5" />}
                                        >
                                            {t('nav.projectStart')}
                                        </ActionButton>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => handleNavClick('login')}
                                            className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300 py-3"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {t('nav.login')}
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        </nav>

                        {/* Swipe hint */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400 dark:text-slate-500 text-sm flex items-center gap-2"
                        >
                            <motion.svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </motion.svg>
                            <span>Swipe to close</span>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
