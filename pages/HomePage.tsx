
import React from 'react';
import { Hero } from '../components/Hero';
import { FinalCtaSection } from '../components/FinalCtaSection';
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
            <ReasonsSection />
            <FinalCtaSection setCurrentPage={setCurrentPage} />
        </main>
    );
};

export default HomePage;
