import React from 'react';
import { PricingSection } from '../components/PricingSection';

interface PreisePageProps {
    setCurrentPage: (page: string) => void;
}

const PreisePage: React.FC<PreisePageProps> = ({ setCurrentPage }) => {
    return (
        <main>
            <div id="preise">
                <PricingSection setCurrentPage={setCurrentPage} />
            </div>
        </main>
    );
};

export default PreisePage;