
import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

const SESSION_KEY = 'scalesite_session_id';

// Session Management
const getSessionId = (): string => {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch (e) {
    console.warn("Session storage access failed", e);
    return 'fallback-session';
  }
};

// Tracking Funktionen - Senden nun Daten an das Backend
export const trackPageView = (path: string) => {
  const sessionId = getSessionId();
  // Fire and forget
  api.post('/analytics/event', {
      sessionId,
      type: 'pageview',
      path,
      timestamp: Date.now()
  }).catch(err => console.warn("Tracking failed", err));
};

export const trackClick = (elementName: string, path: string) => {
  const sessionId = getSessionId();
  api.post('/analytics/event', {
      sessionId,
      type: 'click',
      element: elementName,
      path,
      timestamp: Date.now()
  }).catch(err => console.warn("Tracking failed", err));
};
