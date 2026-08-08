import React, { useState, useRef } from 'react';
import { useCMS, PageItem } from '../../context/CMSContext';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  StickyNote, 
  PenTool, 
  MousePointer, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  CheckCircle, 
  Globe, 
  Sparkles,
  Layers,
  ArrowRight,
  Move,
  MessageSquare,
  Phone
} from 'lucide-react';

interface WebsiteCanvasMapProps {
  onOpenVisualEditor: (page: PageItem) => void;
  setActiveTab: (tab: string) => void;
}

interface CanvasNote {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface CardPosition {
  [id: string]: { x: number; y: number };
}

export const WebsiteCanvasMap: React.FC<WebsiteCanvasMapProps> = ({ onOpenVisualEditor, setActiveTab }) => {
  const { drafts, isDraftModified, publishAll, duplicatePage, deletePage } = useCMS();

  // Canvas Pan & Zoom State
  const [scale, setScale] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 80, y: 60 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'note' | 'draw'>('select');

  // Page Card Positions (Visual canvas layout)
  const [cardPositions, setCardPositions] = useState<CardPosition>(() => {
    const initial: CardPosition = {
      'home': { x: 100, y: 150 },
      'about': { x: 480, y: 80 },
      'services': { x: 480, y: 380 },
      'products': { x: 480, y: 680 },
      'customizations': { x: 860, y: 220 },
      'offers': { x: 860, y: 520 },
      'jobs': { x: 480, y: 980 }
    };
    // Position extra pages dynamically
    drafts.pages.forEach((p, idx) => {
      if (!initial[p.id]) {
        initial[p.id] = { x: 1240, y: 100 + idx * 280 };
      }
    });
    return initial;
  });

  // Dragging Page Cards
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Canvas Sticky Notes
  const [notes, setNotes] = useState<CanvasNote[]>([
    { id: 'note-1', x: 120, y: 520, text: '💡 Hero Section CTA connects directly to Tally on Cloud & Services', color: '#f59e0b' },
    { id: 'note-2', x: 880, y: 80, text: '🚀 Auto-sync active: WhatsApp conversion action connected to wa.me/917558604483', color: '#10b981' }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle Mouse Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'pan' || e.button === 1 || (e.target as HTMLElement).classList.contains('canvas-bg')) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    } else if (draggingCardId) {
      setCardPositions(prev => ({
        ...prev,
        [draggingCardId]: {
          x: (e.clientX - pan.x) / scale - dragOffset.x,
          y: (e.clientY - pan.y) / scale - dragOffset.y
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingCardId(null);
  };

  const handleCardDragStart = (e: React.MouseEvent, pageId: string) => {
    e.stopPropagation();
    if (activeTool !== 'select') return;
    const currentPos = cardPositions[pageId] || { x: 100, y: 100 };
    const clickX = (e.clientX - pan.x) / scale;
    const clickY = (e.clientY - pan.y) / scale;
    setDragOffset({ x: clickX - currentPos.x, y: clickY - currentPos.y });
    setDraggingCardId(pageId);
  };

  const addStickyNote = () => {
    const newNote: CanvasNote = {
      id: `note-${Date.now()}`,
      x: (300 - pan.x) / scale,
      y: (200 - pan.y) / scale,
      text: 'Double-click to edit note...',
      color: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899'][notes.length % 4]
    };
    setNotes([...notes, newNote]);
    showToast('Sticky note added to Site Blueprint!');
  };

  // Automatic Connection Detection (Sitemap Auto-Graph Links)
  const getAutoConnections = () => {
    const connections: { fromId: string; toId: string; label: string }[] = [];
    const homePos = cardPositions['home'] || { x: 100, y: 150 };

    drafts.pages.forEach(p => {
      if (p.id !== 'home') {
        connections.push({
          fromId: 'home',
          toId: p.id,
          label: `Navbar → /${p.slug === 'home' ? '' : `${p.slug}.html`}`
        });
      }
    });

    if (cardPositions['services'] && cardPositions['customizations']) {
      connections.push({
        fromId: 'services',
        toId: 'customizations',
        label: 'CTA → TDL Modules'
      });
    }

    if (cardPositions['products'] && cardPositions['offers']) {
      connections.push({
        fromId: 'products',
        toId: 'offers',
        label: 'CTA → License Bundle Offers'
      });
    }

    return connections;
  };

  const connections = getAutoConnections();

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-[#070b13] select-none rounded-2xl border border-white/10 shadow-2xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Top Floating Blueprint Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3 p-2 rounded-2xl bg-[#0b1329]/90 border border-white/10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 rounded-xl border border-[#D4AF37]/20">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-extrabold text-white">Site Blueprint</span>
          <span className="text-[10px] text-[#D4AF37] font-semibold">Infinite Canvas</span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Tools Switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTool === 'select' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Select & Move Cards"
          >
            <MousePointer className="w-3.5 h-3.5" /> Select
          </button>
          <button
            onClick={() => setActiveTool('pan')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTool === 'pan' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            title="Pan Workspace"
          >
            <Move className="w-3.5 h-3.5" /> Hand Pan
          </button>
          <button
            onClick={addStickyNote}
            className="p-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
            title="Add Canvas Sticky Note"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-400" /> + Sticky Note
          </button>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(s => Math.max(0.4, s - 0.1))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-white/70 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(1.6, s + 0.1))}
            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setScale(0.85); setPan({ x: 80, y: 60 }); }}
            className="p-2 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            title="Reset Canvas View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Right Action & Publish Bar */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3 p-2 rounded-2xl bg-[#0b1329]/90 border border-white/10 backdrop-blur-xl shadow-xl">
        <span className="text-xs text-white/60 font-semibold px-2">
          {drafts.pages.length} Visual Pages Detected
        </span>

        <button
          onClick={() => setActiveTab('flow')}
          className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" /> Website Flow Mode
        </button>

        {isDraftModified ? (
          <button
            onClick={publishAll}
            className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-extrabold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Publish Live
          </button>
        ) : (
          <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-xl flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Live Synced
          </div>
        )}
      </div>

      {/* INFINITE CANVAS WORKSPACE */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="canvas-bg w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)
          `,
          backgroundSize: `${32 * scale}px ${32 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        {/* Scaled & Translated Canvas Content Wrapper */}
        <div
          className="absolute inset-0 origin-top-left pointer-events-auto"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
          }}
        >
          {/* SVG Connection Graph Arrows */}
          <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#D4AF37" opacity="0.7" />
              </marker>
            </defs>

            {connections.map((conn, i) => {
              const fromPos = cardPositions[conn.fromId] || { x: 100, y: 150 };
              const toPos = cardPositions[conn.toId] || { x: 500, y: 150 };
              const startX = fromPos.x + 320;
              const startY = fromPos.y + 120;
              const endX = toPos.x;
              const endY = toPos.y + 120;

              const dx = endX - startX;
              const controlX1 = startX + dx * 0.4;
              const controlX2 = endX - dx * 0.4;

              return (
                <g key={i}>
                  <path
                    d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    strokeDasharray="6,6"
                    opacity="0.45"
                    markerEnd="url(#arrowhead)"
                  />
                  <rect
                    x={(startX + endX) / 2 - 40}
                    y={(startY + endY) / 2 - 10}
                    width="80"
                    height="20"
                    rx="6"
                    fill="#0b1329"
                    stroke="rgba(212,175,55,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={(startX + endX) / 2}
                    y={(startY + endY) / 2 + 3}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    opacity="0.8"
                  >
                    Auto Connected
                  </text>
                </g>
              );
            })}
          </svg>

          {/* VISUAL PAGE CARDS */}
          {drafts.pages.map(page => {
            const pos = cardPositions[page.id] || { x: 100, y: 100 };
            return (
              <div
                key={page.id}
                onMouseDown={e => handleCardDragStart(e, page.id)}
                className="absolute w-[320px] rounded-2xl bg-[#0b1329]/95 border-2 border-white/10 hover:border-[#D4AF37] transition-shadow shadow-2xl group cursor-move select-none z-10"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`
                }}
              >
                {/* Page Card Header */}
                <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                    <h3 className="font-extrabold text-sm text-white tracking-tight">{page.title}</h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${page.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {page.status}
                  </span>
                </div>

                {/* Live Miniature Preview Window */}
                <div 
                  onDoubleClick={() => onOpenVisualEditor(page)}
                  className="p-4 bg-[#070c18] border-b border-white/5 space-y-3 cursor-pointer group-hover:bg-[#070c18]/80 transition-colors relative overflow-hidden"
                  title="Double-click to open Visual Page Editor"
                >
                  <div className="text-[10px] font-mono text-white/40 flex items-center justify-between">
                    <span>URL: /{page.slug === 'home' ? '' : `${page.slug}.html`}</span>
                    <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 font-bold transition-opacity">Double-click to Edit →</span>
                  </div>

                  {/* Wireframe / Live Render Preview Card */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-white/20 font-bold text-[11px] px-2 text-white flex items-center truncate">
                      {page.content.heroTitle || page.title}
                    </div>
                    <div className="h-3 w-1/2 rounded bg-white/10 text-[9px] px-2 text-white/50 flex items-center truncate">
                      {page.content.heroSubtitle || 'Subheadline section'}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold">
                        {page.content.primaryCtaLabel || 'CTA Button'}
                      </div>
                      <div className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[9px]">
                        Secondary Link
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-2.5 bg-black/40 flex items-center justify-between text-xs">
                  <a
                    href={`/${page.slug === 'home' ? 'index.html' : `${page.slug}.html`}?preview=draft`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenVisualEditor(page)}
                      className="px-3 py-1 text-black font-extrabold bg-[#D4AF37] hover:bg-[#c9a830] rounded-lg transition-colors text-[11px] flex items-center gap-1 shadow"
                    >
                      <Edit3 className="w-3 h-3" /> Visual Edit
                    </button>
                    <button
                      onClick={() => {
                        duplicatePage(page.id);
                        showToast(`Duplicated "${page.title}" card!`);
                      }}
                      className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* INTEGRATED CANVAS STICKY NOTES */}
          {notes.map((note, index) => (
            <div
              key={note.id}
              style={{
                left: `${note.x}px`,
                top: `${note.y}px`,
                backgroundColor: note.color
              }}
              className="absolute p-3 rounded-2xl text-black shadow-2xl w-52 border border-black/10 z-10"
            >
              <textarea
                rows={3}
                value={note.text}
                onChange={e => {
                  const updated = [...notes];
                  updated[index].text = e.target.value;
                  setNotes(updated);
                }}
                className="w-full bg-transparent text-xs font-extrabold text-black focus:outline-none resize-none placeholder-black/50"
              />
              <div className="flex items-center justify-between text-[9px] font-bold text-black/60 pt-1 border-t border-black/10">
                <span>Canvas Blueprint Note</span>
                <button
                  onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                  className="hover:text-black font-extrabold"
                >
                  Delete ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
