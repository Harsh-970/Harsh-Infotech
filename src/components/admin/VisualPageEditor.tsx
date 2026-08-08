import React, { useState, useEffect, useRef } from 'react';
import { useCMS, PageItem } from '../../context/CMSContext';
import { RealPageRenderer } from './RealPageRenderer';
import { DynamicInspector } from './DynamicInspector';
import { EditingEngine } from '../../engine/EditingEngine';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  CheckCircle, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  RotateCcw
} from 'lucide-react';

interface VisualPageEditorProps {
  page: PageItem;
  onBackToBlueprint: () => void;
  onNavigatePage?: (slug: string) => void;
}

export const VisualPageEditor: React.FC<VisualPageEditorProps> = ({ page, onBackToBlueprint, onNavigatePage }) => {
  const { updatePage, saveDraft, publishAll } = useCMS();
  const [activeViewport, setActiveViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const editorContainerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Clear Engine Selection on page load/change
  useEffect(() => {
    if (page) {
      EditingEngine.clearSelection();
    }
  }, [page?.id]);

  // Listen to Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard Shortcuts for Undo (Ctrl+Z), Redo (Ctrl+Shift+Z), and Fullscreen toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          const record = EditingEngine.redo();
          if (record) showToast(`Redo: ${record.description}`);
        } else {
          const record = EditingEngine.undo();
          if (record) showToast(`Undo: ${record.description}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (editorContainerRef.current?.requestFullscreen) {
          await editorContainerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  if (!page) {
    return (
      <div className="min-h-screen bg-[#070b13] text-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Page Not Found</h2>
        <p className="text-xs text-white/50">The requested visual page item could not be loaded.</p>
        <button
          onClick={onBackToBlueprint}
          className="px-4 py-2 bg-[#D4AF37] text-black font-extrabold text-xs rounded-xl"
        >
          Return to Site Blueprint
        </button>
      </div>
    );
  }

  const handleSaveDraft = () => {
    updatePage(page.id, {
      status: 'draft'
    });
    showToast(`Saved draft for "${page.title}"!`);
  };

  const handlePublish = async () => {
    handleSaveDraft();
    await publishAll();
    showToast(`Published "${page.title}" to live website!`);
  };

  return (
    <div ref={editorContainerRef} className="h-screen w-screen bg-[#070b13] text-white flex flex-col select-none overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Top Header Controls Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0b1329]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBlueprint}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" /> Back to Site Blueprint
          </button>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white">{page.title}</span>
            <span className="text-[10px] text-white/40 font-mono">/{page.slug === 'home' ? '' : `${page.slug}.html`}</span>
          </div>
        </div>

        {/* Save & Publish Actions */}
        <div className="flex items-center gap-3">
          <a
            href={`/${page.slug === 'home' ? 'index.html' : `${page.slug}.html`}?preview=draft`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <Eye className="w-3.5 h-3.5" /> Preview Draft
          </a>

          <button
            onClick={handleSaveDraft}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-white/10"
          >
            <Save className="w-3.5 h-3.5 text-[#D4AF37]" /> Save Draft
          </button>

          <button
            onClick={handlePublish}
            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Publish
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE: REAL PAGE COMPONENT RENDERER + FLOATING TOOLBAR + STICKY DYNAMIC INSPECTOR */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* REAL PAGE COMPONENT CANVAS WORKSPACE */}
        <main className="flex-1 bg-[#05080e] overflow-y-auto p-4 sm:p-8 flex flex-col items-center justify-start relative">
          
          {/* FLOATING GLASSMORPHIC CANVAS TOOLBAR */}
          <div className="sticky top-4 z-40 bg-[#0b1329]/95 backdrop-blur-2xl border border-white/15 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-4 text-xs mb-4">
            {/* Viewport Toggles */}
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => setActiveViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeViewport === 'desktop' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-white/60 hover:text-white'}`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setActiveViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeViewport === 'tablet' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-white/60 hover:text-white'}`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setActiveViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${activeViewport === 'mobile' ? 'bg-[#D4AF37] text-black font-bold shadow' : 'text-white/60 hover:text-white'}`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <div className="h-4 w-px bg-white/15" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))}
                className="p-1.5 bg-white/5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Zoom Out (-10%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 bg-white/5 hover:bg-white/15 rounded-lg text-[11px] font-mono text-white/80 hover:text-white transition-colors"
                title="Reset Zoom (100%)"
              >
                {zoomLevel}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))}
                className="p-1.5 bg-white/5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Zoom In (+10%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-white/15" />

            {/* Fullscreen Canvas Mode */}
            <button
              onClick={toggleFullscreen}
              className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isFullscreen 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border border-white/10'
              }`}
              title="Toggle Canvas Fullscreen Mode (Press ESC to exit)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span className="hidden md:inline font-medium">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
            </button>
          </div>

          {/* PAGE PREVIEW FRAME WRAPPER WITH DYNAMIC VIEWPORT & ZOOM SCALE */}
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
            className={`transition-all duration-300 bg-[#070b13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-4 relative ${
              activeViewport === 'desktop'
                ? 'w-full max-w-6xl'
                : activeViewport === 'tablet'
                ? 'w-[768px]'
                : 'w-[375px]'
            }`}
          >
            {/* Visual Page Banner Indicator */}
            <div className="p-3 bg-[#0b1329] border-b border-white/10 flex items-center justify-between text-xs text-white/50">
              <span className="flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Authentic React Component ({page.title}) - 1 Source of Truth
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 font-bold">
                Editor Mode Active
              </span>
            </div>

            {/* REAL PAGE COMPONENT RENDERER */}
            <RealPageRenderer page={page} onNavigatePage={onNavigatePage} />
          </div>
        </main>

        {/* STICKY DYNAMIC INSPECTOR SIDEBAR */}
        <DynamicInspector />
      </div>
    </div>
  );
};

