import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, Building2, Users, Heart, Search, Plus, ArrowRight, Calculator, Percent, DollarSign, Star, Phone, MessageSquare, Calendar, FileText, BarChart3, Settings, Check, Clock } from 'lucide-react';
import { PROPERTIES, CITIES_DATA, AGENTS, MARKET_HISTORY, DEMO_LEADS, NEIGHBORHOOD_STATS } from '../data';
import { PropertyCard, formatPrice } from '../components/PropertyCard';
import { Container, Card, Button, Badge, Input, Select, Tabs, Stat } from '../components/ui';
import { useApp } from '../store';
import type { Property } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { EmptyState } from '../components/ui';

// =============== SAVED PROPERTIES PAGE ===============
export function SavedPage() {
  const { savedIds } = useApp();
  const properties = PROPERTIES.filter(p => savedIds.includes(p.id));
  const [tab] = useState('saved');

  if (properties.length === 0 && tab === 'saved') {
    return (
      <Container className="py-20">
        <EmptyState
          icon={<Heart className="w-10 h-10" />}
          title="No saved properties yet"
          description="Save properties you love to easily compare and revisit them later."
          action={<Button onClick={() => window.location.href = '/buy'}>Browse homes</Button>}
        />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Saved Properties</h1>
          <p className="text-slate-500 mt-1">{properties.length} home{properties.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
    </Container>
  );
}

// =============== CITIES PAGE ===============
export function CitiesPage() {
  const [query, setQuery] = useState('');
  const cities = CITIES_DATA.filter(c => `${c.name} ${c.state}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="info" className="mb-3">Explore</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Find your next city</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Explore real estate markets across the nation. From bustling metros to charming suburbs.</p>
        <div className="mt-6 max-w-md mx-auto">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cities..." className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cities.map(city => (
          <Link to={`/city/${city.slug}`} key={city.slug} className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm hover:shadow-xl transition-all">
            <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h3 className="text-2xl font-bold">{city.name}</h3>
              <p className="text-sm text-white/80">{city.state} · {city.population.toLocaleString()} residents</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {city.listings.toLocaleString()} listings</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ${(city.medianPrice / 1000).toFixed(0)}K median</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}

// =============== CITY PAGE (Programmatic SEO) ===============
export function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const city = CITIES_DATA.find(c => c.slug === slug) || CITIES_DATA[0];
  const cityListings = PROPERTIES.filter(p => p.city === city.name);
  const forSale = cityListings.filter(p => p.status === 'For Sale');
  const forRent = cityListings.filter(p => p.status === 'For Rent');

  const neighborhoods = Array.from(new Set(cityListings.map(p => p.neighborhood))).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900" />
        </div>
        <Container className="relative py-20 text-white">
          <nav className="text-sm text-white/70 mb-4">
            <Link to="/" className="hover:text-white">Home</Link> / <Link to="/cities" className="hover:text-white">Cities</Link> / <span className="text-white">{city.name}</span>
          </nav>
          <Badge variant="info" className="mb-4 !bg-white/10 !text-white !border-white/30">Real Estate Market</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Homes for Sale in {city.name}, {city.state}</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">{city.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl">
            {[
              { label: 'Active Listings', value: city.listings.toLocaleString() },
              { label: 'Median Price', value: `$${(city.medianPrice / 1000).toFixed(0)}K` },
              { label: 'Population', value: (city.population / 1000000).toFixed(2) + 'M' },
              { label: 'Avg. Days on Market', value: '34' },
            ].map((s, i) => (
              <div key={i} className="p-4 bg-white/10 backdrop-blur rounded-xl border border-white/20">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button onClick={() => navigate('/search')}><Search className="w-4 h-4" /> Search Homes</Button>
            <Button variant="outline" className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20">View {forRent.length} Rentals</Button>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        {/* Market chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">Home Price Trends — {city.name}</h3>
                <p className="text-sm text-slate-500">Median listing price over the last 12 months</p>
              </div>
              <Badge variant="success">+5.2% YoY</Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MARKET_HISTORY}>
                  <defs>
                    <linearGradient id="cityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Median Price']} />
                  <Area type="monotone" dataKey="price" stroke="#0f766e" strokeWidth={2.5} fill="url(#cityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Market Snapshot</h3>
            <div className="space-y-3">
              {[
                ['Median Home Price', `$${city.medianPrice.toLocaleString()}`],
                ['Price per sqft', `$${Math.round(city.medianPrice / 1800).toLocaleString()}`],
                ['For Sale', `${forSale.length} listings`],
                ['For Rent', `${forRent.length} listings`],
                ['Avg. Home Size', '1,850 sqft'],
                ['Avg. Year Built', '1985'],
              ].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{l}</span>
                  <span className="text-sm font-semibold text-slate-900">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Neighborhoods */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Top Neighborhoods in {city.name}</h2>
          <p className="text-slate-500 mb-6">Explore the most desirable areas for home buyers and renters.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {neighborhoods.map(n => {
              const listings = cityListings.filter(p => p.neighborhood === n).length;
              const median = listings > 0 ? Math.round(cityListings.filter(p => p.neighborhood === n).reduce((s, p) => s + p.price, 0) / listings) : city.medianPrice;
              return (
                <Card key={n} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{n}</h3>
                      <p className="text-sm text-slate-500">{listings} listings</p>
                    </div>
                    <Badge variant="info">${(median / 1000).toFixed(0)}K</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
                    <div><p className="font-bold text-slate-900">92</p><p className="text-slate-500">Walk</p></div>
                    <div><p className="font-bold text-slate-900">85</p><p className="text-slate-500">Transit</p></div>
                    <div><p className="font-bold text-slate-900">Low</p><p className="text-slate-500">Crime</p></div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Listings */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Latest Homes in {city.name}</h2>
              <p className="text-slate-500 mt-1">{cityListings.length} active listings</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cityListings.slice(0, 8).map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </Container>
    </div>
  );
}

// =============== MORTGAGE PAGE ===============
export function MortgagePage() {
  const [inputs, setInputs] = useState({ price: 650000, down: 20, rate: 6.8, term: 30, taxes: 650, insurance: 150, hoa: 250 });
  const principal = inputs.price * (1 - inputs.down / 100);
  const monthlyRate = inputs.rate / 100 / 12;
  const n = inputs.term * 12;
  const monthlyPI = monthlyRate === 0 ? principal / n : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalMonthly = monthlyPI + inputs.taxes + inputs.insurance + inputs.hoa;
  const totalInterest = (monthlyPI * n) - principal;
  const totalPaid = monthlyPI * n;

  const pieData = [
    { name: 'Principal', value: Math.round(principal), color: '#0f766e' },
    { name: 'Interest', value: Math.round(totalInterest), color: '#f59e0b' },
    { name: 'Taxes', value: inputs.taxes * n, color: '#3b82f6' },
    { name: 'Insurance', value: inputs.insurance * n, color: '#8b5cf6' },
    { name: 'HOA', value: inputs.hoa * n, color: '#ec4899' },
  ];

  const amort = Array.from({ length: Math.min(inputs.term, 10) }, (_, i) => {
    const year = i + 1;
    const yearStart = principal * Math.pow(1 + monthlyRate, year * 12) - monthlyPI * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate);
    return { year: `Yr ${year}`, balance: Math.round(Math.max(0, yearStart)), paid: Math.round(monthlyPI * year * 12) };
  });

  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="info" className="mb-3"><Calculator className="w-3 h-3" /> Financial Tools</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Mortgage Calculator</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Estimate your monthly mortgage payment including taxes, insurance, and HOA fees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-slate-900 mb-5">Loan Details</h3>
          <div className="space-y-5">
            {[
              { label: 'Home Price', key: 'price', min: 50000, max: 5000000, step: 1000, format: (v: number) => `$${v.toLocaleString()}` },
              { label: 'Down Payment', key: 'down', min: 0, max: 60, step: 1, format: (v: number) => `${v}%` },
              { label: 'Interest Rate', key: 'rate', min: 2, max: 12, step: 0.1, format: (v: number) => `${v}%` },
              { label: 'Loan Term', key: 'term', min: 10, max: 40, step: 5, format: (v: number) => `${v} years` },
              { label: 'Property Taxes/mo', key: 'taxes', min: 0, max: 3000, step: 25, format: (v: number) => `$${v}` },
              { label: 'Home Insurance/mo', key: 'insurance', min: 0, max: 1000, step: 25, format: (v: number) => `$${v}` },
              { label: 'HOA Fees/mo', key: 'hoa', min: 0, max: 1500, step: 25, format: (v: number) => `$${v}` },
            ].map((f: any) => (
              <div key={f.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label className="text-slate-600">{f.label}</label>
                  <span className="font-semibold text-slate-900">{f.format((inputs as any)[f.key])}</span>
                </div>
                <input type="range" min={f.min} max={f.max} step={f.step} value={(inputs as any)[f.key]} onChange={e => setInputs(prev => ({ ...prev, [f.key]: Number(e.target.value) }))} className="w-full accent-brand-700" />
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 bg-gradient-to-br from-brand-700 to-brand-900 text-white border-0">
            <p className="text-sm text-white/80 font-medium">Estimated Monthly Payment</p>
            <p className="text-5xl font-bold mt-2">${Math.round(totalMonthly).toLocaleString()}</p>
            <div className="grid grid-cols-5 gap-2 mt-6 text-center text-xs">
              {[
                ['P&I', `$${Math.round(monthlyPI).toLocaleString()}`],
                ['Taxes', `$${inputs.taxes}`],
                ['Ins.', `$${inputs.insurance}`],
                ['HOA', `$${inputs.hoa}`],
                ['Loan', `$${Math.round(principal).toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l} className="p-2 bg-white/10 rounded-lg">
                  <p className="font-bold">{v}</p>
                  <p className="text-white/70">{l}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Cost Breakdown</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Total']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Loan Summary</h3>
              <div className="space-y-3">
                {[
                  ['Loan Amount', `$${Math.round(principal).toLocaleString()}`],
                  ['Down Payment', `$${Math.round(inputs.price * inputs.down / 100).toLocaleString()}`],
                  ['Total Interest', `$${Math.round(totalInterest).toLocaleString()}`],
                  ['Total of Payments', `$${Math.round(totalPaid).toLocaleString()}`],
                  ['Monthly P&I', `$${Math.round(monthlyPI).toLocaleString()}`],
                  ['Total Monthly', `$${Math.round(totalMonthly).toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-sm text-slate-500">{l}</span>
                    <span className="text-sm font-semibold text-slate-900">{v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Loan Balance Over Time</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={amort}>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Balance']} />
                  <Area type="monotone" dataKey="balance" stroke="#0f766e" strokeWidth={2} fill="#14b8a6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

// =============== SELL PAGE ===============
export function SellPage() {
  const [form, setForm] = useState({ address: '', city: '', state: '', zip: '', type: 'House', bedrooms: 3, bathrooms: 2, area: 1800, email: '', phone: '', condition: 'Good' });
  const [submitted, setSubmitted] = useState(false);

  const estimatedValue = 450000 + form.bedrooms * 50000 + form.bathrooms * 25000 + form.area * 150;

  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="success" className="mb-3">Sellers</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Sell Your Home with Confidence</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Get a free instant valuation and connect with a top local agent. Maximize your return, minimize your stress.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Tell us about your property</h3>
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8" /></div>
              <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>
              <p className="text-slate-600 mt-2">A top agent will reach out within 24 hours with your detailed valuation.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><label className="text-sm font-medium text-slate-700">Street Address</label><Input required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main Street" /></div>
                <div><label className="text-sm font-medium text-slate-700">City</label><Input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-sm font-medium text-slate-700">State</label><Input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="CA" /></div>
                  <div><label className="text-sm font-medium text-slate-700">ZIP</label><Input required value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} /></div>
                </div>
                <div><label className="text-sm font-medium text-slate-700">Property Type</label><Select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>House</option><option>Condo</option><option>Townhouse</option><option>Apartment</option><option>Land</option></Select></div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="text-sm font-medium text-slate-700">Beds</label><Input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: Number(e.target.value) })} /></div>
                  <div><label className="text-sm font-medium text-slate-700">Baths</label><Input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: Number(e.target.value) })} /></div>
                  <div><label className="text-sm font-medium text-slate-700">Sqft</label><Input type="number" value={form.area} onChange={e => setForm({ ...form, area: Number(e.target.value) })} /></div>
                </div>
                <div><label className="text-sm font-medium text-slate-700">Condition</label><Select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Work</option></Select></div>
                <div><label className="text-sm font-medium text-slate-700">Email</label><Input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                <div><label className="text-sm font-medium text-slate-700">Phone</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <Button className="w-full mt-2" size="lg">Get My Free Valuation</Button>
              <p className="text-xs text-slate-500 text-center">No obligation. Your information is kept confidential.</p>
            </form>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-6 bg-gradient-to-br from-brand-700 to-brand-900 text-white border-0">
            <p className="text-sm text-white/80 font-medium">Estimated Value</p>
            <p className="text-4xl font-bold mt-2">${(estimatedValue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-white/70 mt-2">Range: ${((estimatedValue * 0.9) / 1000).toFixed(0)}K - ${((estimatedValue * 1.1) / 1000).toFixed(0)}K</p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-slate-900 mb-3">Why Havenly?</h4>
            <div className="space-y-3">
              {[
                ['Top 1% Agents', 'Vetted, proven performers'],
                ['4.2% Avg. Premium', 'Homes sell for more'],
                ['34 Days to Close', 'Faster than national avg'],
                ['12.4K Agents', 'Nationwide coverage'],
              ].map(([l, v]) => (
                <div key={l} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                  <div><p className="text-sm font-semibold text-slate-900">{l}</p><p className="text-xs text-slate-500">{v}</p></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

// =============== AGENT DASHBOARD ===============
export function AgentDashboardPage() {
  const { leads: userLeads } = useApp();
  const allLeads = [...userLeads, ...DEMO_LEADS];
  const [tab, setTab] = useState('overview');

  const statusCounts = {
    New: allLeads.filter(l => l.status === 'New').length,
    Contacted: allLeads.filter(l => l.status === 'Contacted').length,
    Negotiating: allLeads.filter(l => l.status === 'Negotiating').length,
    Closed: allLeads.filter(l => l.status === 'Closed').length,
  };

  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    leads: 24 + i * 5 + (i % 2) * 3,
    views: 1200 + i * 180,
    saves: 80 + i * 12,
  }));

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <nav className="text-sm text-slate-500 mb-2">Agent / Dashboard</nav>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Agent Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back. Here's what's happening with your listings today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Calendar className="w-4 h-4" /> Calendar</Button>
          <Button><Plus className="w-4 h-4" /> New Listing</Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'listings', label: 'My Listings' },
          { id: 'leads', label: `Leads (${allLeads.length})` },
          { id: 'messages', label: 'Messages' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'calendar', label: 'Calendar' },
        ]} active={tab} onChange={setTab} />
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Stat label="Active Listings" value="24" sub="+2 this week" icon={<Building2 className="w-5 h-5" />} />
            <Stat label="Total Leads" value={allLeads.length.toString()} sub="+18% vs last month" icon={<Users className="w-5 h-5" />} />
            <Stat label="Listing Views" value="12,482" sub="+23% vs last month" icon={<FileText className="w-5 h-5" />} />
            <Stat label="Conversion Rate" value="4.8%" sub="+0.6% vs last month" icon={<Percent className="w-5 h-5" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Performance Overview</h3>
                <Badge variant="info">Last 6 months</Badge>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#0f766e" strokeWidth={2} fill="#14b8a6" fillOpacity={0.2} name="Views" />
                    <Area type="monotone" dataKey="leads" stroke="#f59e0b" strokeWidth={2} fill="#f59e0b" fillOpacity={0.2} name="Leads" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-slate-900 mb-4">Lead Pipeline</h3>
              <div className="space-y-3">
                {(['New', 'Contacted', 'Negotiating', 'Closed'] as const).map(status => {
                  const count = statusCounts[status];
                  const max = Math.max(...Object.values(statusCounts));
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">{status}</span>
                        <span className="font-bold text-slate-900">{count}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all" style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 pt-5 border-t border-slate-100">
                <Link to="/agent/leads" className="flex items-center justify-between text-sm font-semibold text-brand-700 hover:text-brand-800">
                  Manage all leads <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Recent Leads</h3>
                <Link to="/agent/leads" className="text-sm font-semibold text-brand-700 hover:text-brand-800">View all</Link>
              </div>
              <div className="space-y-3">
                {allLeads.slice(0, 5).map(lead => (
                  <div key={lead.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">{lead.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 text-sm">{lead.name}</p>
                        <Badge variant={lead.status === 'New' ? 'info' : lead.status === 'Closed' ? 'success' : 'warning'}>{lead.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{lead.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{lead.source} · {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Top Performing Listings</h3>
              </div>
              <div className="space-y-3">
                {PROPERTIES.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <img src={p.images[0]} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                      <p className="text-xs text-slate-500">{formatPrice(p)} · {p.city}</p>
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-bold text-slate-900">{p.views.toLocaleString()}</p>
                      <p className="text-slate-500">views</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === 'listings' && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">My Listings (24)</h3>
            <Button><Plus className="w-4 h-4" /> Add Listing</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-3 font-medium">Property</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Price</th>
                  <th className="py-3 font-medium">Views</th>
                  <th className="py-3 font-medium">Saves</th>
                  <th className="py-3 font-medium">Leads</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {PROPERTIES.slice(0, 10).map(p => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.city}, {p.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><Badge variant={p.status === 'For Sale' ? 'info' : 'warning'}>{p.status}</Badge></td>
                    <td className="py-3 font-semibold">{formatPrice(p)}</td>
                    <td className="py-3">{p.views.toLocaleString()}</td>
                    <td className="py-3">{p.saves.toLocaleString()}</td>
                    <td className="py-3">{Math.round(p.saves / 10)}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Stats</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'leads' && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">All Leads ({allLeads.length})</h3>
          <div className="space-y-3">
            {allLeads.map(lead => (
              <div key={lead.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">{lead.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{lead.name}</p>
                        <Badge variant={lead.status === 'New' ? 'info' : lead.status === 'Closed' ? 'success' : 'warning'}>{lead.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{lead.email} · {lead.phone}</p>
                      <p className="text-sm text-slate-700 mt-2">{lead.message}</p>
                      <p className="text-xs text-slate-400 mt-2">Source: {lead.source} · {new Date(lead.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm"><MessageSquare className="w-3.5 h-3.5" /> Message</Button>
                    <Button variant="outline" size="sm"><Phone className="w-3.5 h-3.5" /> Call</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Listing Views by Day</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Array.from({ length: 7 }, (_, i) => ({ day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], views: 200 + i * 40 + (i === 5 ? 120 : 0) }))}>
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#0f766e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Lead Sources</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[
                    { name: 'Property Page', value: 48 },
                    { name: 'Organic Search', value: 22 },
                    { name: 'Saved Search', value: 15 },
                    { name: 'Referral', value: 10 },
                    { name: 'Social', value: 5 },
                  ]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {['#0f766e', '#14b8a6', '#5eead4', '#f59e0b', '#8b5cf6'].map((c, i) => <Cell key={i} fill={c} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {tab === 'messages' && (
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            <div className="border-r border-slate-200">
              <div className="p-4 border-b border-slate-200"><h4 className="font-semibold text-slate-900">Conversations</h4></div>
              {['John Anderson', 'Maria Garcia', 'Robert Kim', 'Jennifer Lee', 'David Wilson'].map((name, i) => (
                <div key={i} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${i === 0 ? 'bg-brand-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold text-sm">{name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">Hi, I'm interested in scheduling a tour...</p>
                    </div>
                    {i === 0 && <span className="w-2 h-2 bg-brand-600 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-2 flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-semibold">JA</div>
                  <div><p className="font-semibold text-slate-900 text-sm">John Anderson</p><p className="text-xs text-slate-500">Active now</p></div>
                </div>
                <div className="flex gap-2"><Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button></div>
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50">
                {[
                  { from: 'them', text: 'Hi! I saw the listing on 123 Maple St and I\'m very interested.', time: '10:30 AM' },
                  { from: 'me', text: 'Hi John! Great to hear. Would you like to schedule a tour?', time: '10:32 AM' },
                  { from: 'them', text: 'Yes, that would be perfect. Do you have any availability this weekend?', time: '10:35 AM' },
                  { from: 'me', text: 'Absolutely. I can show you Saturday at 2pm or Sunday at 11am. Which works better?', time: '10:38 AM' },
                  { from: 'them', text: 'Saturday at 2pm works great for me. Looking forward to it!', time: '10:41 AM' },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.from === 'me' ? 'bg-brand-700 text-white rounded-br-md' : 'bg-white text-slate-800 rounded-bl-md border border-slate-200'}`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-white/70' : 'text-slate-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <input placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm" />
                  <Button><MessageSquare className="w-4 h-4" /> Send</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {tab === 'calendar' && (
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Upcoming Appointments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Property Tour — 123 Maple St', time: 'Today, 2:00 PM', client: 'John Anderson', type: 'Tour' },
              { title: 'Virtual Showing — 456 Oak Ave', time: 'Tomorrow, 11:00 AM', client: 'Maria Garcia', type: 'Virtual' },
              { title: 'Listing Consultation', time: 'Thu, 3:30 PM', client: 'Robert Kim', type: 'Meeting' },
              { title: 'Open House — 789 Pine Rd', time: 'Sat, 1:00 PM - 4:00 PM', client: 'Public', type: 'Open House' },
            ].map((appt, i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="info" className="mb-2">{appt.type}</Badge>
                    <p className="font-semibold text-slate-900">{appt.title}</p>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {appt.time}</p>
                    <p className="text-xs text-slate-500 mt-2">With {appt.client}</p>
                  </div>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Container>
  );
}

// =============== MARKET PAGE ===============
export function MarketPage() {
  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="info" className="mb-3"><BarChart3 className="w-3 h-3" /> Research</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Market Analytics</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Comprehensive real estate data and insights to help you make informed decisions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Median Home Price (US)" value="$668K" sub="+5.2% YoY" icon={<DollarSign className="w-5 h-5" />} />
        <Stat label="Active Inventory" value="250,000" sub="+2.1% MoM" icon={<Building2 className="w-5 h-5" />} />
        <Stat label="Avg. Days on Market" value="34" sub="-3 vs last year" icon={<Clock className="w-5 h-5" />} />
        <Stat label="30-Yr Mortgage Rate" value="6.8%" sub="-0.2% vs last month" icon={<Percent className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">National Home Price Index</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MARKET_HISTORY}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Median']} />
                <Line type="monotone" dataKey="price" stroke="#0f766e" strokeWidth={3} dot={{ fill: '#0f766e', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 mb-4">Inventory by Price Range</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { range: '<$300K', count: 28400 },
                { range: '$300-500K', count: 52800 },
                { range: '$500-750K', count: 68200 },
                { range: '$750K-1M', count: 41500 },
                { range: '$1-2M', count: 38200 },
                { range: '$2M+', count: 21400 },
              ]}>
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 mb-8">
        <h3 className="font-bold text-slate-900 mb-4">Top 10 Markets by Median Price</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 font-medium">Rank</th>
                <th className="py-3 font-medium">City</th>
                <th className="py-3 font-medium">Median Price</th>
                <th className="py-3 font-medium">YoY Change</th>
                <th className="py-3 font-medium">Inventory</th>
                <th className="py-3 font-medium">Days on Market</th>
              </tr>
            </thead>
            <tbody>
              {CITIES_DATA.slice(0, 10).map((c, i) => (
                <tr key={c.slug} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 font-semibold text-slate-500">#{i + 1}</td>
                  <td className="py-3"><Link to={`/city/${c.slug}`} className="font-semibold text-brand-700 hover:text-brand-800">{c.name}, {c.state}</Link></td>
                  <td className="py-3 font-semibold">${(c.medianPrice / 1000).toFixed(0)}K</td>
                  <td className="py-3"><span className="text-emerald-600 font-medium">+{(4 + i * 0.4).toFixed(1)}%</span></td>
                  <td className="py-3">{c.listings.toLocaleString()}</td>
                  <td className="py-3">{28 + i * 2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {NEIGHBORHOOD_STATS.slice(0, 6).map(n => (
          <Card key={n.name} className="p-5">
            <h4 className="font-bold text-slate-900">{n.name}</h4>
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div><p className="text-xs text-slate-500">Walk Score</p><p className="font-bold text-slate-900">{n.walkScore}</p></div>
              <div><p className="text-xs text-slate-500">Transit</p><p className="font-bold text-slate-900">{n.transitScore}</p></div>
              <div><p className="text-xs text-slate-500">Median</p><p className="font-bold text-slate-900">${(n.medianPrice / 1000).toFixed(0)}K</p></div>
              <div><p className="text-xs text-slate-500">Growth</p><p className="font-bold text-emerald-600">+{n.priceGrowth}%</p></div>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

// =============== INVEST PAGE ===============
export function InvestPage() {
  const [inputs, setInputs] = useState({ price: 500000, down: 20, rent: 3200, rate: 6.8, term: 30, expenses: 600, vacancy: 5, appreciation: 3 });
  const loan = inputs.price * (1 - inputs.down / 100);
  const monthlyRate = inputs.rate / 100 / 12;
  const n = inputs.term * 12;
  const monthlyPI = monthlyRate === 0 ? loan / n : (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const monthlyExpenses = inputs.expenses + (inputs.rent * inputs.vacancy / 100);
  const monthlyCashFlow = inputs.rent - monthlyPI - monthlyExpenses;
  const annualNOI = (inputs.rent - inputs.expenses) * 12;
  const capRate = (annualNOI / inputs.price) * 100;
  const cashOnCash = ((monthlyCashFlow * 12) / (inputs.price * inputs.down / 100)) * 100;
  const totalReturn = cashOnCash + inputs.appreciation;

  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="success" className="mb-3"><TrendingUp className="w-3 h-3" /> Investors</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Real Estate Investment Calculator</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Analyze ROI, cash flow, cap rate, and total returns for any investment property.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-bold text-slate-900 mb-5">Investment Parameters</h3>
          <div className="space-y-5">
            {[
              { label: 'Purchase Price', key: 'price', min: 50000, max: 5000000, step: 1000, format: (v: number) => `$${v.toLocaleString()}` },
              { label: 'Down Payment', key: 'down', min: 0, max: 60, step: 1, format: (v: number) => `${v}%` },
              { label: 'Monthly Rent', key: 'rent', min: 500, max: 20000, step: 50, format: (v: number) => `$${v.toLocaleString()}` },
              { label: 'Interest Rate', key: 'rate', min: 2, max: 12, step: 0.1, format: (v: number) => `${v}%` },
              { label: 'Monthly Expenses', key: 'expenses', min: 0, max: 5000, step: 25, format: (v: number) => `$${v}` },
              { label: 'Vacancy Rate', key: 'vacancy', min: 0, max: 20, step: 1, format: (v: number) => `${v}%` },
              { label: 'Appreciation/yr', key: 'appreciation', min: 0, max: 10, step: 0.5, format: (v: number) => `${v}%` },
            ].map((f: any) => (
              <div key={f.key}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <label className="text-slate-600">{f.label}</label>
                  <span className="font-semibold text-slate-900">{f.format((inputs as any)[f.key])}</span>
                </div>
                <input type="range" min={f.min} max={f.max} step={f.step} value={(inputs as any)[f.key]} onChange={e => setInputs(prev => ({ ...prev, [f.key]: Number(e.target.value) }))} className="w-full accent-brand-700" />
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={`p-6 ${monthlyCashFlow >= 0 ? 'bg-gradient-to-br from-emerald-50 to-white' : 'bg-gradient-to-br from-red-50 to-white'}`}>
              <p className="text-sm text-slate-600 font-medium">Monthly Cash Flow</p>
              <p className={`text-4xl font-bold mt-2 ${monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>${Math.round(monthlyCashFlow).toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-2">Annual: ${Math.round(monthlyCashFlow * 12).toLocaleString()}</p>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-brand-50 to-white">
              <p className="text-sm text-slate-600 font-medium">Cap Rate</p>
              <p className="text-4xl font-bold mt-2 text-brand-700">{capRate.toFixed(2)}%</p>
              <p className="text-xs text-slate-500 mt-2">NOI: ${annualNOI.toLocaleString()}/yr</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Cash-on-Cash Return</p>
              <p className="text-4xl font-bold mt-2 text-slate-900">{Math.max(0, cashOnCash).toFixed(2)}%</p>
              <p className="text-xs text-slate-500 mt-2">Based on ${Math.round(inputs.price * inputs.down / 100).toLocaleString()} invested</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-slate-600 font-medium">Total Est. Return/yr</p>
              <p className="text-4xl font-bold mt-2 text-amber-600">{Math.max(0, totalReturn).toFixed(2)}%</p>
              <p className="text-xs text-slate-500 mt-2">Cash flow + appreciation</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-bold text-slate-900 mb-4">Monthly Breakdown</h3>
            <div className="space-y-3">
              {[
                ['Gross Rent', inputs.rent, 'income'],
                ['Mortgage (P&I)', -Math.round(monthlyPI), 'expense'],
                ['Expenses', -inputs.expenses, 'expense'],
                ['Vacancy Reserve', -Math.round(inputs.rent * inputs.vacancy / 100), 'expense'],
              ].map(([label, value, type]: any) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className={`text-sm font-semibold ${type === 'income' ? 'text-emerald-700' : 'text-slate-700'}`}>${Math.round(value).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 bg-slate-50 -mx-6 px-6 mt-2">
                <span className="font-bold text-slate-900">Net Monthly</span>
                <span className={`text-lg font-bold ${monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>${Math.round(monthlyCashFlow).toLocaleString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Container>
  );
}

// =============== AGENTS PAGE ===============
export function AgentsPage() {
  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <Badge variant="info" className="mb-3"><Users className="w-3 h-3" /> Professionals</Badge>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Top-Rated Real Estate Agents</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">Connect with verified, top-performing agents in your area.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {AGENTS.map(agent => (
          <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow text-center">
            <img src={agent.avatar} alt={agent.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-brand-50 ring-offset-2" />
            <h3 className="font-bold text-slate-900 mt-4">{agent.name}</h3>
            <p className="text-sm text-slate-500">{agent.title}</p>
            <p className="text-xs text-slate-400 mt-1">{agent.agency}</p>
            <div className="flex items-center justify-center gap-1 mt-3 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-sm text-slate-700 font-semibold ml-1">{agent.rating}</span>
              <span className="text-xs text-slate-400">({agent.reviews})</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
              <div><p className="text-sm font-bold text-slate-900">{agent.listings}</p><p className="text-xs text-slate-500">Listings</p></div>
              <div><p className="text-sm font-bold text-slate-900">{agent.deals}</p><p className="text-xs text-slate-500">Deals</p></div>
              <div><p className="text-sm font-bold text-slate-900">{agent.years}y</p><p className="text-xs text-slate-500">Exp</p></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" size="sm"><MessageSquare className="w-3.5 h-3.5" /> Message</Button>
              <Button variant="outline" className="flex-1" size="sm"><Phone className="w-3.5 h-3.5" /> Call</Button>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

// =============== LUXURY / COMMERCIAL / NEW CONSTRUCTION PAGES (shared template) ===============
export function CategoryPage({ title, subtitle, filter }: { title: string; subtitle: string; filter: (p: Property) => boolean }) {
  const properties = PROPERTIES.filter(filter);
  return (
    <Container className="py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 mt-2 max-w-xl mx-auto">{subtitle}</p>
        <p className="text-brand-700 font-semibold mt-3">{properties.length.toLocaleString()} listings available</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.slice(0, 24).map(p => <PropertyCard key={p.id} property={p} />)}
      </div>
    </Container>
  );
}
