import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PROPERTIES } from '../data';
import { PropertyCard } from '../components/PropertyCard';
import { AdvancedFilters, FilterBar, ActiveFiltersBadge } from '../components/Filters';
import { MapView } from '../components/MapView';
import { Container } from '../components/ui';
import { useApp } from '../store';
import type { Property } from '../types';
import { LayoutGrid, Map as MapIcon, SlidersHorizontal } from 'lucide-react';

export function SearchPage({ initialMode }: { initialMode?: 'buy' | 'rent' | 'commercial' | 'new' }) {
  const { filters, setFilters } = useApp();
  const [view, setView] = useState<'grid' | 'map' | 'split'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const location = useLocation();

  useEffect(() => {
    if (initialMode) setFilters({ mode: initialMode });
    const q = new URLSearchParams(location.search).get('q');
    if (q) setFilters({ query: q });
  }, [initialMode, location.search]);

  const results = useMemo(() => filterProperties(PROPERTIES, filters), [filters]);

  return (
    <div>
      {filtersOpen && <AdvancedFilters onClose={() => setFiltersOpen(false)} />}

      <Container className="py-8">
        <FilterBar total={results.length} onToggleFilters={() => setFiltersOpen(o => !o)} filtersOpen={filtersOpen} />

        <div className="flex items-center justify-between mb-4">
          <ActiveFiltersBadge />
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
              <LayoutGrid className="w-4 h-4" /> Grid
            </button>
            <button onClick={() => setView('map')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
              <MapIcon className="w-4 h-4" /> Map
            </button>
            <button onClick={() => setView('split')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${view === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Split
            </button>
          </div>
        </div>

        {view === 'map' && (
          <div className="mb-6">
            <MapView properties={results} selectedId={selectedId} onSelect={setSelectedId} height="700px" />
          </div>
        )}

        {view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {results.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {view === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="order-2 lg:order-1 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
              {results.slice(0, 50).map(p => (
                <div key={p.id} onClick={() => setSelectedId(p.id)} className={`cursor-pointer transition-all ${selectedId === p.id ? 'ring-2 ring-brand-500 rounded-2xl' : ''}`}>
                  <PropertyCard property={p} compact />
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <MapView properties={results} selectedId={selectedId} onSelect={setSelectedId} height="600px" />
            </div>
          </div>
        )}

        {results.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mb-4">
              <MapIcon className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No properties match your filters</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search criteria or expanding your filters.</p>
          </div>
        )}
      </Container>
    </div>
  );
}

export function filterProperties(properties: Property[], filters: any): Property[] {
  const q = (filters.query || '').toLowerCase().trim();
  return properties.filter(p => {
    if (filters.mode === 'buy' && p.status === 'For Rent') return false;
    if (filters.mode === 'rent' && p.status !== 'For Rent') return false;
    if (filters.mode === 'commercial' && !['Commercial', 'Office'].includes(p.type)) return false;
    if (filters.mode === 'new' && p.status !== 'New Construction') return false;

    if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
    if (filters.maxPrice < 5000000 && p.price > filters.maxPrice) return false;
    if (filters.propertyType && filters.propertyType !== 'Any' && p.type !== filters.propertyType) return false;
    if (filters.bedrooms > 0 && p.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms > 0 && p.bathrooms < filters.bathrooms) return false;
    if (filters.minArea > 0 && p.area < filters.minArea) return false;
    if (filters.city && p.city !== filters.city) return false;
    if (filters.amenities && filters.amenities.length > 0) {
      const has = filters.amenities.every((a: string) => p.amenities.includes(a));
      if (!has) return false;
    }

    if (q) {
      const blob = `${p.title} ${p.address} ${p.city} ${p.state} ${p.zip} ${p.neighborhood} ${p.description} ${p.type}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}
