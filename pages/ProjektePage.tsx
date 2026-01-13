
import React from 'react';
import { DeviceMockupCarousel, ShowcaseSection } from '../components';
import { useLanguage } from '../contexts';

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