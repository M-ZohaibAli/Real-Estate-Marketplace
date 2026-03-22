import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './store';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/Home';
import { SearchPage } from './pages/Search';
import { PropertyDetailPage } from './pages/PropertyDetail';
import { ComparePage } from './pages/Compare';
import { SavedPage, CitiesPage, CityPage, MortgagePage, SellPage, AgentDashboardPage, MarketPage, InvestPage, AgentsPage, CategoryPage } from './pages/Misc';
import { PROPERTIES } from './data';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/buy" element={<SearchPage initialMode="buy" />} />
          <Route path="/rent" element={<SearchPage initialMode="rent" />} />
          <Route path="/commercial" element={<CategoryPage title="Commercial Real Estate" subtitle="Office buildings, retail spaces, warehouses, and investment properties for business owners and investors." filter={(p) => p.type === 'Commercial' || p.type === 'Office'} />} />
          <Route path="/new-construction" element={<SearchPage initialMode="new" />} />
          <Route path="/luxury" element={<CategoryPage title="Luxury Homes" subtitle="Extraordinary properties, estate homes, and high-end condos in the nation's most desirable locations." filter={(p) => p.luxury || p.price > 2000000} />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/searches" element={<SavedPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/city/:slug" element={<CityPage />} />
          <Route path="/city/:slug/:neighborhood" element={<CityPage />} />
          <Route path="/mortgage" element={<MortgagePage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/invest" element={<InvestPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          <Route path="/agent/listings/new" element={<AgentDashboardPage />} />
          <Route path="/agent/leads" element={<AgentDashboardPage />} />
          <Route path="/agent/notifications" element={<AgentDashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/neighborhoods" element={<MarketPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function NotFound() {
  return (
    <div className="py-32 text-center">
      <h1 className="text-6xl font-bold text-slate-900">404</h1>
      <p className="text-slate-500 mt-3">Page not found</p>
      <a href="/" className="inline-block mt-6 px-5 py-2.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors">Go home</a>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="py-10 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          ['Total Listings', PROPERTIES.length.toLocaleString(), 'success'],
          ['Pending Approval', '24', 'warning'],
          ['Active Users', '48,284', 'info'],
          ['Revenue (MTD)', '$1.2M', 'info'],
        ].map(([label, value]) => (
          <div key={label as string} className="p-5 bg-white border border-slate-200 rounded-2xl">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="p-6 bg-white border border-slate-200 rounded-2xl">
        <h3 className="font-bold text-slate-900 mb-4">Platform Overview</h3>
        <p className="text-slate-600">Full admin controls — user management, listing approvals, content moderation, and platform analytics.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
