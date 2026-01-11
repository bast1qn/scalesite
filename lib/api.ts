
// API Client für ScaleSite Backend

// Bestimme die API URL basierend auf der Umgebung
const getApiUrl = () => {
    // Wenn eine Umgebungsvariable gesetzt ist (z.B. durch Vite/Vercel)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) {
        return (import.meta as any).env.VITE_API_URL;
    }
    
    // Im Entwicklungsmodus auf Localhost zurückfallen, wenn keine Env Var da ist
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:3001/api';
    }

    // Im Produktionsmodus relative Pfade nutzen (Proxy) oder Fallback
    return '/api';
};

const API_URL = getApiUrl();

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response: Response) => {
    const text = await response.text();
    let data;
    
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        console.error("API JSON Parse Error:", text.substring(0, 200));
        // Fallback for non-JSON errors (e.g. 500 HTML page)
        if (!response.ok) {
             throw new Error(`Server Error ${response.status}: ${response.statusText}`);
        }
        // If parsing fails but status is 200, return null if empty, else invalid format
        if (text.trim() === '') return null; 
        throw new Error("Invalid JSON response from server");
    }
    
    if (!response.ok) {
        throw new Error(data?.error || `API Error: ${response.status}`);
    }
    
    return data;
};

export const api = {
    get: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: getHeaders(),
            });
            const data = await handleResponse(response);
            return { data, error: null };
        } catch (err: any) {
            console.error(`GET ${endpoint} failed:`, err);
            return { data: null, error: err.message };
        }
    },

    post: async (endpoint: string, body: any) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body),
            });
            const data = await handleResponse(response);
            return { data, error: null };
        } catch (err: any) {
            console.error(`POST ${endpoint} failed:`, err);
            return { data: null, error: err.message };
        }
    },

    put: async (endpoint: string, body: any) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body),
            });
            const data = await handleResponse(response);
            return { data, error: null };
        } catch (err: any) {
             console.error(`PUT ${endpoint} failed:`, err);
             return { data: null, error: err.message };
        }
    },

    delete: async (endpoint: string) => {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            const data = await handleResponse(response);
            return { data, error: null };
        } catch (err: any) {
            console.error(`DELETE ${endpoint} failed:`, err);
            return { data: null, error: err.message };
        }
    },
    
    fetchStats: async () => {
        try {
            const response = await fetch(`${API_URL}/stats`, {
                method: 'GET',
                headers: getHeaders(),
            });
            // Stats specific handling to avoid breaking dashboard on error
            if (!response.ok) return { data: { ticketCount: 0, serviceCount: 0 }, error: true };
            const data = await handleResponse(response);
            return { data, error: null };
        } catch (e) {
            return { data: { ticketCount: 0, serviceCount: 0 }, error: true };
        }
    }
};
