
import { useEffect, useRef, useState } from 'react';
import { Hero, FinalCtaSection, ReasonsSection, ShowcasePreview, AnimatedSection } from '../components';

interface HomePageProps {
    setCurrentPage: (page: string) => void;
}

// Animated Section Divider Component
const SectionDivider: React.FC<{
    className?: string;
    variant?: 'wave' | 'curve' | 'zigzag' | 'fade';
}> = ({ className = '', variant = 'wave' }) => {
    const dividerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (dividerRef.current) {
            observer.observe(dividerRef.current);
        }

        return () => observer.disconnect();
    }, []);

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
};

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    return (
        <main className="overflow-hidden">
            <Hero setCurrentPage={setCurrentPage} />

            {/* Animated divider with fade effect */}
            <div className="relative z-20 bg-white dark:bg-slate-950">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-950/50" />
            </div>

            <AnimatedSection direction="up" delay={100}>
                <ShowcasePreview setCurrentPage={setCurrentPage} />
            </AnimatedSection>

            {/* Animated wave divider */}
            <div className="relative z-20 bg-slate-50 dark:bg-slate-950">
                <SectionDivider variant="curve" />
            </div>

            <AnimatedSection direction="up" delay={200}>
                <ReasonsSection />
            </AnimatedSection>

            {/* Animated fade divider */}
            <div className="relative z-20 bg-slate-50 dark:bg-slate-950">
                <SectionDivider variant="fade" />
            </div>

            <AnimatedSection direction="up" delay={300}>
                <FinalCtaSection setCurrentPage={setCurrentPage} />
            </AnimatedSection>
        </main>
    );
};

export default HomePage;
