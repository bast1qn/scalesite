
import React from 'react';
import { BuildingStorefrontIcon } from '../Icons';

const Partner: React.FC = () => {
    return (
        <div>
            <div className="flex items-center gap-4">
                 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                    <BuildingStorefrontIcon />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Werden Sie ScaleSite-Partner</h1>
                    <p className="mt-1 text-dark-text/80 dark:text-light-text/80">
                        Gemeinsam mehr erreichen.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-surface dark:bg-dark-surface p-6 sm:p-8 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10">
                <h2 className="text-xl font-semibold text-dark-text dark:text-light-text">Das Partnerprogramm (in Kürze verfügbar)</h2>
                <p className="mt-4 text-dark-text/80 dark:text-light-text/80">
                    Ich bin stets auf der Suche nach Kooperationen mit Designern, Marketing-Agenturen und anderen Kreativen, die für ihre Kunden eine professionelle technische Umsetzung benötigen. Als White-Label-Partner übernehme ich die komplette Webentwicklung, während Sie der Ansprechpartner für Ihren Kunden bleiben.
                </p>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                        <h3 className="font-semibold text-dark-text dark:text-light-text">Ihre Vorteile als Partner:</h3>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-dark-text/80 dark:text-light-text/80">
                            <li>Faire und transparente Partner-Provisionen</li>
                            <li>Zuverlässige und qualitativ hochwertige Umsetzung</li>
                            <li>Fokus auf Ihr Kerngeschäft, ich kümmere mich um die Technik</li>
                            <li>Absolute Diskretion und professionelle Kommunikation</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold text-dark-text dark:text-light-text">Ideal für:</h3>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-dark-text/80 dark:text-light-text/80">
                            <li>Grafik- & Webdesigner</li>
                            <li>Marketing- & SEO-Agenturen</li>
                            <li>Consultants & Berater</li>
                            <li>Copywriter & Content-Strategen</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="font-semibold text-dark-text/90 dark:text-light-text/90">Interesse geweckt?</p>
                    <p className="mt-1 text-dark-text/80 dark:text-light-text/80">Das offizielle Partnerprogramm startet bald. Wenn Sie vorab Interesse an einer Kooperation haben, schreiben Sie mir gerne eine E-Mail.</p>
                    <a href="mailto:info.scalesite@gmail.com?subject=Partneranfrage" className="mt-4 inline-block bg-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-primary/90 transition-colors">
                        Kontakt aufnehmen
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Partner;
