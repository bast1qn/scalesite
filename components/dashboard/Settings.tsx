
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ThemeToggle';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';
import {
    UserCircleIcon,
    ShieldCheckIcon,
    BellIcon,
    CreditCardIcon,
    ArrowDownOnSquareIcon,
    TrashIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    CheckBadgeIcon,
    LockClosedIcon
} from '../Icons';
import { alertError } from '../../lib/dashboardAlerts';

type SettingsTab = 'general' | 'security' | 'notifications' | 'billing';

const Settings: React.FC = () => {
    const { user } = useContext(AuthContext);
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
    const [twoFactor, setTwoFactor] = useState(false);
    
    // --- NOTIFICATIONS STATE ---
    const [notifyEmailMarketing, setNotifyEmailMarketing] = useState(true);
    const [notifyEmailSecurity, setNotifyEmailSecurity] = useState(true);
    const [notifyPushTickets, setNotifyPushTickets] = useState(true);
    const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(false);

    // --- BILLING STATE ---
    const [vatId, setVatId] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setCompany(user.company || '');
            setEmail(user.email || '');
            // Mock Data init
            setBillingAddress(`${user.company || 'Firma'}\nMusterstraße 1\n12345 Berlin`);
            setVatId('DE123456789');
        }
    }, [user]);

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSaveGeneral = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile({ name, company });
            // Simulate saving extra fields
            await new Promise(r => setTimeout(r, 800));
            showSuccess('Profil erfolgreich aktualisiert');
        } catch (error: any) {
            alertError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if(newPassword.length < 6) throw new Error("Passwort muss mindestens 6 Zeichen haben");

            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setNewPassword('');
            setCurrentPassword('');
            showSuccess('Passwort erfolgreich geändert');
        } catch (error: any) {
            alertError(error.message || 'Fehler beim Ändern des Passworts');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBilling = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            showSuccess('Rechnungsdaten gespeichert');
        }, 1000);
    };

    const handleExportData = () => {
        const data = {
            user: { name, email, company, jobTitle, language, timezone },
            preferences: { notifyEmailMarketing, notifyEmailSecurity, notifyPushTickets },
            billing: { vatId, billingAddress },
            exportDate: new Date().toISOString()
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `scalesite_data_export_${user?.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const TabButton = ({ id, label, icon }: { id: SettingsTab, label: string, icon: React.ReactNode }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === id 
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
        >
            <span className={activeTab === id ? 'text-blue-600' : 'text-slate-400'}>{icon}</span>
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Einstellungen</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Verwalten Sie Ihr Konto, Sicherheit und Präferenzen.</p>
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
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                                    <div className="relative group cursor-pointer">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                                            {name.charAt(0)}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-xs text-white font-bold">Ändern</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profilbild</h3>
                                        <p className="text-sm text-slate-500 mb-3">JPG, GIF oder PNG. Max 1MB.</p>
                                        <button className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                            Hochladen
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveGeneral} className="grid gap-6 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Persönliche Daten</h3>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Vollständiger Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-premium py-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Job Titel</label>
                                        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="input-premium py-2.5" placeholder="z.B. Marketing Manager" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">E-Mail Adresse</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-premium py-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Firma</label>
                                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input-premium py-2.5" />
                                    </div>

                                    <div className="md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Lokalisierung & Design</h3>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Sprache</label>
                                        <div className="relative">
                                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-premium py-2.5 appearance-none">
                                                <option value="de">Deutsch (Deutschland)</option>
                                                <option value="en">English (United States)</option>
                                            </select>
                                            <GlobeAltIcon className="w-4 h-4 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Zeitzone</label>
                                        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-premium py-2.5">
                                            <option value="Europe/Berlin">Berlin (GMT+1)</option>
                                            <option value="Europe/London">London (GMT+0)</option>
                                            <option value="America/New_York">New York (GMT-5)</option>
                                        </select>
                                    </div>
                                    
                                    <div className="md:col-span-2 flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                        <div>
                                            <span className="block text-sm font-bold text-slate-900 dark:text-white">Erscheinungsbild</span>
                                            <span className="text-xs text-slate-500">Wechseln Sie zwischen Hell- und Dunkelmodus.</span>
                                        </div>
                                        <ThemeToggle />
                                    </div>

                                    <div className="md:col-span-2 flex items-center justify-end gap-4 mt-4">
                                        {successMsg && <span className="text-green-500 text-sm font-bold animate-fade-in flex items-center gap-1"><CheckBadgeIcon className="w-4 h-4" /> {successMsg}</span>}
                                        <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                                            {loading ? 'Speichere...' : 'Änderungen speichern'}
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
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Passwort ändern</h3>
                                <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Aktuelles Passwort</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-premium py-2.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Neues Passwort</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-premium py-2.5" />
                                    </div>
                                    <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                                        {loading ? '...' : 'Passwort aktualisieren'}
                                    </button>
                                </form>
                            </div>

                            {/* 2FA Section */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Zwei-Faktor-Authentifizierung (2FA)</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                                            Erhöhen Sie die Sicherheit Ihres Kontos, indem Sie einen zusätzlichen Bestätigungsschritt beim Login verlangen.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                {twoFactor && (
                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex items-start gap-3 animate-fade-in">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg text-blue-600 dark:text-blue-300">
                                            <LockClosedIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">2FA ist aktiv</h4>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Ihr Konto ist durch eine Authenticator-App geschützt.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Active Sessions */}
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Aktive Sitzungen</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <DevicePhoneMobileIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Chrome auf Windows</p>
                                                <p className="text-xs text-slate-500">Berlin, Deutschland • Aktuelle Sitzung</p>
                                            </div>
                                        </div>
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Aktiv</span>
                                    </div>
                                    <div className="flex items-center justify-between opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <DevicePhoneMobileIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">Safari auf iPhone 14</p>
                                                <p className="text-xs text-slate-500">Berlin, Deutschland • Vor 2 Tagen</p>
                                            </div>
                                        </div>
                                        <button className="text-xs text-red-500 hover:underline">Abmelden</button>
                                    </div>
                                </div>
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
                                            className="flex items-center gap-2 text-sm font-semibold border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
                                        <button className="flex items-center gap-2 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                                            <TrashIcon className="w-4 h-4" /> Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- NOTIFICATIONS TAB --- */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">E-Mail Benachrichtigungen</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Produkt-Updates & Marketing</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Neuigkeiten zu Funktionen und Angeboten.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifyEmailMarketing} onChange={() => setNotifyEmailMarketing(!notifyEmailMarketing)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Sicherheitswarnungen</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Benachrichtigung bei neuen Logins oder Änderungen.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifyEmailSecurity} onChange={() => setNotifyEmailSecurity(!notifyEmailSecurity)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Wöchentliche Zusammenfassung</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Ein Überblick über Ihre Projektfortschritte jeden Montag.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={notifyWeeklyDigest} onChange={() => setNotifyWeeklyDigest(!notifyWeeklyDigest)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                             <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Browser & Push</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Support-Ticket Updates</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Sofortige Benachrichtigung bei Antworten vom Support.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={notifyPushTickets} onChange={() => setNotifyPushTickets(!notifyPushTickets)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
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
                                        <button type="submit" disabled={loading} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
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
                                <button onClick={() => { /* Navigate to transactions */ }} className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors backdrop-blur-sm">
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
