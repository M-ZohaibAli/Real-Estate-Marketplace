import { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Move as MoveIcon, Target, Flame } from 'lucide-react';
import type { Property } from '../types';
import { formatPrice } from './PropertyCard';
import { cn } from '../utils/cn';

interface MapViewProps {
  properties: Property[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  height?: string;
  showControls?: boolean;
  mode?: 'listings' | 'heatmap' | 'cluster';
}

// SVG-based map (simulated) — renders pins on a geographic canvas
// This provides a production-quality UI without requiring external API keys
export function MapView({ properties, selectedId, onSelect, height = '600px', showControls = true }: MapViewProps) {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 50, y: 50 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({ dragging: false, startX: 0, startY: 0, origX: 50, origY: 50 });

  // Compute bounds
  const bounds = useMemo(() => {
    if (properties.length === 0) return { minLat: 25, maxLat: 50, minLng: -125, maxLng: -70 };
    let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
    properties.forEach(p => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });
    const pad = 2;
    return { minLat: minLat - pad, maxLat: maxLat + pad, minLng: minLng - pad, maxLng: maxLng + pad };
  }, [properties]);

  const project = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x, y };
  };

  // Cluster by rounding coords into grid
  const clusters = useMemo(() => {
    if (heatmapMode) return [];
    const gridSize = Math.max(1.5, 6 / zoom);
    const map = new Map<string, { lat: number; lng: number; properties: Property[] }>();
    properties.forEach(p => {
      const key = `${Math.round(p.lat / gridSize)},${Math.round(p.lng / gridSize)}`;
      if (!map.has(key)) map.set(key, { lat: p.lat, lng: p.lng, properties: [] });
      map.get(key)!.properties.push(p);
    });
    return Array.from(map.values());
  }, [properties, zoom, heatmapMode, bounds]);

  // Mouse drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      dragState.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: center.x, origY: center.y };
    };
    const onMove = (e: MouseEvent) => {
      if (!dragState.current.dragging) return;
      const dx = (e.clientX - dragState.current.startX) / 5;
      const dy = (e.clientY - dragState.current.startY) / 5;
      setCenter({ x: dragState.current.origX - dx, y: dragState.current.origY - dy });
    };
    const onUp = () => { dragState.current.dragging = false; };
    el.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [center.x, center.y]);

  // Heatmap cells
  const heatCells = useMemo(() => {
    if (!heatmapMode) return [];
    const cells: { x: number; y: number; intensity: number; price: number }[] = [];
    const gridSize = 5;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = bounds.maxLat - ((i + 0.5) / gridSize) * (bounds.maxLat - bounds.minLat);
        const lng = bounds.minLng + ((j + 0.5) / gridSize) * (bounds.maxLng - bounds.minLng);
        const nearby = properties.filter(p => Math.abs(p.lat - lat) < 2 && Math.abs(p.lng - lng) < 2);
        if (nearby.length > 0) {
          cells.push({
            x: (j + 0.5) / gridSize * 100,
            y: (i + 0.5) / gridSize * 100,
            intensity: Math.min(1, nearby.length / 15),
            price: nearby.reduce((s, p) => s + p.price, 0) / nearby.length,
          });
        }
      }
    }
    return cells;
  }, [heatmapMode, properties, bounds]);

  const visibleClusters = zoom < 1.5 ? clusters : clusters.map(c => c.properties.map(p => ({ lat: p.lat, lng: p.lng, properties: [p] }))).flat();

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm select-none" style={{ height, cursor: dragState.current.dragging ? 'grabbing' : 'grab' }}>
      {/* Map background - stylized US with grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-brand-50/30">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M 4 0 L 0 0 0 4" fill="none" stroke="#e2e8f0" strokeWidth="0.15" />
            </pattern>
            <radialGradient id="heat" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          {/* Abstract landmass shapes */}
          <path d="M 10 30 Q 20 20 35 25 T 60 20 Q 75 22 85 30 Q 90 45 82 55 Q 75 70 60 75 Q 40 80 25 72 Q 10 60 10 30 Z" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="0.2" opacity="0.5" />
          <path d="M 20 40 Q 30 35 45 40 T 70 45 Q 75 55 65 60 Q 50 65 35 60 Q 20 55 20 40 Z" fill="#a7f3d0" stroke="#34d399" strokeWidth="0.15" opacity="0.4" />
        </svg>
      </div>

      {/* Content layer (pans) */}
      <div
        className="absolute inset-0 transition-transform duration-100"
        style={{ transform: `translate(${(50 - center.x) * zoom * 0.5}%, ${(50 - center.y) * zoom * 0.5}%) scale(${zoom})` }}
      >
        {/* Heatmap */}
        {heatmapMode && heatCells.map((c, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            left: `${c.x}%`, top: `${c.y}%`, width: `${20 * c.intensity}%`, height: `${20 * c.intensity}%`,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(239,68,68,${0.4 + c.intensity * 0.4}) 0%, rgba(245,158,11,${0.2 + c.intensity * 0.2}) 40%, transparent 70%)`,
          }} />
        ))}

        {/* Pins / clusters */}
        {!heatmapMode && visibleClusters.map((c, i) => {
          const pos = project(c.lat, c.lng);
          const isCluster = c.properties.length > 1;
          const main = c.properties[0];
          const active = selectedId === main.id || hoverId === main.id;
          const price = isCluster
            ? Math.round(c.properties.reduce((s, p) => s + p.price, 0) / c.properties.length)
            : main.price;
          return (
            <div
              key={i}
              className="absolute pin-drop"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -100%)', zIndex: active ? 30 : 10 }}
              onMouseEnter={() => setHoverId(main.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={(e) => { e.stopPropagation(); if (!isCluster && onSelect) onSelect(main.id); }}
            >
              {isCluster ? (
                <button className="relative group">
                  <div className="w-12 h-12 bg-brand-700 text-white rounded-full flex items-center justify-center font-bold shadow-xl border-4 border-white hover:scale-110 transition-transform">
                    {c.properties.length}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-brand-700" />
                </button>
              ) : (
                <Link to={`/property/${main.id}`} onClick={(e) => { if (onSelect) { e.preventDefault(); onSelect(main.id); } }} className="relative block group">
                  <div className={cn(
                    'px-2.5 py-1.5 rounded-xl shadow-xl font-bold text-xs whitespace-nowrap transition-all border-2',
                    active ? 'bg-slate-900 text-white border-white scale-110' : 'bg-white text-slate-900 border-slate-200 group-hover:bg-brand-700 group-hover:text-white group-hover:border-white group-hover:scale-105'
                  )}>
                    {main.status === 'For Rent' ? `$${price.toLocaleString()}/mo` : price >= 1000000 ? `$${(price / 1000000).toFixed(1)}M` : `$${Math.round(price / 1000)}K`}
                  </div>
                  <div className={cn('absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent', active ? 'border-t-slate-900' : 'border-t-white group-hover:border-t-brand-700')} />
                </Link>
              )}

              {active && !isCluster && (
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-40 animate-fadeIn">
                  <img src={main.images[0]} alt="" className="w-full h-28 object-cover" />
                  <div className="p-3">
                    <p className="font-bold text-slate-900">{formatPrice(main)}</p>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{main.bedrooms}bd · {main.bathrooms}ba · {main.area.toLocaleString()} sqft</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{main.city}, {main.state}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {showControls && (
        <>
          <div className="absolute top-4 right-4 flex flex-col gap-1 bg-white rounded-xl shadow-lg border border-slate-200 p-1">
            <button onClick={() => setZoom(z => Math.min(z + 0.25, 4))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Zoom in">
              <ZoomIn className="w-4 h-4 text-slate-700" />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Zoom out">
              <ZoomOut className="w-4 h-4 text-slate-700" />
            </button>
            <div className="h-px bg-slate-200 my-0.5" />
            <button onClick={() => { setZoom(1); setCenter({ x: 50, y: 50 }); }} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Reset view">
              <Target className="w-4 h-4 text-slate-700" />
            </button>
            <button onClick={() => setHeatmapMode(h => !h)} className={cn('p-2 rounded-lg transition-colors', heatmapMode ? 'bg-red-50 text-red-600' : 'hover:bg-slate-100 text-slate-700')} aria-label="Toggle heatmap">
              <Flame className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-700" aria-label="Layers">
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-brand-600" />
            {properties.length.toLocaleString()} properties
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 flex items-center gap-1.5 pointer-events-auto">
              <MoveIcon className="w-3 h-3" /> Drag to pan · Scroll to zoom
            </div>
            <div className="bg-white/90 backdrop-blur rounded-lg shadow-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 flex items-center gap-1.5 pointer-events-auto">
              <Navigation className="w-3 h-3" /> Live map view
            </div>
          </div>
        </>
      )}
    </div>
  );
}
