import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Property, User, Lead } from './types';

interface Filters {
  query: string;
  mode: 'buy' | 'rent' | 'commercial' | 'new';
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  minArea: number;
  city: string;
  amenities: string[];
}

interface AppState {
  user: User | null;
  savedIds: string[];
  comparisonIds: string[];
  viewedIds: string[];
  searchHistory: string[];
  savedSearches: { id: string; name: string; query: string; count: number }[];
  leads: Lead[];
  filters: Filters;
  darkMode: boolean;
  notifications: { id: string; title: string; message: string; read: boolean; time: string }[];
  // actions
  setUser: (u: User | null) => void;
  toggleSave: (id: string) => void;
  toggleCompare: (id: string) => void;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  toggleDark: () => void;
  addLead: (lead: Lead) => void;
  markNotificationRead: (id: string) => void;
  addSavedSearch: (name: string, query: string, count: number) => void;
  removeSavedSearch: (id: string) => void;
  trackView: (id: string) => void;
  getRecommendations: (properties: Property[]) => Property[];
}

const defaultFilters: Filters = {
  query: '',
  mode: 'buy',
  minPrice: 0,
  maxPrice: 5000000,
  propertyType: 'Any',
  bedrooms: 0,
  bathrooms: 0,
  minArea: 0,
  city: '',
  amenities: [],
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('havenly_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('havenly_saved') || '[]'); } catch { return []; }
  });
  const [comparisonIds, setComparisonIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('havenly_compare') || '[]'); } catch { return []; }
  });
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('havenly_viewed') || '[]'); } catch { return []; }
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('havenly_history') || '[]'); } catch { return []; }
  });
  const [savedSearches, setSavedSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('havenly_saved_searches') || '[]'); } catch { return []; }
  });
  const [leads, setLeads] = useState<Lead[] | null>(() => {
    try {
      const raw = localStorage.getItem('havenly_leads');
      return raw ? (JSON.parse(raw) as Lead[]) : null;
    } catch { return null; }
  });
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'New lead received', message: 'John Anderson inquired about 123 Maple St', read: false, time: '2h ago' },
    { id: 'n2', title: 'Tour scheduled', message: 'Tour confirmed for Sat 2:00 PM', read: false, time: '5h ago' },
    { id: 'n3', title: 'Price drop alert', message: 'One of your saved properties dropped 5%', read: true, time: '1d ago' },
    { id: 'n4', title: 'Saved search match', message: '3 new listings match "Homes under $500k"', read: true, time: '2d ago' },
  ]);

  useEffect(() => { localStorage.setItem('havenly_saved', JSON.stringify(savedIds)); }, [savedIds]);
  useEffect(() => { localStorage.setItem('havenly_compare', JSON.stringify(comparisonIds)); }, [comparisonIds]);
  useEffect(() => { localStorage.setItem('havenly_viewed', JSON.stringify(viewedIds)); }, [viewedIds]);
  useEffect(() => { localStorage.setItem('havenly_history', JSON.stringify(searchHistory)); }, [searchHistory]);
  useEffect(() => { localStorage.setItem('havenly_saved_searches', JSON.stringify(savedSearches)); }, [savedSearches]);
  useEffect(() => { if (user) localStorage.setItem('havenly_user', JSON.stringify(user)); else localStorage.removeItem('havenly_user'); }, [user]);
  useEffect(() => { localStorage.setItem('havenly_leads', JSON.stringify(leads)); }, [leads]);

  const toggleSave = useCallback((id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const setFilters = useCallback((f: Partial<Filters>) => {
    setFiltersState(prev => ({ ...prev, ...f }));
    if (f.query && f.query.length > 2) {
      setSearchHistory(prev => {
        const next = [f.query!, ...prev.filter(q => q !== f.query)].slice(0, 10);
        return next;
      });
    }
  }, []);

  const resetFilters = useCallback(() => setFiltersState(defaultFilters), []);
  const toggleDark = useCallback(() => setDarkMode(d => !d), []);

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => prev ? [lead, ...prev] : [lead]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const addSavedSearch = useCallback((name: string, query: string, count: number) => {
    setSavedSearches((prev: { id: string; name: string; query: string; count: number }[]) => [...prev, { id: `ss${Date.now()}`, name, query, count }]);
  }, []);

  const removeSavedSearch = useCallback((id: string) => {
    setSavedSearches((prev: { id: string; name: string; query: string; count: number }[]) => prev.filter((s: { id: string }) => s.id !== id));
  }, []);

  const trackView = useCallback((id: string) => {
    setViewedIds(prev => {
      if (prev[0] === id) return prev;
      return [id, ...prev.filter(x => x !== id)].slice(0, 20);
    });
  }, []);

  const getRecommendations = useCallback((allProperties: Property[]): Property[] => {
    const viewed = viewedIds.slice(0, 5);
    if (viewed.length === 0 && savedIds.length === 0) {
      return allProperties.filter(p => p.featured).slice(0, 8);
    }
    const relevantIds = [...savedIds, ...viewed];
    const relevant = allProperties.filter(p => relevantIds.includes(p.id));
    if (relevant.length === 0) return allProperties.slice(0, 8);
    const avgPrice = relevant.reduce((s, p) => s + p.price, 0) / relevant.length;
    const cities = new Set(relevant.map(p => p.city));
    const types = new Set(relevant.map(p => p.type));
    const scored = allProperties
      .filter(p => !relevantIds.includes(p.id))
      .map(p => {
        let score = 0;
        if (cities.has(p.city)) score += 3;
        if (types.has(p.type)) score += 2;
        const priceDiff = Math.abs(p.price - avgPrice) / avgPrice;
        if (priceDiff < 0.2) score += 3;
        else if (priceDiff < 0.4) score += 1;
        if (p.featured) score += 1;
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(x => x.p);
    return scored;
  }, [viewedIds, savedIds]);

  return (
    <AppContext.Provider value={{
      user, savedIds, comparisonIds, viewedIds, searchHistory, savedSearches,
      leads: leads || [], filters, darkMode, notifications,
      setUser, toggleSave, toggleCompare, setFilters, resetFilters, toggleDark,
      addLead, markNotificationRead, addSavedSearch, removeSavedSearch, trackView,
      getRecommendations,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
