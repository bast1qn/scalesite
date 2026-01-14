// ============================================
// TIME LIMITED OFFER COMPONENT
// Week 8: Intelligent Pricing System - Advanced
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TagIcon, ClockIcon, CheckBadgeIcon, XMarkIcon, SparklesIcon, LightBulbIcon } from '../Icons';
import { useLanguage } from '../../contexts';
import { getActiveOffers, isOfferApplicable, type TimeLimitedOffer } from '../../lib/pricing';

// ============================================
// TYPES & INTERFACES
// ============================================

interface TimeLimitedOfferProps {
    serviceId?: number;                  // Service to check applicability
    quantity?: number;                    // Quantity to check applicability
    onClaimOffer?: (offerId: string) => void;  // Callback when claimed
    currency?: string;                    // Currency for display
    variant?: 'banner' | 'card' | 'modal'; // Display variant
    showCountdown?: boolean;              // Show countdown timer
    autoHide?: boolean;                   // Auto-hide when expired
    className?: string;                   // Additional classes
    compact?: boolean;                    // Compact mode
}

interface TimeRemaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate remaining time until offer expires
 */
const calculateTimeRemaining = (endDate: Date): TimeRemaining => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const difference = end - now;

    if (difference <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true
        };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
    };
};

/**
 * Format time for display
 */
const formatTimeUnit = (value: number, unit: string): string => {
    return `${value}${unit}`;
};

// ============================================
// COUNTDOWN TIMER COMPONENT
// ============================================

interface CountdownTimerProps {
    targetDate: Date;
    onComplete?: () => void;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'digital' | 'circular' | 'minimal';
    className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    targetDate,
    onComplete,
    size = 'md',
    variant = 'digital',
    className = ''
}) => {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
        calculateTimeRemaining(targetDate)
    );

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeRemaining = calculateTimeRemaining(targetDate);
            setTimeRemaining(newTimeRemaining);

            if (newTimeRemaining.isExpired && onComplete) {
                onComplete();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (timeRemaining.isExpired) {
        return null;
    }

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    }[size];

    if (variant === 'minimal') {
        return (
            <div className={`flex items-center gap-1.5 font-mono font-semibold ${sizeClasses} text-primary-600 dark:text-primary-400 ${className}`}>
                <ClockIcon className="w-3.5 h-3.5" />
                <span>
                    {formatTimeUnit(timeRemaining.days, 'd')}{' '}
                    {formatTimeUnit(timeRemaining.hours, 'h')}{' '}
                    {formatTimeUnit(timeRemaining.minutes, 'm')}
                </span>
            </div>
        );
    }

    // Digital variant - detailed blocks
    const timeBlocks = [
        { value: timeRemaining.days, label: 'Tage' },
        { value: timeRemaining.hours, label: 'Std' },
        { value: timeRemaining.minutes, label: 'Min' },
        { value: timeRemaining.seconds, label: 'Sek' }
    ];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {timeBlocks.map((block, index) => (
                <motion.div
                    key={block.label}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                >
                    <div className={`
                        bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800
                        rounded-lg px-2.5 py-1.5 min-w-[3rem] text-center
                        border border-slate-300 dark:border-slate-600
                        shadow-sm
                    `}>
                        <span className={`
                            font-mono font-bold text-slate-900 dark:text-white
                            ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base'}
                        `}>
                            {String(block.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className={`
                        text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1
                        ${size === 'sm' ? 'hidden' : 'block'}
                    `}>
                        {block.label}
                    </span>
                </motion.div>
            ))}
        </div>
    );
};

// ============================================
// TIME LIMITED OFFER COMPONENT
// ============================================

export const TimeLimitedOffer: React.FC<TimeLimitedOfferProps> = ({
    serviceId = 1,
    quantity = 1,
    onClaimOffer,
    currency = 'EUR',
    variant = 'banner',
    showCountdown = true,
    autoHide = true,
    className = '',
    compact = false
}) => {
    const { t, language } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const [claimedOffer, setClaimedOffer] = useState<string | null>(null);

    // Get applicable offers
    const applicableOffers = useMemo(() => {
        const activeOffers = getActiveOffers();
        return activeOffers.filter(offer =>
            isOfferApplicable(offer, serviceId, quantity)
        );
    }, [serviceId, quantity]);

    // Primary offer (first one)
    const offer = applicableOffers[0];

    // Auto-hide when no offers
    useEffect(() => {
        if (!offer && autoHide) {
            setIsVisible(false);
        } else if (offer) {
            setIsVisible(true);
        }
    }, [offer, autoHide]);

    // Check for dismissal in localStorage
    useEffect(() => {
        // SSR-Safety: Check if window is defined (not server-side)
        if (typeof window === 'undefined') return;

        const dismissedOffers = localStorage.getItem('dismissedOffers');
        if (dismissedOffers && offer) {
            const parsed = JSON.parse(dismissedOffers);
            if (parsed.includes(offer.id)) {
                setDismissed(true);
                setIsVisible(false);
            }
        }
    }, [offer]);

    const handleDismiss = () => {
        if (!offer) return;

        setDismissed(true);
        setIsVisible(false);

        // Save to localStorage (SSR-safe)
        if (typeof window !== 'undefined') {
            const dismissedOffers = localStorage.getItem('dismissedOffers') || '[]';
            const parsed = JSON.parse(dismissedOffers);
            parsed.push(offer.id);
            localStorage.setItem('dismissedOffers', JSON.stringify(parsed));
        }
    };

    const handleClaim = () => {
        if (!offer) return;

        setClaimedOffer(offer.id);
        if (onClaimOffer) {
            onClaimOffer(offer.id);
        }
    };

    if (!offer || dismissed || !isVisible) {
        return null;
    }

    const timeRemaining = calculateTimeRemaining(offer.endDate);

    // Banner Variant
    if (variant === 'banner') {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`
                        relative overflow-hidden
                        bg-gradient-to-r from-primary-500 via-violet-500 to-primary-600
                        dark:from-primary-600 dark:via-violet-600 dark:to-primary-700
                        rounded-xl shadow-lg shadow-primary-500/20
                        ${compact ? 'p-3' : 'p-4 md:p-5'}
                        ${className}
                    `}
                >
                    {/* Decorative pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                        }}
                    />

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            {/* Left: Offer info */}
                            <div className="flex items-start gap-3">
                                <div className={`
                                    flex-shrink-0 rounded-lg
                                    bg-white/20 backdrop-blur-sm
                                    p-2
                                    ${compact ? 'w-8 h-8' : 'w-10 h-10'}
                                `}>
                                    <SparklesIcon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`
                                            font-bold text-white
                                            ${compact ? 'text-sm' : 'text-base'}
                                        `}>
                                            {offer.name}
                                        </span>
                                        <span className={`
                                            inline-flex items-center px-2 py-0.5 rounded-full
                                            bg-white/20 backdrop-blur-sm
                                            text-[10px] font-semibold text-white uppercase tracking-wider
                                        `}>
                                            Limited
                                        </span>
                                    </div>
                                    {!compact && (
                                        <p className="text-sm text-white/90 leading-relaxed">
                                            {offer.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Right: Countdown & CTA */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {showCountdown && !timeRemaining.isExpired && (
                                    <CountdownTimer
                                        targetDate={offer.endDate}
                                        size={compact ? 'sm' : 'md'}
                                        variant="minimal"
                                    />
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleClaim}
                                        className={`
                                            flex-1 sm:flex-none
                                            px-4 py-2 rounded-lg
                                            bg-white text-primary-600 dark:bg-slate-900 dark:text-primary-400
                                            font-semibold text-sm
                                            hover:bg-slate-50 dark:hover:bg-slate-800
                                            transition-all duration-200
                                            shadow-md hover:shadow-lg
                                            ${claimedOffer ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                                        `}
                                        disabled={!!claimedOffer}
                                    >
                                        {claimedOffer ? (
                                            <span className="flex items-center gap-1.5">
                                                <CheckBadgeIcon className="w-4 h-4" />
                                                Aktiviert
                                            </span>
                                        ) : (
                                            `${offer.discountValue}${offer.discountType === 'percentage' ? '%' : currency}' sichern`
                                        )}
                                    </button>

                                    <button
                                        onClick={handleDismiss}
                                        className="
                                            p-2 rounded-lg
                                            bg-white/10 hover:bg-white/20
                                            text-white/80 hover:text-white
                                            transition-all duration-200
                                        "
                                        aria-label="Schließen"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // Card Variant
    if (variant === 'card') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
                    relative overflow-hidden
                    bg-white dark:bg-slate-800
                    rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700
                    ${className}
                `}
            >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-violet-500" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                <SparklesIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    {offer.name}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {offer.description}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Discount amount */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/20 dark:to-violet-900/20 rounded-xl border border-primary-200 dark:border-primary-800/30">
                        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600 dark:from-primary-400 dark:to-violet-400">
                            {offer.discountValue}
                            {offer.discountType === 'percentage' ? '%' : currency}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Discount auf deine Bestellung
                        </div>
                    </div>

                    {/* Countdown */}
                    {showCountdown && !timeRemaining.isExpired && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                <ClockIcon className="w-4 h-4" />
                                <span>Offer endet in:</span>
                            </div>
                            <CountdownTimer
                                targetDate={offer.endDate}
                                size="md"
                                variant="digital"
                            />
                        </div>
                    )}

                    {/* CTA */}
                    <button
                        onClick={handleClaim}
                        className={`
                            w-full py-3 rounded-xl
                            bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500
                            text-white font-semibold
                            shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40
                            transition-all duration-300
                            ${claimedOffer ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
                        `}
                        disabled={!!claimedOffer}
                    >
                        {claimedOffer ? (
                            <span className="flex items-center justify-center gap-2">
                                <CheckBadgeIcon className="w-5 h-5" />
                                Angebot aktiviert
                            </span>
                        ) : (
                            <span>{`Jetzt ${offer.discountValue}${offer.discountType === 'percentage' ? '%' : currency} sparen`}</span>
                        )}
                    </button>
                </div>
            </motion.div>
        );
    }

    return null;
};

// ============================================
// OFFER LIST COMPONENT
// ============================================

interface OfferListProps {
    serviceId?: number;
    quantity?: number;
    currency?: string;
    className?: string;
}

export const OfferList: React.FC<OfferListProps> = ({
    serviceId = 1,
    quantity = 1,
    currency = 'EUR',
    className = ''
}) => {
    const { t } = useLanguage();

    const applicableOffers = useMemo(() => {
        const activeOffers = getActiveOffers();
        return activeOffers.filter(offer =>
            isOfferApplicable(offer, serviceId, quantity)
        );
    }, [serviceId, quantity]);

    if (applicableOffers.length === 0) {
        return null;
    }

    return (
        <div className={`space-y-3 ${className}`}>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Aktuelle Angebote
            </h3>
            {applicableOffers.map(offer => (
                <div
                    key={offer.id}
                    className="
                        p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
                        hover:border-primary-300 dark:hover:border-primary-600
                        transition-all duration-200
                    "
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    {offer.name}
                                </span>
                                <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                                    {offer.discountValue}
                                    {offer.discountType === 'percentage' ? '%' : currency}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {offer.description}
                            </p>
                        </div>
                        <CountdownTimer
                            targetDate={offer.endDate}
                            size="sm"
                            variant="minimal"
                            className="ml-3"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

// ============================================
// EXPORTS
// ============================================

export default TimeLimitedOffer;
