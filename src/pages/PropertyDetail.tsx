import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Bed, Bath, Move, MapPin, Calendar, Phone, MessageSquare, Share2, ChevronLeft, ChevronRight, Play, Check, Building2, Car, Trees, Home as HomeIcon, Layers, FileText, Users, TrendingUp, Calculator, Send, Clock, Star } from 'lucide-react';
import { PROPERTIES, AGENTS, NEIGHBORHOOD_STATS, MARKET_HISTORY } from '../data';
import { PropertyCard, formatPrice } from '../components/PropertyCard';
import { MapView } from '../components/MapView';
import { Container, Card, Button, Badge, Modal, Input, Textarea } from '../components/ui';
import { useApp } from '../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = PROPERTIES.find(p => p.id === id);
  const { savedIds, toggleSave, toggleCompare, comparisonIds, trackView, addLead } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<'overview' | 'specs' | 'amenities' | 'neighborhood'>('overview');
  const [contactOpen, setContactOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mortgage, setMortgage] = useState({ price: property?.price || 0, down: 20, rate: 6.8, term: 30 });
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [tourForm, setTourForm] = useState({ name: '', email: '', phone: '', date: '', time: '', message: '' });
  const [submitted, setSubmitted] = useState<null | 'contact' | 'tour'>(null);

  useEffect(() => {
    if (property) {
      trackView(property.id);
      setMortgage(m => ({ ...m, price: property.price }));
    }
  }, [property?.id]);

  if (!property) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Property not found</h1>
        <p className="text-slate-500 mt-2">This listing may have been removed or is no longer available.</p>
        <Button className="mt-6" onClick={() => navigate('/buy')}>Browse all homes</Button>
      </Container>
    );
  }

  const agent = AGENTS.find(a => a.id === property.agentId) || AGENTS[0];
  const saved = savedIds.includes(property.id);
  const comparing = comparisonIds.includes(property.id);
  const similar = PROPERTIES.filter(p => p.id !== property.id && p.city === property.city).slice(0, 4);
  const nearby = PROPERTIES.filter(p => p.id !== property.id && Math.abs(p.lat - property.lat) < 1 && Math.abs(p.lng - property.lng) < 1).slice(0, 8);

  // Mortgage calc
  const principal = mortgage.price * (1 - mortgage.down / 100);
  const monthlyRate = mortgage.rate / 100 / 12;
  const n = mortgage.term * 12;
  const monthlyPI = monthlyRate === 0 ? principal / n : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const monthlyTax = (property.taxes || mortgage.price * 0.012) / 12;
  const monthlyInsurance = (mortgage.price * 0.0035) / 12;
  const monthlyHOA = property.hoa || 0;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;

  // ROI estimate
  const expectedRent = Math.round(mortgage.price * 0.008);
  const annualRent = expectedRent * 12;
  const capRate = (annualRent / mortgage.price) * 100;
  const cashOnCash = ((annualRent - totalMonthly * 12) / (mortgage.price - principal)) * 100;

  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      id: `l${Date.now()}`,
      name: form.name || 'Demo User',
      email: form.email || 'demo@havenly.com',
      phone: form.phone,
      message: form.message,
      propertyId: property.id,
      status: 'New',
      source: 'Property Page',
      createdAt: new Date().toISOString(),
    });
    setSubmitted('contact');
    setTimeout(() => { setContactOpen(false); setSubmitted(null); setForm({ name: '', email: '', phone: '', message: '' }); }, 2000);
  };

  const submitTour = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted('tour');
    setTimeout(() => { setTourOpen(false); setSubmitted(null); setTourForm({ name: '', email: '', phone: '', date: '', time: '', message: '' }); }, 2000);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <Container className="py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto no-scrollbar">
            <Link to="/" className="hover:text-brand-700">Home</Link>
            <span>/</span>
            <Link to="/buy" className="hover:text-brand-700">{property.status === 'For Rent' ? 'Rent' : 'Buy'}</Link>
            <span>/</span>
            <Link to={`/city/${property.city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-brand-700">{property.city}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium truncate">{property.address}</span>
          </div>
        </Container>
      </div>

      {/* Image gallery */}
      <Container className="pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
          <div className="md:col-span-3 relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setGalleryOpen(true)}>
            <img src={property.images[imgIdx]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => i === 0 ? property.images.length - 1 : i - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => i === property.images.length - 1 ? 0 : i + 1); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
            <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900/70 text-white text-sm rounded-lg backdrop-blur">
              <Play className="w-3.5 h-3.5" /> {imgIdx + 1} / {property.images.length}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {property.images.slice(1, 5).map((src, i) => (
              <button key={i} onClick={() => setImgIdx(i + 1)} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden group">
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                {i === 3 && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white font-semibold text-sm">
                    +{property.images.length - 4} more
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Title + actions */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {property.status === 'For Sale' && <Badge variant="info">For Sale</Badge>}
              {property.status === 'For Rent' && <Badge variant="info">For Rent</Badge>}
              {property.status === 'New Construction' && <Badge variant="success">New Construction</Badge>}
              {property.luxury && <Badge variant="luxury">★ Luxury</Badge>}
              <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Listed {Math.round((Date.now() - new Date(property.createdAt).getTime()) / 86400000)} days ago</span>
              <span className="text-xs text-slate-500">· {property.views.toLocaleString()} views</span>
              <span className="text-xs text-slate-500">· {property.saves.toLocaleString()} saves</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{property.title}</h1>
            <p className="text-lg text-slate-600 mt-2 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-slate-400" />
              {property.address}, {property.city}, {property.state} {property.zip}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl md:text-5xl font-bold text-slate-900">{formatPrice(property)}</div>
            {property.status !== 'For Rent' && <p className="text-sm text-slate-500 mt-1">${Math.round(property.price / property.area).toLocaleString()}/sqft</p>}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Bed className="w-5 h-5" />, label: 'Bedrooms', value: property.bedrooms || 'Studio' },
            { icon: <Bath className="w-5 h-5" />, label: 'Bathrooms', value: property.bathrooms },
            { icon: <Move className="w-5 h-5" />, label: 'Living Area', value: `${property.area.toLocaleString()} sqft` },
            { icon: <Layers className="w-5 h-5" />, label: 'Lot Size', value: `${property.lotSize.toLocaleString()} sqft` },
          ].map((s, i) => (
            <Card key={i} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center flex-shrink-0">{s.icon}</div>
              <div>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="font-bold text-slate-900">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button onClick={() => setContactOpen(true)}><MessageSquare className="w-4 h-4" /> Contact Agent</Button>
          <Button variant="outline" onClick={() => setTourOpen(true)}><Calendar className="w-4 h-4" /> Schedule a Tour</Button>
          <Button variant={saved ? 'secondary' : 'outline'} onClick={() => toggleSave(property.id)}>
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} /> {saved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" onClick={() => toggleCompare(property.id)}>
            {comparing ? 'Added to Compare' : 'Compare'}
          </Button>
          <Button variant="outline"><Share2 className="w-4 h-4" /> Share</Button>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div>
              <div className="flex gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar">
                {(['overview', 'specs', 'amenities', 'neighborhood'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-brand-700 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="py-6 animate-fadeIn">
                {tab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">About this home</h3>
                      <p className="text-slate-700 leading-relaxed">{property.description}</p>
                      <p className="text-slate-700 leading-relaxed mt-4">
                        This exceptional {property.type.toLowerCase()} offers {property.bedrooms} bedrooms and {property.bathrooms} bathrooms across {property.area.toLocaleString()} square feet of thoughtfully designed living space. Built in {property.yearBuilt}, the home combines classic craftsmanship with modern updates. Features include {property.amenities.slice(0, 4).join(', ')}, and more.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-4">Property Specs</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          { label: 'Property Type', value: property.type },
                          { label: 'Status', value: property.status },
                          { label: 'Year Built', value: property.yearBuilt },
                          { label: 'Living Area', value: `${property.area.toLocaleString()} sqft` },
                          { label: 'Lot Size', value: `${property.lotSize.toLocaleString()} sqft` },
                          { label: 'Bedrooms', value: property.bedrooms },
                          { label: 'Bathrooms', value: property.bathrooms },
                          { label: 'Parking', value: `${property.parking} space(s)` },
                          { label: 'HOA Fees', value: property.hoa > 0 ? `$${property.hoa}/mo` : 'None' },
                          { label: 'Property Taxes', value: `$${property.taxes.toLocaleString()}/yr` },
                          { label: 'ZIP Code', value: property.zip },
                          { label: 'Neighborhood', value: property.neighborhood },
                        ].map((s, i) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{s.label}</p>
                            <p className="font-semibold text-slate-900 mt-1">{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'specs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { icon: <HomeIcon />, title: 'Home', items: [['Type', property.type], ['Status', property.status], ['Year Built', property.yearBuilt], ['Stories', '2'], ['Heating', 'Central'], ['Cooling', 'Central A/C']] },
                      { icon: <Building2 />, title: 'Building', items: [['Living Area', `${property.area.toLocaleString()} sqft`], ['Above Grade', `${Math.round(property.area * 0.8).toLocaleString()} sqft`], ['Below Grade', `${Math.round(property.area * 0.2).toLocaleString()} sqft`], ['Lot Size', `${property.lotSize.toLocaleString()} sqft`], ['Total Rooms', property.bedrooms + property.bathrooms + 3]] },
                      { icon: <Bed />, title: 'Rooms', items: [['Bedrooms', property.bedrooms], ['Bathrooms', property.bathrooms], ['Full Baths', Math.floor(property.bathrooms)], ['Half Baths', property.bathrooms % 1 > 0 ? 1 : 0], ['Kitchen', '1'], ['Living Room', '1']] },
                      { icon: <Car />, title: 'Parking & Utilities', items: [['Parking Spaces', property.parking], ['Garage', property.parking >= 2 ? 'Yes' : 'No'], ['Driveway', 'Yes'], ['Water', 'Public'], ['Sewer', 'Public'], ['Electric', 'Yes']] },
                      { icon: <Trees />, title: 'Outdoor', items: [['Patio', 'Yes'], ['Deck', property.amenities.includes('Balcony') ? 'Yes' : 'No'], ['Yard', 'Yes'], ['Garden', property.amenities.includes('Garden') ? 'Yes' : 'No'], ['Pool', property.amenities.includes('Pool') ? 'Yes' : 'No']] },
                      { icon: <FileText />, title: 'Financial', items: [['HOA', property.hoa > 0 ? `$${property.hoa}/mo` : 'None'], ['Taxes', `$${property.taxes.toLocaleString()}/yr`], ['Listed', `${Math.round((Date.now() - new Date(property.createdAt).getTime()) / 86400000)} days ago`], ['Price/sqft', `$${Math.round(property.price / property.area).toLocaleString()}`]] },
                    ].map((section, i) => (
                      <Card key={i} className="p-5">
                        <div className="flex items-center gap-2 mb-4 text-slate-700">
                          <div className="w-8 h-8 bg-brand-50 text-brand-700 rounded-lg flex items-center justify-center">{section.icon}</div>
                          <h4 className="font-semibold">{section.title}</h4>
                        </div>
                        <div className="space-y-2">
                          {section.items.map(([label, value], j) => (
                            <div key={j} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                              <span className="text-sm text-slate-500">{label}</span>
                              <span className="text-sm font-medium text-slate-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {tab === 'amenities' && (
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">What this place offers</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map(a => (
                        <div key={a} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center"><Check className="w-4 h-4" /></div>
                          <span className="font-medium text-slate-800">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'neighborhood' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">About {property.neighborhood}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {NEIGHBORHOOD_STATS.slice(0, 4).map(s => (
                        <Card key={s.name} className="p-4">
                          <p className="text-xs text-slate-500 font-medium">{s.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div>
                              <p className="text-2xl font-bold text-slate-900">{s.walkScore}</p>
                              <p className="text-xs text-slate-500">Walk Score</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-slate-900">{s.transitScore}</p>
                              <p className="text-xs text-slate-500">Transit</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Walk Score', value: 92, desc: 'Walker\'s Paradise' },
                        { label: 'Transit Score', value: 85, desc: 'Excellent Transit' },
                        { label: 'Bike Score', value: 78, desc: 'Very Bikeable' },
                      ].map((s, i) => (
                        <Card key={i} className="p-5">
                          <p className="text-sm text-slate-500">{s.label}</p>
                          <p className="text-4xl font-bold text-brand-700 mt-1">{s.value}</p>
                          <p className="text-sm text-slate-700 mt-1">{s.desc}</p>
                          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full" style={{ width: `${s.value}%` }} />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Location & Nearby</h3>
              <MapView properties={nearby} height="500px" selectedId={property.id} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'Schools', value: '12 nearby', icon: <Users className="w-4 h-4" /> },
                  { label: 'Restaurants', value: '47 nearby', icon: <TrendingUp className="w-4 h-4" /> },
                  { label: 'Shopping', value: '18 nearby', icon: <Building2 className="w-4 h-4" /> },
                  { label: 'Transit', value: 'Excellent', icon: <MapPin className="w-4 h-4" /> },
                ].map((s, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">{s.icon}<p className="text-xs">{s.label}</p></div>
                    <p className="font-bold text-slate-900">{s.value}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Similar homes nearby</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {similar.map(p => <PropertyCard key={p.id} property={p} />)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Mortgage */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-brand-700" />
                <h3 className="font-bold text-slate-900">Mortgage Calculator</h3>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">${Math.round(totalMonthly).toLocaleString()}</div>
              <p className="text-sm text-slate-500 mb-5">Estimated monthly payment</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label className="text-slate-600">Home Price</label>
                    <span className="font-semibold text-slate-900">${mortgage.price.toLocaleString()}</span>
                  </div>
                  <input type="range" min={Math.round(mortgage.price * 0.5)} max={Math.round(mortgage.price * 1.5)} step={1000} value={mortgage.price} onChange={e => setMortgage(m => ({ ...m, price: Number(e.target.value) }))} className="w-full accent-brand-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label className="text-slate-600">Down Payment</label>
                    <span className="font-semibold text-slate-900">{mortgage.down}%</span>
                  </div>
                  <input type="range" min={0} max={50} step={1} value={mortgage.down} onChange={e => setMortgage(m => ({ ...m, down: Number(e.target.value) }))} className="w-full accent-brand-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label className="text-slate-600">Interest Rate</label>
                    <span className="font-semibold text-slate-900">{mortgage.rate}%</span>
                  </div>
                  <input type="range" min={2} max={12} step={0.1} value={mortgage.rate} onChange={e => setMortgage(m => ({ ...m, rate: Number(e.target.value) }))} className="w-full accent-brand-700" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <label className="text-slate-600">Loan Term</label>
                    <span className="font-semibold text-slate-900">{mortgage.term} years</span>
                  </div>
                  <input type="range" min={10} max={40} step={5} value={mortgage.term} onChange={e => setMortgage(m => ({ ...m, term: Number(e.target.value) }))} className="w-full accent-brand-700" />
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-sm">
                {[
                  ['Principal & Interest', `$${Math.round(monthlyPI).toLocaleString()}`],
                  ['Property Taxes', `$${Math.round(monthlyTax).toLocaleString()}`],
                  ['Home Insurance', `$${Math.round(monthlyInsurance).toLocaleString()}`],
                  ['HOA Fees', `$${monthlyHOA.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between text-slate-600">
                    <span>{l}</span><span className="font-medium text-slate-900">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-brand-50 rounded-xl border border-brand-100">
                <div className="flex items-center gap-2 mb-2 text-brand-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Investment Snapshot</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-slate-500">Cap Rate</p><p className="font-bold text-slate-900">{capRate.toFixed(1)}%</p></div>
                  <div><p className="text-xs text-slate-500">Cash-on-Cash</p><p className="font-bold text-slate-900">{Math.max(0, cashOnCash).toFixed(1)}%</p></div>
                  <div><p className="text-xs text-slate-500">Est. Rent</p><p className="font-bold text-slate-900">${expectedRent.toLocaleString()}/mo</p></div>
                  <div><p className="text-xs text-slate-500">ROI (5yr)</p><p className="font-bold text-slate-900">+{Math.round(capRate * 5 + 15)}%</p></div>
                </div>
              </div>
            </Card>

            {/* Agent card */}
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-brand-50" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900">{agent.name}</h3>
                  <p className="text-sm text-slate-500">{agent.title}</p>
                  <p className="text-xs text-slate-400">{agent.agency}</p>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    <span className="text-xs text-slate-600 font-semibold ml-1">{agent.rating} ({agent.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                <div><p className="text-lg font-bold text-slate-900">{agent.listings}</p><p className="text-xs text-slate-500">Listings</p></div>
                <div><p className="text-lg font-bold text-slate-900">{agent.deals}</p><p className="text-xs text-slate-500">Deals</p></div>
                <div><p className="text-lg font-bold text-slate-900">{agent.years}y</p><p className="text-xs text-slate-500">Experience</p></div>
              </div>

              <div className="space-y-2 mt-4">
                <Button className="w-full" onClick={() => setContactOpen(true)}><MessageSquare className="w-4 h-4" /> Request Info</Button>
                <Button variant="outline" className="w-full" onClick={() => setTourOpen(true)}><Calendar className="w-4 h-4" /> Schedule Tour</Button>
                <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" /> {agent.phone}
                </a>
              </div>
            </Card>

            {/* Market chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900">Market Trends</h3>
                <Badge variant="info">{property.city}</Badge>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MARKET_HISTORY}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Median']} />
                    <Line type="monotone" dataKey="price" stroke="#0f766e" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {/* Modals */}
      <Modal open={galleryOpen} onClose={() => setGalleryOpen(false)} size="xl">
        <div className="relative bg-slate-900 min-h-[70vh] flex items-center justify-center">
          <img src={property.images[imgIdx]} alt="" className="max-w-full max-h-[80vh] object-contain" />
          <button onClick={() => setImgIdx(i => Math.max(0, i - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => setImgIdx(i => Math.min(property.images.length - 1, i + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center">
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="absolute top-4 right-4 text-white text-sm bg-slate-900/50 px-3 py-1.5 rounded-lg backdrop-blur">{imgIdx + 1} / {property.images.length}</div>
        </div>
      </Modal>

      <Modal open={contactOpen} onClose={() => setContactOpen(false)} title={submitted === 'contact' ? 'Message Sent!' : `Contact ${agent.name}`} size="md">
        {submitted === 'contact' ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-900">Thank you!</h3>
            <p className="text-slate-600 mt-2">{agent.name} will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submitContact} className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <img src={agent.avatar} alt="" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-slate-900">{agent.name}</p>
                <p className="text-sm text-slate-500">{agent.agency} · {agent.city}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 font-medium">Name</label><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></div>
              <div><label className="text-xs text-slate-500 font-medium">Email</label><Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" /></div>
            </div>
            <div><label className="text-xs text-slate-500 font-medium">Phone</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(555) 555-5555" /></div>
            <div><label className="text-xs text-slate-500 font-medium">Message</label><Textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={`Hi ${agent.name.split(' ')[0]}, I'm interested in this property...`} /></div>
            <Button className="w-full" type="submit"><Send className="w-4 h-4" /> Send Message</Button>
            <p className="text-xs text-slate-500 text-center">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
          </form>
        )}
      </Modal>

      <Modal open={tourOpen} onClose={() => setTourOpen(false)} title={submitted === 'tour' ? 'Tour Scheduled!' : 'Schedule a Tour'} size="md">
        {submitted === 'tour' ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-900">Tour request sent!</h3>
            <p className="text-slate-600 mt-2">{agent.name} will confirm your tour time shortly.</p>
          </div>
        ) : (
          <form onSubmit={submitTour} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 font-medium">Name</label><Input required value={tourForm.name} onChange={e => setTourForm({ ...tourForm, name: e.target.value })} placeholder="Your name" /></div>
              <div><label className="text-xs text-slate-500 font-medium">Email</label><Input required type="email" value={tourForm.email} onChange={e => setTourForm({ ...tourForm, email: e.target.value })} placeholder="you@email.com" /></div>
            </div>
            <div><label className="text-xs text-slate-500 font-medium">Phone</label><Input value={tourForm.phone} onChange={e => setTourForm({ ...tourForm, phone: e.target.value })} placeholder="(555) 555-5555" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-slate-500 font-medium">Preferred Date</label><Input type="date" required value={tourForm.date} onChange={e => setTourForm({ ...tourForm, date: e.target.value })} /></div>
              <div><label className="text-xs text-slate-500 font-medium">Preferred Time</label><Input type="time" required value={tourForm.time} onChange={e => setTourForm({ ...tourForm, time: e.target.value })} /></div>
            </div>
            <div><label className="text-xs text-slate-500 font-medium">Notes</label><Textarea rows={3} value={tourForm.message} onChange={e => setTourForm({ ...tourForm, message: e.target.value })} placeholder="Any specific questions or requests..." /></div>
            <Button className="w-full" type="submit"><Calendar className="w-4 h-4" /> Request Tour</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
