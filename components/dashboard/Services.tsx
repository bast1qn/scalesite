
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { CheckBadgeIcon, PlusCircleIcon, XMarkIcon, TicketIcon, ArrowRightIcon, ClockIcon } from '../Icons';
import { api } from '../../lib/api';
import { DashboardView } from '../../pages/DashboardPage';

interface Service {
    id: number;
    name: string;
    description: string;
    price: number;
    price_details: string;
}

interface UserService {
    id: string;
    service_id: number;
    status: string;
    services: Service;
}

interface ServicesProps {
    setActiveView?: (view: DashboardView) => void;
}

// Modal State Interface
interface BookingModalState {
    isOpen: boolean;
    serviceId: number | null;
    serviceName: string;
    servicePrice: number | null;
    step: 'confirm' | 'processing' | 'success' | 'error';
    errorMessage?: string;
}

const Services: React.FC<ServicesProps> = ({ setActiveView }) => {
    const { user } = useContext(AuthContext);
    const [activeServices, setActiveServices] = useState<UserService[]>([]); 
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [bookingModal, setBookingModal] = useState<BookingModalState>({
        isOpen: false,
        serviceId: null,
        serviceName: '',
        servicePrice: null,
        step: 'confirm'
    });

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data: allServices } = await api.getServices();
            const { data: userBookings } = await api.getUserServices();

            const booked = (userBookings as any[] || []);
            setActiveServices(booked);

            const bookedIds = booked.map(b => b.service_id);
            const available = (allServices as Service[] || []).filter(s => !bookedIds.includes(s.id));
            setAvailableServices(available);

        } catch (err: any) {
            console.error("Error fetching services:", err);
            setError("Dienste konnten nicht geladen werden.");
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (service: Service) => {
        setBookingModal({
            isOpen: true,
            serviceId: service.id,
            serviceName: service.name,
            servicePrice: service.price,
            step: 'confirm'
        });
    };

    const closeBookingModal = () => {
        setBookingModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleConfirmBooking = async () => {
        if (!user || !bookingModal.serviceId) return;
        
        setBookingModal(prev => ({ ...prev, step: 'processing' }));
        
        try {
             const { data } = await api.bookService(bookingModal.serviceId);
             if(data.success) {
                 setBookingModal(prev => ({ ...prev, step: 'success' }));
                 // Refresh list in background
                 fetchData();
             } else {
                 throw new Error("Unbekannter Fehler");
             }
        } catch (err: any) {
            setBookingModal(prev => ({ 
                ...prev, 
                step: 'error', 
                errorMessage: err.message || "Fehler bei der Buchung." 
            }));
        }
    }

    const handleSuccessAction = () => {
        closeBookingModal();
        if (setActiveView) {
            setActiveView('ticket-support');
        }
    };

    // Filter services based on status
    const confirmedServices = activeServices.filter(s => s.status === 'active' || s.status === 'completed');
    const pendingServices = activeServices.filter(s => s.status === 'pending');

    if (loading) {
        return (
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Ihre Dienstleistungen</h1>
                <p className="mt-2 text-dark-text/80 dark:text-light-text/80">Lade Dienste...</p>
                <div className="mt-8 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
         return (
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Ihre Dienstleistungen</h1>
                 <div className="mt-8 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600/50 text-red-700 dark:text-red-300 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Fehler!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text dark:text-light-text">Ihre Dienstleistungen</h1>
            <p className="mt-2 text-dark-text/80 dark:text-light-text/80">
                Verwalten Sie Ihre gebuchten Pakete und entdecken Sie weitere Möglichkeiten.
            </p>

            {/* Pending Requests Section */}
            {pendingServices.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-dark-text dark:text-light-text mb-4 flex items-center gap-2">
                        Offene Anfragen
                        <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-bold px-2 py-0.5 rounded-full">
                            {pendingServices.length}
                        </span>
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        {pendingServices.map(item => (
                            <div key={item.id} className="bg-yellow-50/50 dark:bg-yellow-900/10 p-6 rounded-xl shadow-sm border border-yellow-200 dark:border-yellow-800/30 flex items-start gap-4">
                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-dark-text dark:text-light-text">{item.services.name}</h3>
                                    <p className="text-sm text-dark-text/70 dark:text-light-text/70 mb-3">{item.services.description}</p>
                                    <div className="inline-flex items-center gap-2 text-xs font-medium text-yellow-700 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                        </span>
                                        Wartet auf Bestätigung
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12">
                <h2 className="text-xl font-bold text-dark-text dark:text-light-text mb-4">Aktive Dienste</h2>
                {confirmedServices.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {confirmedServices.map(item => (
                            <div key={item.id} className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10 flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-green-500/20 rounded-full text-green-500">
                                    <CheckBadgeIcon />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-dark-text dark:text-light-text">{item.services.name}</h3>
                                    <p className="text-sm text-dark-text/70 dark:text-light-text/70">{item.services.description}</p>
                                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 text-xs text-slate-500 flex justify-between items-center">
                                        <span>Status: Aktiv</span>
                                        <span className="text-green-600 dark:text-green-400 font-medium">Laufend</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-dark-text/70 dark:text-light-text/70 p-8 bg-surface dark:bg-dark-surface rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                        Sie haben derzeit keine aktiven Dienste.
                    </div>
                )}
            </div>

             <div className="mt-12">
                <h2 className="text-xl font-bold text-dark-text dark:text-light-text mb-4">Weitere Dienste buchen</h2>
                {availableServices.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {availableServices.map(service => (
                            <div key={service.id} className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md border border-dark-text/10 dark:border-light-text/10">
                               <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-dark-text dark:text-light-text">{service.name}</h3>
                                        <p className="mt-1 text-sm text-dark-text/70 dark:text-light-text/70">{service.description}</p>
                                    </div>
                                    <p className="font-bold text-dark-text dark:text-light-text text-lg whitespace-nowrap ml-4">
                                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(service.price)}
                                        <span className="block text-xs font-normal text-dark-text/60 dark:text-light-text/60 text-right">{service.price_details}</span>
                                    </p>
                               </div>
                               <button 
                                    onClick={() => openBookingModal(service)} 
                                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-all w-full sm:w-auto justify-center"
                               >
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Anfragen
                               </button>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <p className="text-dark-text/70 dark:text-light-text/70">Alle verfügbaren Dienste sind bereits aktiv oder angefragt.</p>
                 )}
            </div>

            {/* CUSTOM BOOKING MODAL */}
            {bookingModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {bookingModal.step === 'confirm' && 'Dienst anfragen'}
                                {bookingModal.step === 'processing' && 'Wird bearbeitet...'}
                                {bookingModal.step === 'success' && 'Erfolgreich'}
                                {bookingModal.step === 'error' && 'Fehler'}
                            </h3>
                            {bookingModal.step !== 'processing' && (
                                <button onClick={closeBookingModal} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="p-6">
                            {/* CONFIRMATION STEP */}
                            {bookingModal.step === 'confirm' && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                                            <PlusCircleIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold uppercase text-primary/70 tracking-wider">Auswahl</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{bookingModal.serviceName}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Möchten Sie diesen Dienst verbindlich anfragen?
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                        Hinweis: Durch die Bestätigung wird automatisch ein <strong>Support-Ticket</strong> erstellt, in dem wir die Details und nächsten Schritte mit Ihnen besprechen. Erst nach Ihrer finalen Freigabe im Ticket wird der Dienst aktiviert.
                                    </p>

                                    <div className="flex gap-3 pt-2">
                                        <button onClick={closeBookingModal} className="flex-1 py-3 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
                                            Abbrechen
                                        </button>
                                        <button onClick={handleConfirmBooking} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 transition-all transform active:scale-95 text-sm">
                                            Verbindlich anfragen
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PROCESSING STEP */}
                            {bookingModal.step === 'processing' && (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Anfrage wird erstellt...</p>
                                    <p className="text-sm text-slate-500 mt-2">Bitte warten Sie einen Moment.</p>
                                </div>
                            )}

                            {/* SUCCESS STEP */}
                            {bookingModal.step === 'success' && (
                                <div className="flex flex-col items-center text-center space-y-4 py-2">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2 animate-scale-in">
                                        <CheckBadgeIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Vielen Dank!</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                                        Ihre Anfrage für <strong>{bookingModal.serviceName}</strong> wurde erfolgreich übermittelt. Ein Ticket wurde erstellt.
                                    </p>
                                    
                                    <button onClick={handleSuccessAction} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                                        <TicketIcon className="w-5 h-5" />
                                        Zum Ticket wechseln
                                    </button>
                                    <button onClick={closeBookingModal} className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 pt-2">
                                        Hier bleiben
                                    </button>
                                </div>
                            )}

                            {/* ERROR STEP */}
                            {bookingModal.step === 'error' && (
                                <div className="flex flex-col items-center text-center space-y-4 py-4">
                                     <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-2">
                                        <XMarkIcon className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Hoppla!</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg w-full">
                                        {bookingModal.errorMessage}
                                    </p>
                                    <button onClick={() => setBookingModal(prev => ({ ...prev, step: 'confirm' }))} className="w-full py-3 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                        Erneut versuchen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Services;
