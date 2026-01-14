import { supabase } from './supabase';

// Analytics Event Types
export type AnalyticsEventType =
    | 'page_view'
    | 'user_action'
    | 'custom_event'
    | 'conversion'
    | 'form_submit'
    | 'button_click'
    | 'file_download'
    | 'video_play'
    | 'scroll_depth';

export interface AnalyticsEvent {
    id?: string;
    user_id?: string;
    session_id: string;
    event_type: AnalyticsEventType;
    event_name: string;
    page_path: string;
    page_title?: string;
    properties?: Record<string, unknown>;
    timestamp?: string;
}

// Session Management
let currentSessionId: string | null = null;

const getSessionId = (): string => {
    if (currentSessionId) return currentSessionId;

    // Try to get from sessionStorage
    let sessionId = sessionStorage.getItem('analytics_session_id');

    if (!sessionId) {
        // Create new session
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('analytics_session_id', sessionId);
    }

    currentSessionId = sessionId;
    return sessionId;
};

const resetSession = () => {
    currentSessionId = null;
    sessionStorage.removeItem('analytics_session_id');
};

// Track Page View
export const trackPageView = async (
    path: string,
    title?: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'page_view',
            event_name: 'page_view',
            page_path: path,
            page_title: title,
            properties: {
                ...properties,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screen: `${window.screen.width}x${window.screen.height}`
            }
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
};

// Track User Action
export const trackUserAction = async (
    actionName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'user_action',
            event_name: actionName,
            page_path: window.location.pathname,
            page_title: document.title,
            properties
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking user action:', error);
    }
};

// Track Custom Event
export const trackCustomEvent = async (
    eventName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'custom_event',
            event_name: eventName,
            page_path: window.location.pathname,
            page_title: document.title,
            properties
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking custom event:', error);
    }
};

// Track Conversion
export const trackConversion = async (
    conversionType: string,
    value?: number,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'conversion',
            event_name: conversionType,
            page_path: window.location.pathname,
            page_title: document.title,
            properties: {
                ...properties,
                value
            }
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking conversion:', error);
    }
};

// Track Form Submit
export const trackFormSubmit = async (
    formName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'form_submit',
            event_name: formName,
            page_path: window.location.pathname,
            page_title: document.title,
            properties
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking form submit:', error);
    }
};

// Track Button Click
export const trackButtonClick = async (
    buttonName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'button_click',
            event_name: buttonName,
            page_path: window.location.pathname,
            page_title: document.title,
            properties
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking button click:', error);
    }
};

// Track File Download
export const trackFileDownload = async (
    fileName: string,
    fileUrl: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'file_download',
            event_name: 'file_download',
            page_path: window.location.pathname,
            page_title: document.title,
            properties: {
                ...properties,
                fileName,
                fileUrl
            }
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking file download:', error);
    }
};

// Track Scroll Depth
export const trackScrollDepth = async (
    depth: number, // 0-100
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        const event: AnalyticsEvent = {
            user_id: user?.id,
            session_id: getSessionId(),
            event_type: 'scroll_depth',
            event_name: 'scroll_depth',
            page_path: window.location.pathname,
            page_title: document.title,
            properties: {
                ...properties,
                depth
            }
        };

        await saveEvent(event);
    } catch (error) {
        console.error('Error tracking scroll depth:', error);
    }
};

// Save Event to Database
const saveEvent = async (event: AnalyticsEvent): Promise<void> => {
    try {
        const { error } = await supabase
            .from('analytics_events')
            .insert({
                user_id: event.user_id,
                session_id: event.session_id,
                event_type: event.event_type,
                event_name: event.event_name,
                page_path: event.page_path,
                page_title: event.page_title,
                properties: event.properties,
                timestamp: new Date().toISOString()
            });

        if (error) throw error;
    } catch (error) {
        console.error('Error saving analytics event:', error);
        throw error;
    }
};

// Get Analytics Events
export const getAnalyticsEvents = async (
    startDate: Date,
    endDate: Date,
    eventType?: AnalyticsEventType
): Promise<AnalyticsEvent[]> => {
    try {
        let query = supabase
            .from('analytics_events')
            .select('*')
            .gte('timestamp', startDate.toISOString())
            .lte('timestamp', endDate.toISOString())
            .order('timestamp', { ascending: false });

        if (eventType) {
            query = query.eq('event_type', eventType);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching analytics events:', error);
        return [];
    }
};

// Get Metrics
export const getAnalyticsMetrics = async (
    startDate: Date,
    endDate: Date
): Promise<{
    totalViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: Array<{ path: string; views: number }>;
    topReferrers: Array<{ source: string; visits: number }>;
}> => {
    try {
        const { data, error } = await supabase
            .from('analytics_events')
            .select('*')
            .gte('timestamp', startDate.toISOString())
            .lte('timestamp', endDate.toISOString());

        if (error) throw error;

        const events = data || [];
        const pageViews = events.filter(e => e.event_type === 'page_view');

        // Calculate metrics
        const totalViews = pageViews.length;
        const uniqueVisitors = new Set(pageViews.map(e => e.session_id)).size;
        const bounceRate = calculateBounceRate(events);
        const avgSessionDuration = calculateAvgSessionDuration(events);
        const topPages = calculateTopPages(pageViews);
        const topReferrers = calculateTopReferrers(pageViews);

        return {
            totalViews,
            uniqueVisitors,
            bounceRate,
            avgSessionDuration,
            topPages,
            topReferrers
        };
    } catch (error) {
        console.error('Error fetching analytics metrics:', error);
        return {
            totalViews: 0,
            uniqueVisitors: 0,
            bounceRate: 0,
            avgSessionDuration: 0,
            topPages: [],
            topReferrers: []
        };
    }
};

// Helper Functions
const calculateBounceRate = (events: AnalyticsEvent[]): number => {
    const sessions = new Set(events.map(e => e.session_id));
    let bouncedSessions = 0;

    sessions.forEach(sessionId => {
        const sessionEvents = events.filter(e => e.session_id === sessionId);
        if (sessionEvents.length === 1) {
            bouncedSessions++;
        }
    });

    return sessions.size > 0 ? Math.round((bouncedSessions / sessions.size) * 100) : 0;
};

const calculateAvgSessionDuration = (events: AnalyticsEvent[]): number => {
    const sessions = new Set(events.map(e => e.session_id));
    const durations: number[] = [];

    sessions.forEach(sessionId => {
        const sessionEvents = events.filter(e => e.session_id === sessionId);
        if (sessionEvents.length > 1) {
            const first = new Date(sessionEvents[0].timestamp).getTime();
            const last = new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime();
            durations.push((last - first) / 1000 / 60); // Convert to minutes
        }
    });

    return durations.length > 0
        ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
        : 0;
};

const calculateTopPages = (pageViews: AnalyticsEvent[]): Array<{ path: string; views: number }> => {
    const pageMap = new Map<string, number>();

    pageViews.forEach(view => {
        const count = pageMap.get(view.page_path) || 0;
        pageMap.set(view.page_path, count + 1);
    });

    return Array.from(pageMap.entries())
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);
};

const calculateTopReferrers = (pageViews: AnalyticsEvent[]): Array<{ source: string; visits: number }> => {
    const referrerMap = new Map<string, number>();

    pageViews.forEach(view => {
        const referrer = view.properties?.referrer || 'Direct';
        const count = referrerMap.get(referrer) || 0;
        referrerMap.set(referrer, count + 1);
    });

    return Array.from(referrerMap.entries())
        .map(([source, visits]) => ({ source, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);
};

// Auto-tracking setup
// ✅ FIXED: Return cleanup function to prevent memory leaks
export const setupAutoTracking = (): (() => void) => {
    // Track initial page view
    trackPageView(window.location.pathname, document.title);

    // Track page changes (for SPA)
    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            trackPageView(lastPath, document.title);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Track scroll depth at 25%, 50%, 75%, 100%
    let maxDepth = 0;
    const depths = [25, 50, 75, 100];

    // ✅ FIXED: Store handler reference for proper cleanup
    const handleScroll = () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        depths.forEach(depth => {
            if (scrollPercent >= depth && maxDepth < depth) {
                maxDepth = depth;
                trackScrollDepth(depth);
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ✅ FIXED: Return cleanup function
    return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
    };
};

export { getSessionId, resetSession };
