// ============================================
// IMPORTS
// ============================================

// React
import React, { useContext, useEffect, useState, useCallback } from 'react';

// Internal
import { AuthContext, useLanguage } from '../../contexts';
// ✅ FIXED: Import icons and components directly to avoid circular dependency
import { ThemeToggle } from '../ThemeToggle';
import {
  UserCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  ArrowDownOnSquareIcon,
  TrashIcon,
  GlobeAltIcon,
  CheckBadgeIcon
} from '../Icons';
import { api, supabase, validatePassword, getPasswordStrength, alertError, UI_TIMEOUTS } from '../../lib';
import NotificationPreferences from '../notifications/NotificationPreferences';

// ============================================
// CONSTANTS
// ============================================

/** Success message auto-dismiss timeout in milliseconds */
const SUCCESS_MESSAGE_TIMEOUT = UI_TIMEOUTS.successMessage;

/** Simulated API delay for general settings save */
const SAVE_SIMULATION_DELAY = UI_TIMEOUTS.saveSimulation;

/** Simulated delay for billing information save */
const BILLING_SAVE_DELAY = UI_TIMEOUTS.billingSave;

// Types
type SettingsTab = 'general' | 'security' | 'notifications' | 'billing';

// Components
const PasswordRequirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-xs ${met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
        <span className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {met ? '✓' : '○'}
        </span>
        {text}
    </div>
);

// Main Component
const Settings: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // --- GENERAL STATE ---
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('Geschäftsführer');
    const [language, setLanguage] = useState('de');
    const [timezone, setTimezone] = useState('Europe/Berlin');
    
    // --- SECURITY STATE ---
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // --- NOTIFICATIONS STATE ---
    const [notifyEmailMarketing, setNotifyEmailMarketing] = useState(true);
    const [notifyEmailSecurity, setNotifyEmailSecurity] = useState(true);
    const [notifyPushTickets, setNotifyPushTickets] = useState(true);
    const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

    // --- BILLING STATE ---
    const [vatId, setVatId] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    useEffect(() => {
        /**
         * Initializes form with user data on mount
         */
        if (user) {
            setName(user.name || '');
            setCompany(user.company || '');
            setEmail(user.email || '');
            // Initialize billing fields (empty for user to fill)
            setBillingAddress('');
            setVatId('');
        }
    }, [user]);

    /**
     * Shows success message with auto-dismiss
     */
    const showSuccess = useCallback((msg: string) => {
        setSuccessMsg(msg);
        const timeoutId = setTimeout(() => setSuccessMsg(''), SUCCESS_MESSAGE_TIMEOUT);
        return () => clearTimeout(timeoutId);
    }, []);

    /**
     * Saves general profile settings
     */
    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile({ name, company });
            // Simulate saving extra fields
            await new Promise(r => setTimeout(r, SAVE_SIMULATION_DELAY));
            showSuccess('Profil erfolgreich aktualisiert');
        } catch (error) {
            alertError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Saves new password after validation
     */
    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const validation = validatePassword(newPassword);
            if (!validation.isValid) {
                throw new Error('Password does not meet requirements');
            }

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setNewPassword('');
            setCurrentPassword('');
            showSuccess('Passwort erfolgreich geändert');
        } catch (error) {
            alertError(error instanceof Error ? error.message : 'Fehler beim Ändern des Passworts');
        } finally {
            setLoading(false);
        }
    };

    // Password strength tracking
    const passwordValidation = validatePassword(newPassword);
    const passwordStrength = getPasswordStrength(newPassword);
    const hasMinLength = newPassword.length >= 8;
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);

    /**
     * Returns color class for password strength indicator
     */
    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case 'weak': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'strong': return 'bg-emerald-500';
            default: return 'bg-slate-200';
        }
    };

    /**
     * Returns text color class for password strength label
     */
    const getStrengthTextColor = (strength: string) => {
        switch (strength) {
            case 'weak': return 'text-red-600 dark:text-red-400';
            case 'medium': return 'text-yellow-600 dark:text-yellow-400';
            case 'strong': return 'text-emerald-600 dark:text-emerald-400';
            default: return 'text-slate-400';
        }
    };

    /**
     * Saves billing information (local only, not persisted to DB)
     */
    const handleSaveBilling = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showSuccess('Rechnungsdaten lokal gespeichert (nicht in Datenbank)');
        }, BILLING_SAVE_DELAY);
    };

    /**
     * Exports user data as JSON file
     */
    const handleExportData = async () => {
        try {
            // Fetch user's tickets, services, and transactions for export
            const [ticketsRes, servicesRes, transactionsRes] = await Promise.all([
                api.getTickets(),
                api.getUserServices(),
                api.getTransactions()
            ]);

            const data = {
                user: {
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                    company: user?.company,
                    createdAt: user?.created_at
                },
                preferences: { notifyEmailMarketing, notifyEmailSecurity, notifyPushTickets, notifyWeeklyDigest },
                tickets: ticketsRes.data || [],
                services: servicesRes.data || [],
                transactions: transactionsRes.data || [],
                billing: { vatId, billingAddress },
                exportDate: new Date().toISOString()
            };

            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const href = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = href;
            link.download = `scalesite_data_export_${user?.id}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showSuccess('Daten erfolgreich exportiert');
        } catch (error) {
            alertError(error instanceof Error ? error.message : 'Fehler beim Exportieren der Daten');
        }
    };

    const TabButton = ({ id, label, icon }: { id: SettingsTab, label: string, icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-out min-h-11 ${
                activeTab === id
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            }`}
        >
            <span className={`transition-colors duration-200 ${activeTab === id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400 group-hover:text-slate-500'}`}>{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">{t('dashboard.settings.title')}</h1>
                <p className="text-base text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">Verwalten Sie Ihr Konto, Sicherheit und Präferenzen.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* SIDEBAR */}
                <div className="lg:col-span-1 space-y-2">
                    <TabButton id="general" label="Allgemein" icon={<UserCircleIcon className="w-5 h-5" />} />
                    <TabButton id="security" label="Sicherheit & Login" icon={<ShieldCheckIcon className="w-5 h-5" />} />
                    <TabButton id="notifications" label="Benachrichtigungen" icon={<BellIcon className="w-5 h-5" />} />
                    <TabButton id="billing" label="Rechnung & Abo" icon={<CreditCardIcon className="w-5 h-5" />} />
                </div>

                {/* CONTENT AREA */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* --- GENERAL TAB --- */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* Profile Card */}
                            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 border-b border-slate-100 dark:border-slate-800 pb-6 sm:pb-8">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform hover:scale-[1.02] duration-200">
                                        {name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Profilbild</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">Profilbild wird aus Ihrem Initial generiert.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveGeneral} className="grid gap-4 sm:gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Persönliche Daten</h3>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">{t('dashboard.settings.name')}</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-premium py-2.5 transition-shadow focus:shadow-lg focus:shadow-blue-500/10" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Job Titel</label>
                                        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input-premium py-2.5 transition-shadow focus:shadow-lg focus:shadow-blue-500/10" placeholder="z.B. Marketing Manager" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">{t('dashboard.settings.email')}</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium py-2.5 transition-shadow focus:shadow-lg focus:shadow-blue-500/10" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">{t('dashboard.settings.company_label')}</label>
                                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input-premium py-2.5 transition-shadow focus:shadow-lg focus:shadow-blue-500/10" />
                                    </div>

                                    <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Lokalisierung & Design</h3>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Sprache</label>
                                        <div className="relative">
                                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-premium py-2.5 appearance-none transition-shadow focus:shadow-lg focus:shadow-blue-500/10 cursor-pointer">
                                                <option value="de">Deutsch (Deutschland)</option>
                                                <option value="en">English (United States)</option>
                                            </select>
                                            <GlobeAltIcon className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Zeitzone</label>
                                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-premium py-2.5 transition-shadow focus:shadow-lg focus:shadow-blue-500/10 cursor-pointer">
                                            <option value="Europe/Berlin">Berlin (GMT+1)</option>
                                            <option value="Europe/London">London (GMT+0)</option>
                                            <option value="America/New_York">New York (GMT-5)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="md:col-span-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                        <div className="flex-1 min-w-0">
                                            <span className="block text-sm font-semibold text-slate-900 dark:text-white">Erscheinungsbild</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Wechseln Sie zwischen Hell- und Dunkelmodus.</span>
                                        </div>
                                        <ThemeToggle />
                                    </div>

                                    <div className="md:col-span-2 flex items-center justify-end gap-3 mt-4">
                                        {successMsg && <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold animate-fade-in flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg"><CheckBadgeIcon className="w-4 h-4" /> {successMsg}</span>}
                                        <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-slate-900/20 dark:hover:shadow-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-md">
                                            {loading ? 'Speichere...' : t('dashboard.settings.update_profile')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- SECURITY TAB --- */}
                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            {/* Password Change */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t('dashboard.settings.change_password')}</h3>
                                <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{t('dashboard.settings.current_password')}</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-premium py-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">{t('dashboard.settings.new_password')}</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-premium py-2.5" />
                                        {newPassword && (
                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                                        Passwort-Anforderungen:
                                                    </span>
                                                    <span className={`text-xs font-semibold ${getStrengthTextColor(passwordStrength)}`}>
                                                        {passwordStrength === 'weak' ? 'Schwach' : passwordStrength === 'medium' ? 'Mittel' : 'Stark'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 h-1">
                                                    <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'weak' ? getStrengthColor('weak') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                                    <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'medium' || passwordStrength === 'strong' ? getStrengthColor('medium') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                                    <div className={`flex-1 rounded-full transition-colors ${passwordStrength === 'strong' ? getStrengthColor('strong') : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    <PasswordRequirement met={hasMinLength} text="Mindestens 8 Zeichen" />
                                                    <PasswordRequirement met={hasLowercase} text="Kleinbuchstaben (a-z)" />
                                                    <PasswordRequirement met={hasUppercase} text="Großbuchstaben (A-Z)" />
                                                    <PasswordRequirement met={hasNumber} text="Mindestens eine Ziffer (0-9)" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button type="submit" disabled={loading || !passwordValidation.isValid} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                        {loading ? '...' : t('dashboard.settings.change_password')}
                                    </button>
                                </form>
                            </div>

                            {/* Data & Danger Zone */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Daten & Datenschutz</h3>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold">Daten exportieren</p>
                                            <p className="text-xs text-slate-500">Laden Sie eine Kopie Ihrer persönlichen Daten herunter (JSON).</p>
                                        </div>
                                        <button
                                            onClick={handleExportData}
                                            className="flex items-center gap-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11"
                                        >
                                            <ArrowDownOnSquareIcon className="w-4 h-4" /> Exportieren
                                        </button>
                                    </div>
                                    <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-2"></div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-red-600">Konto löschen</p>
                                            <p className="text-xs text-slate-500">Löscht unwiderruflich Ihr Konto und alle verknüpften Daten.</p>
                                        </div>
                                        <button className="flex items-center gap-2 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 min-h-11">
                                            <TrashIcon className="w-4 h-4" /> Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- NOTIFICATIONS TAB --- */}
                    {activeTab === 'notifications' && (
                        <NotificationPreferences />
                    )}

                    {/* --- BILLING TAB --- */}
                    {activeTab === 'billing' && (
                         <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Rechnungsdaten</h3>
                                <form onSubmit={handleSaveBilling} className="space-y-5">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Firmenname</label>
                                            <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input-premium py-2.5" />
                                        </div>
                                         <div>
                                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">USt-IdNr. (VAT ID)</label>
                                            <input type="text" value={vatId} onChange={(e) => setVatId(e.target.value)} className="input-premium py-2.5" placeholder="DE..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Rechnungsanschrift</label>
                                        <textarea rows={3} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} className="input-premium resize-none" />
                                    </div>
                                    <div className="pt-2 flex items-center justify-end gap-4">
                                        {successMsg && <span className="text-green-500 text-sm font-bold animate-fade-in flex items-center gap-1"><CheckBadgeIcon className="w-4 h-4" /> {successMsg}</span>}
                                        <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-6 rounded-xl hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                                            {loading ? 'Speichere...' : 'Daten speichern'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-8 rounded-2xl shadow-lg flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">Rechnungsverlauf</h3>
                                    <p className="text-sm text-slate-300">Laden Sie alle vergangenen Rechnungen als PDF herunter.</p>
                                </div>
                                <button onClick={() => { /* Navigate to transactions */ }} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 backdrop-blur-sm min-h-11">
                                    Zum Archiv
                                </button>
                            </div>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
