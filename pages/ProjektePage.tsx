// React
import React from 'react';

// Internal - Components
import { DeviceMockupCarousel, ShowcaseSection } from '../components';

// Internal - Contexts
import { useLanguage } from '../contexts';

// Types
interface ProjektePageProps {
    setCurrentPage: (page: string) => void;
}

/**
 * ProjektePage - Project showcase page
 * Displays device mockups carousel and project showcase section
 */
const ProjektePage: React.FC<ProjektePageProps> = ({ setCurrentPage }) => {
    const { t } = useLanguage();

    return (
        <main>
            <DeviceMockupCarousel />
            <div id="projekte">
                <ShowcaseSection
                    setCurrentPage={setCurrentPage}
                    title={t('showcase.title')}
                    subtitle={t('showcase.subtitle')}
                />
            </div>
        </main>
    );
};

export default ProjektePage;