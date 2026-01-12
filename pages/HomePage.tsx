
import React from 'react';
import { Hero } from '../components/Hero';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { DeviceMockupCarousel } from '../components/DeviceMockupCarousel';
import { LogoWall } from '../components/LogoWall';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ReasonsSection } from '../components/ReasonsSection';
import { ShowcasePreview } from '../components/ShowcasePreview';

interface HomePageProps {
    setCurrentPage: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage }) => {
    return (
        <main className="overflow-hidden">
            <Hero setCurrentPage={setCurrentPage} />
            <ShowcasePreview setCurrentPage={setCurrentPage} />
            <LogoWall />
            <ReasonsSection />
            <DeviceMockupCarousel />
            <TestimonialsSection />
            <FinalCtaSection setCurrentPage={setCurrentPage} />
        </main>
    );
};

export default HomePage;
