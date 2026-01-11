
import React, { useContext, useEffect, useState } from 'react';
import { UserGroupIcon } from '../Icons';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { alertLinkCopied } from '../../lib/dashboardAlerts';

const Referral: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [referralCode, setReferralCode] = useState('');
    const [referralCount, setReferralCount] = useState(0);

    useEffect(() => {
        const fetchReferralData = async () => {
            if (!user) return;
            
            try {
                // 1. Get Code from user context or refresh profile
                const { data: userData } = await api.get('/auth/me');
                if (userData?.user?.referral_code) {
                    setReferralCode(userData.user.referral_code);
                }

                // 2. Count referrals via specific endpoint
                const { data: stats } = await api.get('/referrals/stats');
                setReferralCount(stats?.count || 0);
            } catch(e) {
                console.warn("Referral data error", e);
            }
        };
        fetchReferralData();
    }, [user]);

    const referralLink = `https://scalesite.de/ref/${referralCode || '...'}`;

    const copyToClipboard = () => {
        if (!referralCode) return;
        navigator.clipboard.writeText(referralLink);
        alertLinkCopied();
    };

    return (
        <div>
            <div className="flex items-center gap-4">
                 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                    <UserGroupIcon />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Freunde werben & profitieren</h1>
                    <p className="mt-1 text-dark-text/80 dark:text-light-text/80">
                        Empfehlen Sie ScaleSite weiter und sichern Sie sich attraktive Prämien.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10">
                 <h2 className="text-lg font-semibold text-dark-text dark:text-light-text">So funktioniert's</h2>
                 <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                    Teilen Sie Ihren persönlichen Empfehlungslink. Für jeden Neukunden, der über Ihren Link ein Projekt startet, erhalten Sie eine Gutschrift von <span className="font-bold text-primary">100 €</span> für Ihre nächste Rechnung. Der geworbene Kunde erhält ebenfalls <span className="font-bold">10% Rabatt</span> auf sein erstes Projekt. Eine Win-Win-Situation!
                 </p>

                 <div className="mt-6">
                    <label htmlFor="referral-link" className="block text-sm font-medium text-dark-text/90 dark:text-light-text/90">Ihr persönlicher Link</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            name="referral-link"
                            id="referral-link"
                            readOnly
                            value={referralLink}
                            className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-dark-text/20 dark:border-light-text/20 bg-light-bg dark:bg-dark-bg text-dark-text/70 px-4"
                        />
                        <button
                            onClick={copyToClipboard}
                            disabled={!referralCode}
                            className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-dark-text/20 dark:border-light-text/20 text-sm font-medium rounded-r-md text-dark-text/80 dark:text-light-text/80 bg-surface dark:bg-dark-surface hover:bg-light-bg dark:hover:bg-dark-bg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        >
                            Kopieren
                        </button>
                    </div>
                 </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-dark-text dark:text-light-text mb-4">Ihre Empfehlungs-Statistik</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10 text-center">
                        <p className="text-4xl font-bold text-primary">{referralCount}</p>
                        <p className="mt-1 text-sm font-medium text-dark-text/70 dark:text-light-text/70">Registrierte Freunde</p>
                    </div>
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10 text-center">
                        <p className="text-4xl font-bold text-primary">0</p>
                        <p className="mt-1 text-sm font-medium text-dark-text/70 dark:text-light-text/70">Abgeschlossene Projekte</p>
                    </div>
                    <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10 text-center">
                        <p className="text-4xl font-bold text-accent-2">0 €</p>
                        <p className="mt-1 text-sm font-medium text-dark-text/70 dark:text-light-text/70">Verdiente Prämie</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referral;
