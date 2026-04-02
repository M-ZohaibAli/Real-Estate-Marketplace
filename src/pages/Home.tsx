import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Shield, Award, Sparkles, Star, MapPin, Users, Building2, Percent, Calendar } from 'lucide-react';
import { PROPERTIES, CITIES_DATA, AGENTS, MARKET_HISTORY } from '../data';
import { PropertyCard } from '../components/PropertyCard';
import { HeroSearch } from '../components/Filters';
import { Container, Section, Card, Button, Badge } from '../components/ui';
import { useApp } from '../store';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function HomePage() {
  const navigate = useNavigate();
  const { getRecommendations } = useApp();
  const featured = PROPERTIES.filter(p => p.featured).slice(0, 8);
  const luxury = PROPERTIES.filter(p => p.luxury).slice(0, 4);
  const newConstruction = PROPERTIES.filter(p => p.status === 'New Construction').slice(0, 4);
  const recommended = getRecommendations(PROPERTIES).slice(0, 4);
  const topCities = CITIES_DATA.slice(0, 6);
  const topAgents = AGENTS.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900" />
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/90" />

        <Container className="relative pt-20 pb-32">
          <div className="text-center mb-10 animate-fadeIn">
            <Badge variant="info" className="mb-5 !bg-white/10 !text-white !border-white/20 backdrop-blur">
              <Sparkles className="w-3 h-3" /> 250,000+ active listings nationwide
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Find Your <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">Dream Home</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Discover thousands of properties across {CITIES_DATA.length} cities. Connect with top-rated agents and make data-driven real estate decisions.
            </p>
          </div>

          <HeroSearch onSearch={() => navigate('/search')} />

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            {[
              { label: 'Active Listings', value: '250K+' },
              { label: 'Cities Covered', value: CITIES_DATA.length.toString() },
              { label: 'Top Agents', value: '12.4K' },
              { label: 'Monthly Visitors', value: '3.2M' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-50" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 40%)' }} />
      </section>

      {/* Featured Properties */}
      <Section className="pt-10">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="info" className="mb-3">Featured Homes</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Hand-picked for you</h2>
              <p className="text-slate-500 mt-2 max-w-xl">Explore our editorially curated selection of standout properties across the country.</p>
            </div>
            <Link to="/buy" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Container>
      </Section>

      {/* Value props */}
      <Section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <MapPin className="w-6 h-6" />, title: 'Interactive Maps', desc: 'Browse properties on beautiful, interactive maps with real-time filtering, clusters, and heatmaps.' },
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Market Analytics', desc: 'Make informed decisions with neighborhood insights, price trends, ROI calculators, and investment tools.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Verified Agents', desc: 'Connect with thoroughly vetted, top-rated agents with proven track records in your area.' },
            ].map((f, i) => (
              <Card key={i} className="p-7 hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Luxury Properties */}
      <Section className="bg-gradient-to-b from-amber-50/50 to-white">
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="luxury" className="mb-3">★ Luxury Collection</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Extraordinary homes</h2>
              <p className="text-slate-500 mt-2 max-w-xl">The most distinguished properties from our luxury portfolio.</p>
            </div>
            <Link to="/luxury" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 hover:text-amber-800">
              Explore luxury <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {luxury.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Container>
      </Section>

      {/* Top Cities */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="info" className="mb-3">Top Markets</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Explore by city</h2>
              <p className="text-slate-500 mt-2 max-w-xl">From coast to coast, discover the real estate markets that matter.</p>
            </div>
            <Link to="/cities" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
              All cities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {topCities.map(city => (
              <Link to={`/city/${city.slug}`} key={city.slug} className="group relative rounded-2xl overflow-hidden aspect-[16/10] shadow-sm hover:shadow-xl transition-all">
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold">{city.name}</h3>
                  <p className="text-sm text-white/80">{city.state}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {city.listings.toLocaleString()} listings</span>
                    <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> ${(city.medianPrice / 1000).toFixed(0)}K median</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Market Trends with Chart */}
      <Section className="bg-slate-900 text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="info" className="mb-4 !bg-brand-500/20 !text-brand-300 !border-brand-500/30">Market Insights</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">National Market Report</h2>
              <p className="text-slate-300 mt-4 leading-relaxed">
                Stay ahead with comprehensive market analytics. Track median prices, inventory levels, demand indices, and neighborhood-level trends powered by millions of data points.
              </p>

              <div className="grid grid-cols-2 gap-5 mt-8">
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-slate-400">Median Home Price</p>
                  <p className="text-2xl font-bold mt-1">$668K</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +5.2% YoY</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-slate-400">Active Inventory</p>
                  <p className="text-2xl font-bold mt-1">250K</p>
                  <p className="text-xs text-amber-400 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +2.1% MoM</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-slate-400">Days on Market</p>
                  <p className="text-2xl font-bold mt-1">34 days</p>
                  <p className="text-xs text-red-400 mt-1">-3 vs last year</p>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-sm text-slate-400">Avg. Mortgage Rate</p>
                  <p className="text-2xl font-bold mt-1">6.8%</p>
                  <p className="text-xs text-slate-400 mt-1">30-yr fixed</p>
                </div>
              </div>

              <Link to="/market" className="inline-flex items-center gap-2 mt-8 px-5 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Explore full report <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">Median Home Price</h4>
                  <p className="text-sm text-slate-400">Last 12 months</p>
                </div>
                <Badge variant="info" className="!bg-emerald-500/20 !text-emerald-300 !border-emerald-500/30">+5.2%</Badge>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MARKET_HISTORY}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '13px' }} labelStyle={{ color: '#f1f5f9', fontWeight: 600 }} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Median Price']} />
                    <Area type="monotone" dataKey="price" stroke="#14b8a6" strokeWidth={2.5} fill="url(#priceGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* New Construction */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge variant="success" className="mb-3">New Construction</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Brand-new homes</h2>
              <p className="text-slate-500 mt-2 max-w-xl">Move-in ready properties with modern finishes and builder warranties.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newConstruction.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        </Container>
      </Section>

      {/* Recommended */}
      {recommended.length > 0 && (
        <Section className="bg-white">
          <Container>
            <div className="flex items-end justify-between mb-8">
              <div>
                <Badge variant="info" className="mb-3">Recommended for You</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Personalized picks</h2>
                <p className="text-slate-500 mt-2 max-w-xl">Based on your browsing activity, saved properties, and preferences.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommended.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </Container>
        </Section>
      )}

      {/* Top Agents */}
      <Section>
        <Container>
          <div className="text-center mb-10">
            <Badge variant="info" className="mb-3">Top-Rated Agents</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Work with the best</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">Vetted professionals with proven track records.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topAgents.map(agent => (
              <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow text-center">
                <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-brand-50 ring-offset-2" />
                <h3 className="font-bold text-slate-900 mt-4">{agent.name}</h3>
                <p className="text-sm text-slate-500">{agent.title}</p>
                <p className="text-xs text-slate-400 mt-1">{agent.agency} · {agent.city}</p>
                <div className="flex items-center justify-center gap-1 mt-3 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className="text-sm text-slate-700 font-semibold ml-1">{agent.rating}</span>
                  <span className="text-xs text-slate-400">({agent.reviews})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                  <div><p className="text-sm font-bold text-slate-900">{agent.listings}</p><p className="text-xs text-slate-500">Listings</p></div>
                  <div><p className="text-sm font-bold text-slate-900">{agent.deals}</p><p className="text-xs text-slate-500">Deals</p></div>
                  <div><p className="text-sm font-bold text-slate-900">{agent.years}y</p><p className="text-xs text-slate-500">Exp</p></div>
                </div>
                <Button variant="outline" className="w-full mt-4">Contact</Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Sell CTA */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 p-10 md:p-16">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <Badge variant="info" className="mb-4 !bg-white/10 !text-white !border-white/20">Sellers</Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">Thinking of selling?</h2>
                <p className="text-white/80 mt-5 text-lg leading-relaxed">
                  Get a free, instant home valuation based on millions of comparable sales. Connect with a top local agent who knows your market inside out.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/sell" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                    Get My Home Value <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/agents" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors backdrop-blur">
                    Find an Agent
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <TrendingUp />, label: 'Avg. Sale Premium', value: '+4.2%' },
                  { icon: <Award />, label: 'Top Agents', value: '12.4K' },
                  { icon: <Calendar />, label: 'Avg. Days to Close', value: '34' },
                  { icon: <Users />, label: 'Buyers/Mo', value: '3.2M' },
                ].map((s, i) => (
                  <div key={i} className="p-5 bg-white/10 border border-white/10 rounded-2xl backdrop-blur">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white mb-3">{s.icon}</div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-sm text-white/70 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
