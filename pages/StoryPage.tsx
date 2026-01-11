import React from 'react';
import { InteractiveTimeline } from '../components/InteractiveTimeline';
import { UspSection } from '../components/UspSection';

interface StoryPageProps {
    setCurrentPage: (page: string) => void;
}

const StoryPage: React.FC<StoryPageProps> = ({ setCurrentPage }) => {
    return (
        <main>
            <InteractiveTimeline />
            <UspSection />
        </main>
    );
};

export default StoryPage;