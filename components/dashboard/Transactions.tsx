
import React, { useContext, useEffect, useState } from 'react';
import { api, formatCurrency, formatDate } from '../../lib';
import { AuthContext } from '../../contexts';

interface Invoice {
    id: string;
    date: string;
    due_date: string;
    amount: number;
    status: 'Bezahlt' | 'Offen' | 'Überfällig';
    description: string;
}

const Transactions: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const { data } = await api.getTransactions();
                setTransactions(data || []);
            } catch (err) {
                // Error fetching transactions - transactions will remain empty
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [user]);

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'Bezahlt': return 'bg-green-500/20 text-green-700 dark:text-green-300';
            case 'Offen': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
            case 'Überfällig': return 'bg-red-500/20 text-red-700 dark:text-red-300';
            default: return 'bg-gray-500/20 text-gray-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Transaktionen</h1>
            <p className="mt-2 text-slate-900/80 dark:text-white/80">
                Hier finden Sie eine Übersicht aller Ihrer Rechnungen und Zahlungen.
            </p>

            <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Rechnungsnr.</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Beschreibung</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Datum</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Fällig am</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Betrag</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">Lade Daten...</td>
                                </tr>
                            ) : transactions.length > 0 ? transactions.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">{invoice.id}</td>
                                    <td className="px-6 py-4 text-sm text-slate-900/80 dark:text-white/80 whitespace-nowrap">{invoice.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900/80 dark:text-white/80">{formatDate(invoice.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900/80 dark:text-white/80">{invoice.due_date ? formatDate(invoice.due_date) : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white font-mono">{formatCurrency(invoice.amount)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        Keine Transaktionen gefunden.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
