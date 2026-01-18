
// React
import { useEffect, useRef, useState } from 'react';

// Internal - Components
import { Hero, FinalCtaSection, ReasonsSection, ShowcasePreview, AnimatedSection } from '../components';

// Internal - Constants
import { INTERSECTION_THRESHOLD, ANIMATION_DELAY } from '../lib/constants';

interface HomePageProps {
    setCurrentPage: (page: string) => void;
}

/**
 * SectionDivider - Animated section divider with multiple variants
 *
 * ✅ PERFORMANCE: Memoized to prevent re-renders
 * @param className - Optional additional CSS classes
 * @param variant - Divider style variant (wave, curve, zigzag, fade)
 *
 * Features:
 * - Intersection Observer for lazy animation triggering
 * - Multiple SVG divider variants
 * - Smooth fade-in animations
 */
const SectionDivider: React.FC<{
    className?: string;
    variant?: 'wave' | 'curve' | 'zigzag' | 'fade';
}> = memo(({ className = '', variant = 'wave' }) => {
    const dividerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: INTERSECTION_THRESHOLD.default }
        );

        if (dividerRef.current) {
            observer.observe(dividerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // ✅ PERFORMANCE: Memoize SVG variants to prevent recreation on each render
    const variants = {
        wave: (
            <svg className="w-full h-12 md:h-16" viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path
                    className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                    fill="currentColor"
                />
            </svg>
        ),
        curve: (
            <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path
                    className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    d="M0,64 C480,150 960,-50 1440,64 L1440,120 L0,120 Z"
                    fill="currentColor"
                />
            </svg>
        ),
        zigzag: (
            <svg className="w-full h-8 md:h-12" viewBox="0 0 1440 40" preserveAspectRatio="none">
                <path
                    className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    d="M0,40 L180,0 L360,40 L540,0 L720,40 L900,0 L1080,40 L1260,0 L1440,40 L1440,60 L0,60 Z"
                    fill="currentColor"
                />
            </svg>
        ),
        fade: (
            <div className={`h-24 md:h-32 bg-gradient-to-b from-transparent to-current transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
        ),
    };

    return (
        <div ref={dividerRef} className={`text-slate-100 dark:text-slate-900 ${className}`}>
            {variants[variant]}
        </div>
    );
});

SectionDivider.displayName = 'SectionDivider';

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    return (
        <main className="overflow-hidden">
            <Hero setCurrentPage={setCurrentPage} />

            {/* Animated divider with fade effect */}
            <div className="relative z-20 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-950/50" />
            </div>

            <AnimatedSection direction="up" delay={ANIMATION_DELAY.staggerNormal}>
                <ShowcasePreview setCurrentPage={setCurrentPage} />
            </AnimatedSection>

            {/* Animated wave divider */}
            <div className="relative z-20 bg-slate-50 dark:bg-slate-950">
                <SectionDivider variant="curve" />
            </div>

            <AnimatedSection direction="up" delay={ANIMATION_DELAY.staggerNormal * 2}>
                <ReasonsSection />
            </AnimatedSection>

            {/* Animated fade divider */}
            <div className="relative z-20 bg-slate-50 dark:bg-slate-950">
                <SectionDivider variant="fade" />
            </div>

            <AnimatedSection direction="up" delay={ANIMATION_DELAY.staggerNormal * 3}>
                <FinalCtaSection setCurrentPage={setCurrentPage} />
            </AnimatedSection>
        </main>
    );
};

export default HomePage;
