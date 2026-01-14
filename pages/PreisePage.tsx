// React
import React from 'react';

// Internal - Components
import { PricingSection } from '../components/PricingSection';

// Types
interface PreisePageProps {
    setCurrentPage: (page: string) => void;
}

/**
 * PreisePage - Pricing page
 * Displays pricing section with plans and features
 */
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