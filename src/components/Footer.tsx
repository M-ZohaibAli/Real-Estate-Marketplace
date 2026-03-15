import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { CITIES_DATA } from '../data';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Havenly</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              The modern real estate marketplace. Discover thousands of properties, connect with top agents, and make smarter real estate decisions with data-driven insights.
            </p>
            <div className="flex gap-3 mt-6">
              {['f', '𝕏', '◉', 'in', '▶'].map((label, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-800 hover:bg-brand-700 rounded-lg flex items-center justify-center transition-colors text-white text-sm font-bold">
                  {label}
                </a>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400" /> 101 Market Street, San Francisco, CA 94105</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /> (800) 555-HAVEN</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /> hello@havenly.com</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Buy & Sell</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/buy" className="hover:text-white transition-colors">Homes for Sale</Link></li>
              <li><Link to="/rent" className="hover:text-white transition-colors">Homes for Rent</Link></li>
              <li><Link to="/sell" className="hover:text-white transition-colors">Sell Your Home</Link></li>
              <li><Link to="/new-construction" className="hover:text-white transition-colors">New Construction</Link></li>
              <li><Link to="/commercial" className="hover:text-white transition-colors">Commercial</Link></li>
              <li><Link to="/luxury" className="hover:text-white transition-colors">Luxury Homes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/cities" className="hover:text-white transition-colors">Explore Cities</Link></li>
              <li><Link to="/mortgage" className="hover:text-white transition-colors">Mortgage Calculator</Link></li>
              <li><Link to="/invest" className="hover:text-white transition-colors">Investment Tools</Link></li>
              <li><Link to="/market" className="hover:text-white transition-colors">Market Reports</Link></li>
              <li><Link to="/neighborhoods" className="hover:text-white transition-colors">Neighborhoods</Link></li>
              <li><Link to="/agents" className="hover:text-white transition-colors">Find an Agent</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Top Cities</h4>
            <ul className="space-y-2.5 text-sm">
              {CITIES_DATA.slice(0, 8).map(c => (
                <li key={c.slug}><Link to={`/city/${c.slug}`} className="hover:text-white transition-colors">{c.name}, {c.state}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {year} Havenly, Inc. All rights reserved. Real estate marketplace.</p>
          <div className="flex flex-wrap gap-5 justify-center">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
          Havenly is committed to ensuring digital accessibility for individuals with disabilities. We are continuously working to improve the accessibility of our web experience for everyone.
          <br />
          Listings data refreshed every 15 minutes. Information deemed reliable but not guaranteed. Equal Housing Opportunity.
        </div>
      </div>
    </footer>
  );
}
