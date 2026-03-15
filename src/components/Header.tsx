import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Bell, Menu, X, Building2, BarChart3, MessageSquare, Settings, LogOut, Plus, ChevronDown } from 'lucide-react';
import { useApp } from '../store';
import { cn } from '../utils/cn';
import { Button } from './ui';

export function Header() {
  const { user, setUser, savedIds, comparisonIds, notifications } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authModal, setAuthModal] = useState<null | 'login' | 'signup'>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenu(false); setNotifOpen(false); }, [location.pathname]);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Havenly</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/buy" className={navItem(location.pathname, '/buy')}>Buy</Link>
              <Link to="/rent" className={navItem(location.pathname, '/rent')}>Rent</Link>
              <Link to="/sell" className={navItem(location.pathname, '/sell')}>Sell</Link>
              <Link to="/new-construction" className={navItem(location.pathname, '/new-construction')}>New Construction</Link>
              <Link to="/cities" className={navItem(location.pathname, '/cities')}>Cities</Link>
              <Link to="/agent/dashboard" className={navItem(location.pathname, '/agent')}>
                <span className="flex items-center gap-1">Agent <ChevronDown className="w-3.5 h-3.5" /></span>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/search" className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Search className="w-4 h-4" /> Search
              </Link>
              <Link to="/saved" className="relative flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
                {savedIds.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{savedIds.length}</span>}
              </Link>
              {comparisonIds.length > 0 && (
                <Link to="/compare" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                  Compare ({comparisonIds.length})
                </Link>
              )}

              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(o => !o); setUserMenu(false); }}
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />}
                </button>
                {notifOpen && <NotificationsPanel onClose={() => setNotifOpen(false)} />}
              </div>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setUserMenu(o => !o); setNotifOpen(false); }}
                    className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium text-slate-700 hidden lg:inline">{user.name.split(' ')[0]}</span>
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0)}
                    </div>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-fadeIn z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium bg-brand-50 text-brand-700 rounded-full">{user.role}</span>
                      </div>
                      <Link to="/saved" className="menu-item"><Heart className="w-4 h-4" /> Saved Properties</Link>
                      <Link to="/searches" className="menu-item"><Search className="w-4 h-4" /> Saved Searches</Link>
                      {user.role === 'Agent' && <Link to="/agent/dashboard" className="menu-item"><BarChart3 className="w-4 h-4" /> Agent Dashboard</Link>}
                      {user.role === 'Agent' && <Link to="/agent/listings/new" className="menu-item"><Plus className="w-4 h-4" /> New Listing</Link>}
                      {user.role === 'Agent' && <Link to="/agent/leads" className="menu-item"><MessageSquare className="w-4 h-4" /> Leads & Messages</Link>}
                      <Link to="/admin" className="menu-item"><Settings className="w-4 h-4" /> Settings</Link>
                      <div className="border-t border-slate-100 my-1" />
                      <button onClick={() => { setUser(null); setUserMenu(false); }} className="menu-item text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={() => setAuthModal('login')} className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">Sign in</button>
                  <Button size="sm" onClick={() => setAuthModal('signup')}>Get Started</Button>
                </div>
              )}

              <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-fadeIn">
            <div className="px-4 py-3 space-y-1">
              <Link to="/buy" className="mobile-nav">Buy</Link>
              <Link to="/rent" className="mobile-nav">Rent</Link>
              <Link to="/sell" className="mobile-nav">Sell</Link>
              <Link to="/new-construction" className="mobile-nav">New Construction</Link>
              <Link to="/cities" className="mobile-nav">Cities</Link>
              <Link to="/search" className="mobile-nav">Advanced Search</Link>
              <Link to="/agent/dashboard" className="mobile-nav">Agent Dashboard</Link>
            </div>
          </div>
        )}
      </header>

      <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSwitch={(m) => setAuthModal(m)} />

      <style>{`
        .menu-item { display: flex; align-items: center; gap: 0.625rem; width: 100%; padding: 0.625rem 1rem; font-size: 0.875rem; color: #334155; text-align: left; }
        .menu-item:hover { background: #f1f5f9; }
        .mobile-nav { display: block; padding: 0.75rem 1rem; font-size: 0.95rem; color: #334155; border-radius: 0.5rem; }
        .mobile-nav:hover { background: #f1f5f9; }
      `}</style>
    </>
  );
}

function navItem(path: string, prefix: string) {
  const active = path === prefix || path.startsWith(prefix + '/');
  return `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${active ? 'text-brand-700 bg-brand-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`;
}

function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useApp();
  return (
    <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn z-50" onClick={e => e.stopPropagation()}>
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <h4 className="font-semibold text-slate-900">Notifications</h4>
        <button onClick={onClose} className="text-xs text-brand-700 hover:text-brand-800 font-medium">Mark all read</button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map(n => (
          <button
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? 'bg-brand-50/30' : ''}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-brand-600' : 'bg-transparent'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{n.title}</p>
                <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">{n.time}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
        <Link to="/agent/notifications" className="block text-center text-sm font-medium text-brand-700 hover:text-brand-800">View all notifications</Link>
      </div>
    </div>
  );
}

function AuthModal({ mode, onClose, onSwitch }: { mode: 'login' | 'signup' | null; onClose: () => void; onSwitch: (m: 'login' | 'signup') => void }) {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Buyer' as 'Buyer' | 'Seller' | 'Agent' });

  if (!mode) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email || 'demo@havenly.com';
    const name = form.name || email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    setUser({ id: 'u1', name, email, role: form.role });
    onClose();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 text-center">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="text-slate-500 text-center mt-1.5 text-sm">{mode === 'login' ? 'Sign in to save properties and contact agents' : 'Join thousands finding their dream home'}</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700">
              <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="form-input" placeholder="Jane Doe" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="form-input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="••••••••" />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as 'Buyer' | 'Seller' | 'Agent' })} className="form-input">
                  <option>Buyer</option>
                  <option>Seller</option>
                  <option>Agent</option>
                </select>
              </div>
            )}
            <Button className="w-full" size="lg">{mode === 'login' ? 'Sign in' : 'Create account'}</Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-5">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button onClick={() => onSwitch(mode === 'login' ? 'signup' : 'login')} className="font-medium text-brand-700 hover:text-brand-800">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          {mode === 'login' && (
            <p className="text-center text-xs text-slate-500 mt-3">
              <button className="hover:text-brand-700">Forgot password?</button>
            </p>
          )}
        </div>
      </div>
      <style>{`
        .form-input { width: 100%; padding: 0.625rem 0.875rem; font-size: 0.875rem; background: white; border: 1px solid #e2e8f0; border-radius: 0.5rem; outline: none; transition: all 0.15s; }
        .form-input:focus { border-color: #0f766e; box-shadow: 0 0 0 3px rgba(14, 148, 136, 0.15); }
      `}</style>
    </div>
  );
}
