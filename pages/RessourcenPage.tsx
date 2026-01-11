import React from 'react';
import { ResourcesSection } from '../components/ResourcesSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { ChecklistTeaser } from '../components/ChecklistTeaser';


interface RessourcenPageProps {
    setCurrentPage: (page: string) => void;
}

const RessourcenPage: React.FC<RessourcenPageProps> = ({ setCurrentPage }) => {
    return (
        <main>
            <div id="ressourcen">
                <ResourcesSection />
            </div>
            <ChecklistTeaser />
            <NewsletterSection />
        </main>
    );
};

export default RessourcenPage;