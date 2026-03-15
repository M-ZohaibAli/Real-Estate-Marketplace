import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Move, MapPin, Share2 } from 'lucide-react';
import { useApp } from '../store';
import type { Property } from '../types';
import { cn } from '../utils/cn';

export function formatPrice(p: Property) {
  if (p.status === 'For Rent') return `$${p.price.toLocaleString()}/mo`;
  if (p.price >= 1000000) return `$${(p.price / 1000000).toFixed(2)}M`;
  return `$${p.price.toLocaleString()}`;
}

export function PropertyCard({ property, compact, onCompareToggle }: { property: Property; compact?: boolean; onCompareToggle?: () => void }) {
  const { savedIds, toggleSave, comparisonIds, toggleCompare } = useApp();
  const saved = savedIds.includes(property.id);
  const comparing = comparisonIds.includes(property.id);

  return (
    <Link
      to={`/property/${property.id}`}
      className={cn(
        'group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
        compact && ''
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {property.status === 'For Sale' && <span className="px-2.5 py-1 text-xs font-semibold bg-brand-700 text-white rounded-full shadow-sm">For Sale</span>}
          {property.status === 'For Rent' && <span className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full shadow-sm">For Rent</span>}
          {property.status === 'New Construction' && <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-full shadow-sm">New</span>}
          {property.status === 'Sold' && <span className="px-2.5 py-1 text-xs font-semibold bg-slate-700 text-white rounded-full shadow-sm">Sold</span>}
          {property.luxury && <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-700 text-white rounded-full shadow-sm">★ Luxury</span>}
          {property.featured && !property.luxury && <span className="px-2.5 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full shadow-sm">Featured</span>}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); toggleSave(property.id); }}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
              saved ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
            )}
            aria-label={saved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={cn('w-4 h-4', saved && 'fill-current')} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onCompareToggle ? onCompareToggle() : toggleCompare(property.id); }}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md',
              comparing ? 'bg-brand-700 text-white' : 'bg-white/90 text-slate-700 hover:bg-white'
            )}
            aria-label="Compare"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18M7 14l4-4 4 4 5-5"/></svg>
          </button>
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 text-slate-700 hover:bg-white backdrop-blur-md transition-all shadow-md"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg text-white font-bold text-lg shadow-lg">
            {formatPrice(property)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">{property.title}</h3>
        <p className="flex items-center gap-1 text-sm text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{property.address}, {property.city}, {property.state}</span>
        </p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600">
          <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-slate-400" />{property.bedrooms || '—'} bd</span>
          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-400" />{property.bathrooms || '—'} ba</span>
          <span className="flex items-center gap-1.5"><Move className="w-4 h-4 text-slate-400" />{property.area.toLocaleString()} sqft</span>
        </div>
      </div>
    </Link>
  );
}
