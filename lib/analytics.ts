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

/**
 * Session Management for Analytics
 * Maintains session state across page views using sessionStorage
 */

let currentSessionId: string | null = null;

/**
 * Retrieves or creates the current analytics session ID
 *
 * Uses sessionStorage to persist the session across page reloads.
 * A session represents a single user visit and is used to group related events.
 *
 * @returns {string} The current session ID (UUID v4 format)
 *
 * @example
 * ```ts
 * const sessionId = getSessionId();
 * console.log('Current session:', sessionId);
 * ```
 */
const getSessionId = (): string => {
    if (currentSessionId) return currentSessionId;

    // ✅ BUG FIX: Added SSR safety check for sessionStorage
    if (typeof window === 'undefined') {
      currentSessionId = crypto.randomUUID();
      return currentSessionId;
    }

    let sessionId = sessionStorage.getItem('analytics_session_id');

    if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('analytics_session_id', sessionId);
    }

    currentSessionId = sessionId;
    return sessionId;
};

/**
 * Resets the current analytics session
 *
 * Clears the in-memory session ID and removes it from sessionStorage.
 * Use this when a user logs out or when you want to start a new session.
 *
 * @example
 * ```ts
 * resetSession(); // Start fresh session after logout
 * ```
 */
const resetSession = () => {
    currentSessionId = null;
    // ✅ BUG FIX: Added SSR safety check for sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('analytics_session_id');
    }
};

/**
 * Tracks a page view event
 *
 * Records when a user views a page, including referrer, user agent, and screen resolution.
 * Automatically attaches the current user (if authenticated) and session ID.
 *
 * @param {string} path - The URL path of the page (e.g., '/pricing')
 * @param {string} [title] - Optional page title (defaults to document.title)
 * @param {Record<string, unknown>} [properties] - Additional custom properties to track
 *
 * @returns {Promise<void>}
 *
 * @example
 * ```ts
 * await trackPageView('/pricing', 'Pricing Page', { category: 'conversion' });
 * ```
 */
export const trackPageView = async (
    path: string,
    title?: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking page view:', error);
        }
    }
};

// Track User Action
export const trackUserAction = async (
    actionName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking user action:', error);
        }
    }
};

// Track Custom Event
export const trackCustomEvent = async (
    eventName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking custom event:', error);
        }
    }
};

// Track Conversion
export const trackConversion = async (
    conversionType: string,
    value?: number,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking conversion:', error);
        }
    }
};

// Track Form Submit
export const trackFormSubmit = async (
    formName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking form submit:', error);
        }
    }
};

// Track Button Click
export const trackButtonClick = async (
    buttonName: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking button click:', error);
        }
    }
};

// Track File Download
export const trackFileDownload = async (
    fileName: string,
    fileUrl: string,
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking file download:', error);
        }
    }
};

// Track Scroll Depth
export const trackScrollDepth = async (
    depth: number, // 0-100
    properties?: Record<string, unknown>
): Promise<void> => {
    try {
        // 🐛 BUG FIX: Added SSR safety check for window/document access
        if (typeof window === 'undefined') {
            return;
        }

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
        if (import.meta.env.DEV) {
          console.error('Error tracking scroll depth:', error);
        }
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
        if (import.meta.env.DEV) {
          console.error('Error saving analytics event:', error);
        }
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
        if (import.meta.env.DEV) {
          console.error('Error fetching analytics events:', error);
        }
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
        if (import.meta.env.DEV) {
          console.error('Error fetching analytics metrics:', error);
        }
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

/**
 * Helper Functions for Analytics Metrics Calculation
 */

/**
 * Calculates the bounce rate from analytics events
 *
 * Bounce rate is the percentage of sessions with only one event (typically a single page view).
 * A high bounce rate may indicate that users aren't finding what they're looking for.
 *
 * @param {AnalyticsEvent[]} events - Array of analytics events to analyze
 * @returns {number} Bounce rate percentage (0-100)
 *
 * @example
 * ```ts
 * const bounceRate = calculateBounceRate(events);
 * console.log(`Bounce rate: ${bounceRate}%`); // "Bounce rate: 45%"
 * ```
 */
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

/**
 * Calculates the average session duration in minutes
 *
 * Session duration is the time between the first and last event in a session.
 * Only sessions with more than one event are included in the calculation.
 *
 * @param {AnalyticsEvent[]} events - Array of analytics events to analyze
 * @returns {number} Average session duration in minutes (rounded to 1 decimal place)
 *
 * @example
 * ```ts
 * const avgDuration = calculateAvgSessionDuration(events);
 * console.log(`Avg session: ${avgDuration} min`); // "Avg session: 4.5 min"
 * ```
 */
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

/**
 * Calculates the top 10 most viewed pages
 *
 * Aggregates page views by path and returns them sorted by view count.
 *
 * @param {AnalyticsEvent[]} pageViews - Array of page_view events
 * @returns {Array<{ path: string; views: number }>} Top 10 pages with view counts
 *
 * @example
 * ```ts
 * const topPages = calculateTopPages(pageViews);
 * // Returns: [{ path: '/home', views: 150 }, { path: '/pricing', views: 89 }, ...]
 * ```
 */
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

/**
 * Calculates the top 10 traffic sources (referrers)
 *
 * Aggregates visits by referrer and returns them sorted by visit count.
 * Direct traffic (no referrer) is labeled as "Direct".
 *
 * @param {AnalyticsEvent[]} pageViews - Array of page_view events
 * @returns {Array<{ source: string; visits: number }>} Top 10 referrers with visit counts
 *
 * @example
 * ```ts
 * const topReferrers = calculateTopReferrers(pageViews);
 * // Returns: [{ source: 'google.com', visits: 120 }, { source: 'Direct', visits: 85 }, ...]
 * ```
 */
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

/**
 * Sets up automatic analytics tracking for page views and scroll depth
 *
 * Initializes automatic tracking without manual event calls:
 * - Tracks initial page view on setup
 * - Monitors DOM changes to detect SPA navigation (route changes)
 * - Tracks scroll depth at 25%, 50%, 75%, and 100% milestones
 *
 * **IMPORTANT**: Call the returned cleanup function when unmounting components
 * to prevent memory leaks and duplicate event listeners.
 *
 * @returns {() => void} Cleanup function that removes event listeners and observers
 *
 * @example
 * ```ts
 * // In a React component
 * useEffect(() => {
 *   const cleanup = setupAutoTracking();
 *   return () => cleanup(); // Clean up on unmount
 * }, []);
 * ```
 */
export const setupAutoTracking = (): (() => void) => {
    // 🐛 BUG FIX: Added SSR safety check for window/document access
    if (typeof window === 'undefined') {
        return () => {}; // No-op on server
    }

    trackPageView(window.location.pathname, document.title);

    let lastPath = window.location.pathname;
    const observer = new MutationObserver(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            trackPageView(lastPath, document.title);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    let maxDepth = 0;
    const depths = [25, 50, 75, 100];

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

    return () => {
        observer.disconnect();
        window.removeEventListener('scroll', handleScroll);
    };
};

export { getSessionId, resetSession };
