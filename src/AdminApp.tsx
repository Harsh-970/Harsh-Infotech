import React, { useState, useEffect } from 'react';
import { CMSProvider, useCMS, PageItem } from './context/CMSContext';
import { AuthProvider } from './Auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { WebsiteCanvasMap } from './components/admin/WebsiteCanvasMap';
import { VisualPageEditor } from './components/admin/VisualPageEditor';
import { WebsiteFlowEditor } from './components/admin/WebsiteFlowEditor';
import { MediaManager } from './components/admin/MediaManager';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSettings } from './components/admin/AdminSettings';
import { EditorErrorBoundary } from './components/admin/EditorErrorBoundary';
import { 
  Sparkles, 
  Edit3, 
  GitMerge, 
  Image as ImageIcon, 
  Layout, 
  Settings as SettingsIcon, 
  LogOut, 
  ShieldCheck, 
  Eye, 
  CheckCircle, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Logo } from './Shared';

type AdminTab = 'blueprint' | 'editor' | 'flow' | 'media' | 'dashboard' | 'settings';

const AdminContent: React.FC = () => {
  const { drafts, isDraftModified, publishAll } = useCMS();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('hi_admin_session') === 'active';
  });

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active workspace tab - DEFAULT IS 'blueprint' (Site Blueprint Infinite Canvas!)
  const [activeTab, setActiveTab] = useState<AdminTab>('blueprint');

  // Currently editing page for Visual Page Editor
  const [activeVisualPage, setActiveVisualPage] = useState<PageItem | null>(null);

  // Sync routing state from URL query parameters & browser history (popstate)
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view') as AdminTab | null;
      const pageParam = params.get('page');

      if (viewParam === 'editor' && pageParam) {
        const foundPage = drafts.pages.find(p => p.slug === pageParam || p.id === pageParam);
        if (foundPage) {
          setActiveVisualPage(foundPage);
          setActiveTab('editor');
          return;
        }
      }

      if (viewParam && ['blueprint', 'flow', 'media', 'dashboard', 'settings'].includes(viewParam)) {
        setActiveTab(viewParam);
        setActiveVisualPage(null);
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [drafts.pages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = drafts.settings.adminPasscode || 'admin123';
    if (passcode.trim() === correctPasscode) {
      sessionStorage.setItem('hi_admin_session', 'active');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('hi_admin_session');
    setIsAuthenticated(false);
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (tab !== 'editor') {
      setActiveVisualPage(null);
      const searchPath = tab === 'blueprint' ? window.location.pathname : `${window.location.pathname}?view=${tab}`;
      window.history.pushState({ view: tab }, '', searchPath);
    }
  };

  const handleOpenVisualEditor = (page: PageItem) => {
    if (!page) return;
    setActiveVisualPage(page);
    setActiveTab('editor');
    const newUrl = `${window.location.pathname}?view=editor&page=${encodeURIComponent(page.slug)}`;
    window.history.pushState({ view: 'editor', page: page.slug }, '', newUrl);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b13] flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-black select-none">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0,transparent_70%)]" />

        <div className="w-full max-w-md bg-[#0b1329]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <Logo withText={false} imgClassName="h-12 w-auto" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Website Operating System</h1>
            <p className="text-xs text-white/50">Harsh Infotech Consultancy Services</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" /> Enter Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode (Default: admin123)"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all"
                autoFocus
                required
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-semibold">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-sm rounded-2xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 group"
            >
              Open Site Blueprint Canvas <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <a href="/" className="text-xs text-white/40 hover:text-white transition-colors">
              ← Back to Live Public Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Visual Page Editor Fullscreen Mode
  if (activeTab === 'editor' && activeVisualPage) {
    return (
      <EditorErrorBoundary fallbackTitle="Visual Page Editor Error" onReset={() => handleTabChange('blueprint')}>
        <VisualPageEditor
          page={activeVisualPage}
          onBackToBlueprint={() => handleTabChange('blueprint')}
          onNavigatePage={(slug) => {
            const foundPage = drafts.pages.find(p => p.slug === slug);
            if (foundPage) {
              handleOpenVisualEditor(foundPage);
            }
          }}
        />
      </EditorErrorBoundary>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-white flex flex-col select-none">
      {/* Header Navigation Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0b1329]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Logo withText={true} textClassName="text-sm font-bold tracking-tight text-white hidden sm:block" imgClassName="h-8 w-auto" />
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] font-extrabold uppercase tracking-wider">
            Website OS
          </span>
        </div>

        {/* Tab Mode Switcher: Site Blueprint is Default */}
        <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-2xl">
          <button
            onClick={() => handleTabChange('blueprint')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'blueprint' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Site Blueprint
          </button>

          <button
            onClick={() => handleTabChange('flow')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'flow' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" /> Action Flow
          </button>

          <button
            onClick={() => handleTabChange('media')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'media' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Media
          </button>

          <button
            onClick={() => handleTabChange('dashboard')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> System Info
          </button>

          <button
            onClick={() => handleTabChange('settings')}
            className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'settings' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" /> Settings
          </button>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-3">
          {isDraftModified ? (
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Safe Draft Pending
            </span>
          ) : (
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Live Synced
            </span>
          )}

          <a
            href="/index.html?preview=draft"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> Preview Draft
          </a>

          <button
            onClick={publishAll}
            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Publish
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 p-4 sm:p-6 overflow-hidden">
        {activeTab === 'blueprint' && (
          <WebsiteCanvasMap
            onOpenVisualEditor={handleOpenVisualEditor}
            setActiveTab={handleTabChange}
          />
        )}
        {activeTab === 'flow' && <WebsiteFlowEditor />}
        {activeTab === 'media' && <MediaManager />}
        {activeTab === 'dashboard' && <AdminDashboard setActiveTab={handleTabChange} />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};

export default function AdminApp() {
  return (
    <GoogleOAuthProvider clientId={(import.meta.env.VITE_GOOGLE_CLIENT_ID as string) || "dummy_client_id"}>
      <AuthProvider>
        <CMSProvider>
          <AdminContent />
        </CMSProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

