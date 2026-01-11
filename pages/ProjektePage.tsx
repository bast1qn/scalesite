
import React from 'react';
import { DeviceMockupCarousel } from '../components/DeviceMockupCarousel';
import { ShowcaseSection } from '../components/ShowcaseSection';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjektePageProps {
    setCurrentPage: (page: string) => void;
}

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