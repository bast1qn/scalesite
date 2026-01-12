
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { CustomSelect } from '../CustomSelect';
import { AppUser } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { PlusCircleIcon, XMarkIcon, BriefcaseIcon, CheckBadgeIcon, ArrowPathIcon, SparklesIcon } from '../Icons';
import { setDashboardLanguage, alertError, alertSaveFailed } from '../../lib/dashboardAlerts';

type UserProfile = AppUser;

interface Service {
    id: number | string; // Allow string for temp IDs
    name: string;
    description: string;
    price: number;
    price_details: string;
}

interface UserService {
    id: string;
    name: string;
    status: string;
    progress: number;
    updates: { message: string, created_at: string, author_name: string }[];
}

// Default Automation Services meant to be available for quick selection
const DEFAULT_SERVICES: Service[] = [
    { id: 'auto-1', name: "KI-Telefonassistent (Voice AI)", description: "Einrichtung eines KI-Agenten für Terminbuchungen.", price: 149, price_details: "einmalig" },
    { id: 'auto-2', name: "E-Mail Automation (Inbox Zero)", description: "Automatische Kategorisierung und Antworten.", price: 99, price_details: "einmalig" },
    { id: 'auto-3', name: "CRM & Lead Scoring Setup", description: "Verbindung von Formularen mit CRM System.", price: 89, price_details: "einmalig" },
    { id: 'auto-4', name: "Social Media Autopilot", description: "Content-Planung und automatisches Posting.", price: 79, price_details: "einmalig" },
    { id: 'auto-5', name: "Dokumenten-Analyse Bot", description: "KI liest PDFs und extrahiert Daten.", price: 129, price_details: "einmalig" },
];

const UserManagement: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    
    const roleOptions: { value: AppUser['role'], label: string }[] = [
        { value: 'user', label: 'User' },
        { value: 'team', label: 'Team' },
        { value: 'owner', label: 'Owner' },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            if (!user) return;
            try {
                setLoading(true);
                const { data } = await api.adminGetUsers();
                setUsers(data as UserProfile[] || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Fehler beim Laden.");
            } finally {
                setLoading(false);
            }
        };

        const fetchServices = async () => {
            try {
                const { data } = await api.getServices();
                const apiServices = data as Service[] || [];
                
                // Merge API services with default automation services
                // Ensure no duplicates if ID collisions occur (though api uses ints, defaults use strings)
                const combined = [...apiServices, ...DEFAULT_SERVICES];
                setAvailableServices(combined);
            } catch (e) { 
                console.warn("Failed services fetch", e); 
                setAvailableServices(DEFAULT_SERVICES);
            }
        };

        fetchUsers();
        fetchServices();
    }, [user]);

    const handleRoleChange = async (userId: string, newRole: AppUser['role']) => {
        const oldUsers = [...users];
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        try {
            await api.adminUpdateUserRole(userId, newRole);
        } catch(err) {
            alertError(err instanceof Error ? err.message : 'Unknown error');
            setUsers(oldUsers);
        }
    };

    const openProjectModal = (targetUser: UserProfile) => {
        setSelectedUser(targetUser);
        setShowProjectModal(true);
    };

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.company?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getRoleBadgeColor = (role: string) => {
        switch(role) {
            case 'owner': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'team': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Lade Daten...</div>;
    
    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('dashboard.nav.users')}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{users.length} registrierte Accounts</p>
                </div>
                <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
                />
            </div>

             {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">{error}</div>}

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nutzer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kontakt</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rolle</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aktionen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                                                {u.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900 dark:text-white">{u.name}</div>
                                                <div className="text-xs text-slate-500">{u.company || t('dashboard.alerts.no_company')}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        {user?.role === 'owner' ? (
                                             <select 
                                                value={u.role} 
                                                onChange={(e) => handleRoleChange(u.id, e.target.value as AppUser['role'])}
                                                className={`text-xs font-bold px-2 py-1 rounded-md border-none focus:ring-0 cursor-pointer ${getRoleBadgeColor(u.role)}`}
                                            >
                                                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`text-xs font-bold px-2 py-1 rounded-md inline-block ${getRoleBadgeColor(u.role)}`}>
                                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openProjectModal(u)}
                                            className="text-xs font-semibold text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors"
                                        >
                                            {t('dashboard.alerts.manage_projects')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showProjectModal && selectedUser && (
                <ProjectManagementModal user={selectedUser} services={availableServices} onClose={() => setShowProjectModal(false)} />
            )}
        </div>
    );
};

const ProjectManagementModal: React.FC<{ user: UserProfile; services: Service[]; onClose: () => void; }> = ({ user, services, onClose }) => {
    const [activeTab, setActiveTab] = useState<'manage' | 'assign'>('manage');
    const [userServices, setUserServices] = useState<UserService[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoadingData(true);
            try {
                const { data } = await api.adminGetUserServices(user.id);
                setUserServices(data || []);
                if ((data || []).length === 0) setActiveTab('assign');
            } catch(e) {} finally { setLoadingData(false); }
        };
        load();
    }, [user.id, refreshTrigger]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Projekte: {user.name}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><XMarkIcon className="w-5 h-5" /></button>
                </div>
                
                <div className="flex border-b border-slate-100 dark:border-slate-800">
                    <button onClick={() => setActiveTab('manage')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'manage' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Laufend</button>
                    <button onClick={() => setActiveTab('assign')} className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'assign' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Zuweisen</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
                    {activeTab === 'manage' ? (
                        loadingData ? <div className="text-center py-10 text-slate-400">Lade...</div> :
                        userServices.length === 0 ? <div className="text-center py-10 text-slate-400">{t('dashboard.alerts.no_projects')}</div> :
                        <div className="space-y-6">
                            {userServices.map(s => (
                                <ProjectCard key={s.id} service={s} onUpdate={() => setRefreshTrigger(prev => prev + 1)} />
                            ))}
                        </div>
                    ) : (
                        <AssignServiceForm user={user} services={services} onSuccess={() => { setRefreshTrigger(p => p + 1); setActiveTab('manage'); }} />
                    )}
                </div>
            </div>
        </div>
    );
};

const AssignServiceForm: React.FC<{ user: UserProfile; services: Service[]; onSuccess: () => void; }> = ({ user, services, onSuccess }) => {
    const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id.toString() || '');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Custom Service Form
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newPriceDetails, setNewPriceDetails] = useState('einmalig');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const payload: { userId: string; serviceId?: number; customService?: { name: string; description: string; price: number; price_details: string } } = { userId: user.id };

            if (isCreatingNew) {
                payload.customService = {
                    name: newName,
                    description: newDesc,
                    price: parseFloat(newPrice),
                    price_details: newPriceDetails
                };
            } else {
                const selected = services.find(s => s.id.toString() === selectedServiceId);

                // Ensure we handle non-integer IDs correctly as custom services to force creation in DB
                if (selected && typeof selected.id === 'string' && selected.id.toString().startsWith('auto-')) {
                    payload.customService = {
                        name: selected.name,
                        description: selected.description,
                        price: selected.price,
                        price_details: selected.price_details
                    };
                } else {
                    // Regular DB service
                    payload.serviceId = parseInt(selectedServiceId);
                }
            }

            await api.adminAssignService(payload);
            onSuccess();
        } catch (e) {
            alertError(e instanceof Error ? e.message : 'Unknown error');
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
                <span className="text-sm font-bold text-blue-900 dark:text-blue-200">Komplett neuen Service erstellen?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isCreatingNew} onChange={e => setIsCreatingNew(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {!isCreatingNew ? (
                <div>
                    <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Dienstleistung wählen</label>
                    <select value={selectedServiceId} onChange={e => setSelectedServiceId(e.target.value)} className="input-premium py-3">
                        {services.map(s => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.price}€)
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-2">Enthält alle Standard-Pakete sowie Automatisierungs-Lösungen.</p>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Name der Leistung</label>
                        <input required value={newName} onChange={e => setNewName(e.target.value)} className="input-premium py-2" placeholder="z.B. Individuelle API Integration" />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Beschreibung</label>
                         <input required value={newDesc} onChange={e => setNewDesc(e.target.value)} className="input-premium py-2" placeholder="Kurzbeschreibung für Rechnung" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Preis (€)</label>
                            <input required type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="input-premium py-2" placeholder="150" />
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Intervall</label>
                            <select value={newPriceDetails} onChange={e => setNewPriceDetails(e.target.value)} className="input-premium py-2">
                                <option value="einmalig">Einmalig</option>
                                <option value="/ Monat">Monatlich</option>
                                <option value="/ Jahr">Jährlich</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2">
                {loading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                    <>
                        {isCreatingNew ? <PlusCircleIcon className="w-5 h-5"/> : <CheckBadgeIcon className="w-5 h-5"/>}
                        {isCreatingNew ? 'Erstellen & Buchen' : 'Kostenpflichtig buchen'}
                    </>
                )}
            </button>
        </form>
    )
}

const ProjectCard: React.FC<{ service: UserService; onUpdate: () => void }> = ({ service, onUpdate }) => {
    const [status, setStatus] = useState(service.status);
    const [progress, setProgress] = useState(service.progress || 0);
    const [updateText, setUpdateText] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.adminUpdateUserService(service.id, { status, progress });
            if (updateText.trim()) {
                await api.adminAddServiceUpdate(service.id, updateText);
                setUpdateText('');
            }
            onUpdate();
        } catch(e) { alertSaveFailed(e instanceof Error ? e.message : 'Unknown error'); } finally { setSaving(false); }
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
            <div className="flex justify-between mb-4">
                <h4 className="font-bold text-slate-900 dark:text-white">{service.name}</h4>
                 <select value={status} onChange={e => setStatus(e.target.value)} className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded px-2 py-1 font-bold uppercase">
                    <option value="pending">Geplant</option>
                    <option value="active">Aktiv</option>
                    <option value="completed">Fertig</option>
                    <option value="cancelled">Storno</option>
                </select>
            </div>
            <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>Fortschritt</span><span>{progress}%</span></div>
                <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-800" />
            </div>
            <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {service.updates && service.updates.length > 0 ? service.updates.map((u, i) => (
                        <div key={i} className="pb-2 border-b border-slate-200 dark:border-slate-800 last:border-0 last:pb-0">
                            <p>{u.message}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{new Date(u.created_at).toLocaleDateString()}</p>
                        </div>
                    )) : <div>Keine Updates.</div>}
                </div>
                <input type="text" value={updateText} onChange={e => setUpdateText(e.target.value)} placeholder="Neues Update schreiben..." className="w-full text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex justify-end">
                 <button onClick={handleSave} disabled={saving} className="text-xs bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                    {saving ? <ArrowPathIcon className="w-3 h-3 animate-spin"/> : <CheckBadgeIcon className="w-3 h-3"/>} Speichern
                </button>
            </div>
        </div>
    )
}

export default UserManagement;
