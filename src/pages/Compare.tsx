import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, MapPin, Calculator } from 'lucide-react';
import { PROPERTIES } from '../data';
import { Container, Card, Button, Badge } from '../components/ui';
import { useApp } from '../store';
import { formatPrice } from '../components/PropertyCard';
import type { Property } from '../types';

export function ComparePage() {
  const { comparisonIds, toggleCompare } = useApp();
  const navigate = useNavigate();
  const properties = comparisonIds.map(id => PROPERTIES.find(p => p.id === id)).filter(Boolean) as Property[];

  if (properties.length === 0) {
    return (
      <Container className="py-20 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-slate-400 rounded-full mb-4">
          <Calculator className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No properties to compare</h2>
        <p className="text-slate-500 mt-2">Add up to 4 properties to see a side-by-side comparison.</p>
        <Button className="mt-6" onClick={() => navigate('/buy')}>Browse homes</Button>
      </Container>
    );
  }

  const rows: Array<{ label: string; values: (string | number | React.ReactNode)[]; highlight?: boolean; bestIndex?: number }> = [
    { label: 'Price', values: properties.map(p => formatPrice(p)), bestIndex: properties.reduce((best, p, i, arr) => p.price < arr[best].price ? i : best, 0) },
    { label: 'Status', values: properties.map(p => p.status) },
    { label: 'Type', values: properties.map(p => p.type) },
    { label: 'Bedrooms', values: properties.map(p => p.bedrooms), bestIndex: properties.reduce((best, p, i, arr) => p.bedrooms > arr[best].bedrooms ? i : best, 0) },
    { label: 'Bathrooms', values: properties.map(p => p.bathrooms), bestIndex: properties.reduce((best, p, i, arr) => p.bathrooms > arr[best].bathrooms ? i : best, 0) },
    { label: 'Living Area (sqft)', values: properties.map(p => p.area.toLocaleString()), bestIndex: properties.reduce((best, p, i, arr) => p.area > arr[best].area ? i : best, 0) },
    { label: 'Lot Size (sqft)', values: properties.map(p => p.lotSize.toLocaleString()) },
    { label: 'Price / sqft', values: properties.map(p => `$${Math.round(p.price / p.area).toLocaleString()}`), bestIndex: properties.reduce((best, p, i, arr) => (p.price / p.area) < (arr[best].price / arr[best].area) ? i : best, 0) },
    { label: 'Year Built', values: properties.map(p => p.yearBuilt) },
    { label: 'Parking', values: properties.map(p => `${p.parking} space(s)`) },
    { label: 'HOA Fees', values: properties.map(p => p.hoa > 0 ? `$${p.hoa}/mo` : 'None'), bestIndex: properties.reduce((best, p, i, arr) => p.hoa < arr[best].hoa ? i : best, 0) },
    { label: 'Property Taxes', values: properties.map(p => `$${p.taxes.toLocaleString()}/yr`) },
    { label: 'Neighborhood', values: properties.map(p => p.neighborhood) },
    { label: 'City', values: properties.map(p => `${p.city}, ${p.state}`) },
  ];

  const amenityList = Array.from(new Set(properties.flatMap(p => p.amenities)));

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/buy" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Compare Properties</h1>
          <p className="text-slate-500 mt-1">Side-by-side analysis of {properties.length} home{properties.length > 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/buy')}>Add more</Button>
      </div>

      {/* Property headers */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="min-w-[900px]">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
            <div className="p-4 bg-slate-50 rounded-tl-2xl border-b border-slate-200 font-semibold text-slate-700 text-sm flex items-center">
              {properties.length}/4 selected
            </div>
            {properties.map(p => (
              <div key={p.id} className="p-4 bg-white border-b border-slate-200 first:rounded-tr-2xl relative">
                <button onClick={() => toggleCompare(p.id)} className="absolute top-2 right-2 w-7 h-7 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full border border-slate-200 flex items-center justify-center transition-colors z-10">
                  <X className="w-4 h-4" />
                </button>
                <Link to={`/property/${p.id}`} className="block group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatPrice(p)}</p>
                  <p className="text-sm text-slate-600 line-clamp-1 mt-0.5">{p.bedrooms}bd · {p.bathrooms}ba · {p.area.toLocaleString()} sqft</p>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" />{p.city}, {p.state}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          {rows.map((row, i) => (
            <div key={i} className={`grid ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`} style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="p-4 text-sm font-medium text-slate-700 border-b border-slate-100">{row.label}</div>
              {row.values.map((v, j) => (
                <div key={j} className={`p-4 text-sm border-b border-slate-100 ${row.bestIndex === j ? 'text-brand-700 font-bold' : 'text-slate-900'}`}>
                  <div className="flex items-center gap-1.5">
                    {row.bestIndex === j && <Badge variant="info" className="!text-[10px] !py-0.5">Best</Badge>}
                    <span>{v}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Amenities */}
          <div className="grid bg-white" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium text-slate-700 border-b border-slate-100">Amenities</div>
            {properties.map(p => (
              <div key={p.id} className="p-4 text-sm border-b border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {p.amenities.map(a => (
                    <span key={a} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-200">
                      <Check className="w-3 h-3" /> {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Amenities matrix */}
          <div className="grid bg-slate-50 rounded-b-2xl" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
            <div className="p-4 text-sm font-medium text-slate-700">Full Amenity Matrix</div>
            {properties.map(() => <div key={Math.random()} className="p-4" />)}
          </div>
          {amenityList.map((a, i) => (
            <div key={a} className={`grid ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`} style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="px-4 py-2.5 text-sm text-slate-600">{a}</div>
              {properties.map(p => (
                <div key={p.id} className="px-4 py-2.5 text-sm text-center">
                  {p.amenities.includes(a) ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((p, i) => {
          const isLowestPrice = properties.every(x => p.price <= x.price);
          const isLargest = properties.every(x => p.area >= x.area);
          const isMostBeds = properties.every(x => p.bedrooms >= x.bedrooms);
          return (
            <Card key={p.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-700">Property {i + 1}</span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {isLowestPrice && <Badge variant="success">Best Price</Badge>}
                  {isLargest && <Badge variant="info">Largest</Badge>}
                  {isMostBeds && <Badge variant="warning">Most Beds</Badge>}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{formatPrice(p)}</p>
              <p className="text-sm text-slate-500 mt-1">{p.city}, {p.state}</p>
              <Link to={`/property/${p.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
                View details →
              </Link>
            </Card>
          );
        })}
      </div>
    </Container>
  );
}
