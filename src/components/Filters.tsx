import { useState } from 'react';
import { Search, SlidersHorizontal, X, Bed, Bath, Move, Home, Building2, Landmark, MapPin, Filter } from 'lucide-react';
import { useApp } from '../store';
import { Button, Input, Select, Badge } from './ui';
import { CITIES_DATA } from '../data';

const PROPERTY_TYPES = ['Any', 'House', 'Apartment', 'Villa', 'Condo', 'Townhouse', 'Commercial', 'Office', 'Land'];
const BEDROOMS = [{ label: 'Any', value: 0 }, { label: '1+', value: 1 }, { label: '2+', value: 2 }, { label: '3+', value: 3 }, { label: '4+', value: 4 }, { label: '5+', value: 5 }];
const BATHROOMS = [{ label: 'Any', value: 0 }, { label: '1+', value: 1 }, { label: '2+', value: 2 }, { label: '3+', value: 3 }, { label: '4+', value: 4 }];
const AMENITIES = ['Pool', 'Gym', 'Garden', 'Elevator', 'Security', 'Furnished', 'Parking', 'Balcony', 'Fireplace', 'Smart Home', 'EV Charging', 'Rooftop', 'Concierge', 'Pet Friendly'];

export function HeroSearch({ onSearch }: { onSearch?: () => void }) {
  const { filters, setFilters } = useApp();
  const [localQuery, setLocalQuery] = useState(filters.query);

  const modeLabels = { buy: 'Buy', rent: 'Rent', commercial: 'Commercial', new: 'New Construction' };
  const modes: Array<'buy' | 'rent' | 'commercial' | 'new'> = ['buy', 'rent', 'commercial', 'new'];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2">
        <div className="flex gap-1 p-1">
          {modes.map(m => (
            <button
              key={m}
              onClick={() => setFilters({ mode: m })}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                filters.mode === m
                  ? 'bg-brand-700 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {modeLabels[m]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2">
          <div className="md:col-span-5 relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={localQuery}
              onChange={e => setLocalQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { setFilters({ query: localQuery }); onSearch?.(); } }}
              placeholder="City, neighborhood, ZIP, or address"
              className="w-full pl-11 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <select
              value={filters.minPrice || ''}
              onChange={e => setFilters({ minPrice: Number(e.target.value) || 0 })}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">Min Price</option>
              <option value="100000">$100K</option>
              <option value="250000">$250K</option>
              <option value="500000">$500K</option>
              <option value="750000">$750K</option>
              <option value="1000000">$1M</option>
              <option value="2000000">$2M</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <select
              value={filters.maxPrice === 5000000 ? '' : filters.maxPrice}
              onChange={e => setFilters({ maxPrice: Number(e.target.value) || 5000000 })}
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">Max Price</option>
              <option value="250000">$250K</option>
              <option value="500000">$500K</option>
              <option value="750000">$750K</option>
              <option value="1000000">$1M</option>
              <option value="2000000">$2M</option>
              <option value="5000000">$5M+</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <Button
              className="w-full h-full"
              size="lg"
              onClick={() => { setFilters({ query: localQuery }); onSearch?.(); }}
            >
              <Search className="w-4 h-4" />
              Search Homes
            </Button>
          </div>
        </div>
      </div>
      <p className="text-center text-sm text-white/80 mt-4 drop-shadow">
        <span className="font-medium">{CITIES_DATA.length.toLocaleString()}</span> cities · <span className="font-medium">250K+</span> active listings · <span className="font-medium">12K+</span> top-rated agents
      </p>
    </div>
  );
}

export function AdvancedFilters({ onClose }: { onClose?: () => void }) {
  const { filters, setFilters, resetFilters } = useApp();
  const [amenities, setAmenities] = useState<string[]>(filters.amenities);

  const activeCount =
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 5000000 ? 1 : 0) +
    (filters.propertyType !== 'Any' ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.bathrooms > 0 ? 1 : 0) +
    (filters.minArea > 0 ? 1 : 0) +
    (amenities.length > 0 ? 1 : 0);

  const apply = () => {
    setFilters({ amenities });
    onClose?.();
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Advanced Filters</h3>
              <p className="text-sm text-slate-500">{activeCount} filter{activeCount !== 1 ? 's' : ''} active</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => { resetFilters(); setAmenities([]); }}>Reset all</Button>
            <Button onClick={apply}>Apply Filters</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <FilterGroup title="Price" icon={<Filter className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Min</label>
                <Input type="number" placeholder="0" value={filters.minPrice || ''} onChange={e => setFilters({ minPrice: Number(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Max</label>
                <Input type="number" placeholder="Any" value={filters.maxPrice === 5000000 ? '' : filters.maxPrice} onChange={e => setFilters({ maxPrice: Number(e.target.value) || 5000000 })} />
              </div>
            </div>
          </FilterGroup>

          <FilterGroup title="Property Type" icon={<Home className="w-4 h-4" />}>
            <Select value={filters.propertyType} onChange={e => setFilters({ propertyType: e.target.value })}>
              {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
            </Select>
          </FilterGroup>

          <FilterGroup title="Bedrooms" icon={<Bed className="w-4 h-4" />}>
            <div className="flex gap-1 flex-wrap">
              {BEDROOMS.map(b => (
                <button key={b.value} onClick={() => setFilters({ bedrooms: b.value })} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filters.bedrooms === b.value ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{b.label}</button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Bathrooms" icon={<Bath className="w-4 h-4" />}>
            <div className="flex gap-1 flex-wrap">
              {BATHROOMS.map(b => (
                <button key={b.value} onClick={() => setFilters({ bathrooms: b.value })} className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filters.bathrooms === b.value ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>{b.label}</button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Square Footage" icon={<Move className="w-4 h-4" />}>
            <Input type="number" placeholder="Min sqft" value={filters.minArea || ''} onChange={e => setFilters({ minArea: Number(e.target.value) || 0 })} />
          </FilterGroup>

          <FilterGroup title="Lot Size" icon={<Landmark className="w-4 h-4" />}>
            <Select>
              <option>Any</option>
              <option>0.25+ acres</option>
              <option>0.5+ acres</option>
              <option>1+ acres</option>
              <option>2+ acres</option>
            </Select>
          </FilterGroup>

          <FilterGroup title="Year Built" icon={<Building2 className="w-4 h-4" />}>
            <div className="grid grid-cols-2 gap-2">
              <Input type="number" placeholder="From" />
              <Input type="number" placeholder="To" />
            </div>
          </FilterGroup>

          <FilterGroup title="Parking" icon={<MapPin className="w-4 h-4" />}>
            <Select>
              <option>Any</option>
              <option>1+ space</option>
              <option>2+ spaces</option>
              <option>3+ spaces</option>
              <option>Garage</option>
            </Select>
          </FilterGroup>
        </div>

        <div className="mt-5">
          <FilterGroup title="Amenities" compact>
            <div className="flex flex-wrap gap-1.5">
              {AMENITIES.map(a => {
                const active = amenities.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => setAmenities(prev => active ? prev.filter(x => x !== a) : [...prev, a])}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${active ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </FilterGroup>
        </div>

        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
            <span className="text-sm text-slate-600 font-medium">Active:</span>
            {filters.propertyType !== 'Any' && <Chip label={filters.propertyType} onRemove={() => setFilters({ propertyType: 'Any' })} />}
            {filters.bedrooms > 0 && <Chip label={`${filters.bedrooms}+ beds`} onRemove={() => setFilters({ bedrooms: 0 })} />}
            {filters.bathrooms > 0 && <Chip label={`${filters.bathrooms}+ baths`} onRemove={() => setFilters({ bathrooms: 0 })} />}
            {filters.minPrice > 0 && <Chip label={`Min $${(filters.minPrice / 1000).toFixed(0)}K`} onRemove={() => setFilters({ minPrice: 0 })} />}
            {filters.maxPrice < 5000000 && <Chip label={`Max $${(filters.maxPrice / 1000000).toFixed(1)}M`} onRemove={() => setFilters({ maxPrice: 5000000 })} />}
            {filters.minArea > 0 && <Chip label={`${filters.minArea.toLocaleString()}+ sqft`} onRemove={() => setFilters({ minArea: 0 })} />}
            {amenities.map(a => <Chip key={a} label={a} onRemove={() => setAmenities(prev => prev.filter(x => x !== a))} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, icon, children, compact }: { title: string; icon?: React.ReactNode; children: React.ReactNode; compact?: boolean }) {
  return (
    <div className={compact ? '' : 'p-4 bg-slate-50 rounded-xl border border-slate-100'}>
      <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-3'} text-slate-700`}>
        {icon}
        <h4 className="text-sm font-semibold">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full border border-brand-200">
      {label}
      <button onClick={onRemove} className="hover:bg-brand-100 rounded-full p-0.5 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

export function FilterBar({ total, onToggleFilters, filtersOpen }: { total: number; onToggleFilters: () => void; filtersOpen: boolean }) {
  const { filters, setFilters } = useApp();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{total.toLocaleString()} homes found</h2>
        <p className="text-sm text-slate-500 mt-0.5">Updated just now · Browse listings on the map</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFilters}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-all ${filtersOpen ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <Select className="!w-auto" value="newest" onChange={() => setFilters({ query: filters.query })}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sqft">Square Footage</option>
          <option value="beds">Most Bedrooms</option>
        </Select>
      </div>
    </div>
  );
}

export function ActiveFiltersBadge() {
  const { filters, resetFilters } = useApp();
  const count =
    (filters.minPrice > 0 ? 1 : 0) +
    (filters.maxPrice < 5000000 ? 1 : 0) +
    (filters.propertyType !== 'Any' ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.bathrooms > 0 ? 1 : 0) +
    (filters.minArea > 0 ? 1 : 0);
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-2">
      <Badge variant="info">{count} filters active</Badge>
      <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-slate-700 font-medium">Clear</button>
    </div>
  );
}
