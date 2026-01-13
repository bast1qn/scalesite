
import React, { useContext, useEffect, useState } from 'react';
import { UserGroupIcon } from '../Icons';
import { AuthContext, useLanguage } from '../../contexts';
import { supabase } from '../../lib';
import { alertLinkCopied } from '../../lib/dashboardAlerts';

interface ReferralStats {
    totalCount: number;
    completedProjects: number;
    earnedRewards: number;
}

const Referral: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [referralCode, setReferralCode] = useState('');
    const [stats, setStats] = useState<ReferralStats>({
        totalCount: 0,
        completedProjects: 0,
        earnedRewards: 0
    });

    useEffect(() => {
        const fetchReferralData = async () => {
            if (!user) return;

            try {
                // 1. Get Code from user context - already available in AuthContext
                if (user?.referral_code) {
                    setReferralCode(user.referral_code);
                }

                // 2. Get all referred users
                const { data: referredUsers, error } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('referred_by', user?.referral_code);

                if (error) throw error;

                const userIds = referredUsers?.map(u => u.id) || [];

                // 3. Count completed projects from referred users
                let completedProjects = 0;
                let earnedRewards = 0;

                if (userIds.length > 0) {
                    const { data: services } = await supabase
                        .from('user_services')
                        .select('id')
                        .in('user_id', userIds)
                        .eq('status', 'completed');

                    completedProjects = services?.length || 0;
                    // 100€ reward per completed project
                    earnedRewards = completedProjects * 100;
                }

                setStats({
                    totalCount: userIds.length,
                    completedProjects,
                    earnedRewards
                });
            } catch(e) {
                setStats({ totalCount: 0, completedProjects: 0, earnedRewards: 0 });
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
                 <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
                    <UserGroupIcon />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Freunde werben & profitieren</h1>
                    <p className="mt-1 text-slate-900/80 dark:text-white/80">
                        Empfehlen Sie ScaleSite weiter und sichern Sie sich attraktive Prämien.
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">So funktioniert's</h2>
                 <p className="mt-2 text-slate-900/80 dark:text-white/80">
                    Teilen Sie Ihren persönlichen Empfehlungslink. Für jeden Neukunden, der über Ihren Link ein Projekt startet, erhalten Sie eine Gutschrift von <span className="font-bold text-blue-600">100 €</span> für Ihre nächste Rechnung. Der geworbene Kunde erhält ebenfalls <span className="font-bold">10% Rabatt</span> auf sein erstes Projekt. Eine Win-Win-Situation!
                 </p>

                 <div className="mt-6">
                    <label htmlFor="referral-link" className="block text-sm font-medium text-slate-900/90 dark:text-white/90">Ihr persönlicher Link</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            name="referral-link"
                            id="referral-link"
                            readOnly
                            value={referralLink}
                            className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900/70 px-4"
                        />
                        <button
                            onClick={copyToClipboard}
                            disabled={!referralCode}
                            className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-r-md text-slate-900/80 dark:text-white/80 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            Kopieren
                        </button>
                    </div>
                 </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ihre Empfehlungs-Statistik</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-4xl font-bold text-blue-600">{stats.totalCount}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900/70 dark:text-white/70">Registrierte Freunde</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-4xl font-bold text-blue-600">{stats.completedProjects}</p>
                        <p className="mt-1 text-sm font-medium text-slate-900/70 dark:text-white/70">Abgeschlossene Projekte</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-4xl font-bold text-green-600">{stats.earnedRewards} €</p>
                        <p className="mt-1 text-sm font-medium text-slate-900/70 dark:text-white/70">Verdiente Prämie</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Referral;
