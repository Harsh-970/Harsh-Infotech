import React, { useState, useEffect, useRef } from 'react';
import { EditingEngine, SelectionState, ComponentSchema, EditableFieldSchema } from '../../engine/EditingEngine';
import { useCMS } from '../../context/CMSContext';
import { 
  Sliders, 
  Type, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Palette, 
  RotateCcw, 
  RotateCw, 
  Sparkles,
  Layers,
  MousePointer,
  CheckCircle,
  Phone,
  Mail,
  FileDown,
  Globe,
  Settings,
  Upload,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layout,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2
} from 'lucide-react';

interface DynamicInspectorProps {
  onStateChange?: (fieldId: string, value: any) => void;
}

export const DynamicInspector: React.FC<DynamicInspectorProps> = ({ onStateChange }) => {
  const { drafts, updateSettings } = useCMS();
  const [activeTab, setActiveTab] = useState<'inspector' | 'theme'>('inspector');
  const [selection, setSelection] = useState<SelectionState>(EditingEngine.getSelection());
  const [schema, setSchema] = useState<ComponentSchema | undefined>(undefined);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  // File Input Ref for Image Uploads
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme Studio Local State initialized from CMS settings
  const [accentColor, setAccentColor] = useState(drafts?.settings?.accentColor || '#D4AF37');
  const [fontFamily, setFontFamily] = useState(drafts?.settings?.fontFamily || 'Inter');
  const [borderRadius, setBorderRadius] = useState(drafts?.settings?.borderRadius || '12px');

  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem('hi_inspector_width');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 260), 520) : 340;
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      const clamped = Math.min(Math.max(newWidth, 260), 520);
      setWidth(clamped);
      localStorage.setItem('hi_inspector_width', clamped.toString());
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    // Subscribe to EditingEngine selection updates
    const unsubscribe = EditingEngine.subscribeSelection((nextSelection) => {
      setSelection(nextSelection);
      if (nextSelection.componentId) {
        const foundSchema = EditingEngine.getComponentSchema(nextSelection.componentId);
        setSchema(foundSchema);
      }
    });
    return unsubscribe;
  }, []);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFieldValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Update active selection data in EditingEngine
    EditingEngine.selectElement({
      data: {
        ...selection.data,
        [fieldId]: value
      }
    });

    if (onStateChange) {
      onStateChange(fieldId, value);
    }
  };

  // Image Upload File Handler using FileReader
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        handleFieldChange('imgSrc', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAccentChange = (val: string) => {
    setAccentColor(val);
    updateSettings({ accentColor: val });
    // Apply live CSS custom property to document
    document.documentElement.style.setProperty('--color-accent', val);
  };

  const handleFontChange = (val: string) => {
    setFontFamily(val);
    updateSettings({ fontFamily: val });
    document.documentElement.style.setProperty('--font-family', val);
  };

  const handleRadiusChange = (val: string) => {
    setBorderRadius(val);
    updateSettings({ borderRadius: val });
    document.documentElement.style.setProperty('--border-radius', val);
  };

  const handleUndo = () => {
    const record = EditingEngine.undo();
    if (record) {
      setFieldValues(record.stateSnapshot);
    }
  };

  const handleRedo = () => {
    const record = EditingEngine.redo();
    if (record) {
      setFieldValues(record.stateSnapshot);
    }
  };

  return (
    <aside 
      style={{ width: `${width}px` }} 
      className="relative border-l border-white/10 bg-[#0b1329] p-5 flex flex-col justify-between shrink-0 h-full overflow-y-auto select-none sticky top-0 z-30"
    >
      {/* Drag-to-Resize Handle */}
      <div 
        onMouseDown={startResizing} 
        className="absolute left-0 top-0 bottom-0 w-1.5 hover:w-2 hover:bg-[#D4AF37] cursor-col-resize z-50 transition-colors"
        title="Drag to resize inspector width (Min: 260px, Max: 520px)"
      />
      
      <div className="space-y-5">
        {/* Top Header & Tab Navigation */}
        <div className="space-y-3 border-b border-white/10 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#D4AF37]" /> Website OS Inspector
            </h3>

            <div className="flex items-center gap-1">
              <button
                onClick={handleUndo}
                disabled={!EditingEngine.canUndo()}
                className="p-1.5 rounded-lg text-white/70 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!EditingEngine.canRedo()}
                className="p-1.5 rounded-lg text-white/70 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-30 transition-colors"
                title="Redo (Ctrl+Shift+Z)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inspector vs Theme Studio Tabs */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'inspector' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/60 hover:text-white'
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" /> Component
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'theme' ? 'bg-[#D4AF37] text-black shadow' : 'text-white/60 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" /> Theme Studio
            </button>
          </div>
        </div>

        {/* TAB 1: COMPONENT ADAPTIVE INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="space-y-5">
            {/* Active Selection Header */}
            {selection.elementName ? (
              <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-1">
                <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">Active Selection</span>
                <div className="text-xs font-extrabold text-white flex items-center justify-between">
                  <span>{selection.elementName}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70 font-mono">
                    {selection.elementType || 'element'}
                  </span>
                </div>
                {selection.selectedId && (
                  <span className="text-[10px] text-white/50 font-mono block truncate">ID: {selection.selectedId}</span>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/50 text-center space-y-1">
                <Sparkles className="w-4 h-4 text-[#D4AF37] mx-auto opacity-70" />
                <p className="font-semibold text-white/80">Interactive Canvas Inspection</p>
                <p className="text-[11px] text-white/40">Click any element (Button, Heading, Image, Card, Navbar) on screen to edit its adaptive schema.</p>
              </div>
            )}

            {/* ADAPTIVE TYPE-SPECIFIC INSPECTORS */}
            <div className="space-y-4">
              {/* 1. BUTTON TYPE INSPECTOR */}
              {(selection.elementType === 'button' || selection.elementName?.toLowerCase().includes('button')) && (
                <div className="space-y-3.5 bg-white/[0.02] border border-white/10 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <MousePointer className="w-3.5 h-3.5 text-[#D4AF37]" /> Button Action & Style Inspector
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Button Text Label</label>
                    <input
                      type="text"
                      value={fieldValues.btnLabel ?? selection.data?.textContent ?? 'Contact Us'}
                      onChange={e => handleFieldChange('btnLabel', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Action Handler</label>
                    <select
                      value={fieldValues.btnAction || 'contact_modal'}
                      onChange={e => handleFieldChange('btnAction', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    >
                      <option value="contact_modal">Open Contact Modal (WhatsApp, Call, Email)</option>
                      <option value="whatsapp">Direct WhatsApp Chat (wa.me)</option>
                      <option value="call">Direct Phone Call (tel:)</option>
                      <option value="email">Send Direct Email (mailto:)</option>
                      <option value="page">Internal Page Link</option>
                      <option value="url">External Website URL</option>
                      <option value="download">Download File Asset</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Target Link / Phone / Email</label>
                    <input
                      type="text"
                      value={fieldValues.btnTarget || drafts.settings.contactWhatsApp || ''}
                      onChange={e => handleFieldChange('btnTarget', e.target.value)}
                      placeholder="+91 7558604483 or /services.html"
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Button Style Variant</label>
                    <select
                      value={fieldValues.btnVariant || 'gold'}
                      onChange={e => handleFieldChange('btnVariant', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    >
                      <option value="gold">Gold Solid (#D4AF37)</option>
                      <option value="glass">Glassmorphic Blur</option>
                      <option value="outline">Border Outline</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 2. IMAGE TYPE INSPECTOR WITH REAL FILE UPLOAD */}
              {(selection.elementType === 'image' || selection.elementName?.toLowerCase().includes('image') || selection.data?.src) && (
                <div className="space-y-3.5 bg-white/[0.02] border border-white/10 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" /> Image Asset & Upload Inspector
                  </div>

                  {/* Thumbnail Preview */}
                  {(fieldValues.imgSrc || selection.data?.src) && (
                    <div className="h-32 w-full rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center p-2">
                      <img
                        src={fieldValues.imgSrc || selection.data?.src || '/assets/logo.png'}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}

                  {/* Real File Upload Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                    <button
                      onClick={() => handleFieldChange('imgSrc', '/assets/logo.png')}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      Reset Image
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Image Source URL</label>
                    <input
                      type="text"
                      value={fieldValues.imgSrc || selection.data?.src || '/assets/logo.png'}
                      onChange={e => handleFieldChange('imgSrc', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Alt Text (SEO & Accessibility)</label>
                    <input
                      type="text"
                      value={fieldValues.imgAlt || selection.data?.alt || 'Harsh Infotech Logo'}
                      onChange={e => handleFieldChange('imgAlt', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Object Fit</label>
                    <select
                      value={fieldValues.imgFit || 'contain'}
                      onChange={e => handleFieldChange('imgFit', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    >
                      <option value="contain">Contain (Preserve aspect ratio)</option>
                      <option value="cover">Cover (Fill container)</option>
                      <option value="fill">Fill (Stretch to fit)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 3. CARD TYPE INSPECTOR (CARD MANAGEMENT) */}
              {(selection.elementType === 'card' || selection.elementName?.toLowerCase().includes('card')) && (
                <div className="space-y-3.5 bg-white/[0.02] border border-white/10 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <Layout className="w-3.5 h-3.5 text-[#D4AF37]" /> Card Container Inspector
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Card Title</label>
                    <input
                      type="text"
                      value={fieldValues.cardTitle || selection.data?.textContent || ''}
                      onChange={e => handleFieldChange('cardTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Card Badge / Tag</label>
                    <input
                      type="text"
                      value={fieldValues.cardBadge || 'POPULAR'}
                      onChange={e => handleFieldChange('cardBadge', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Card Order Controls */}
                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => EditingEngine.pushStateSnapshot('Duplicate Card', {})}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border border-white/10"
                    >
                      <Copy className="w-3 h-3 text-[#D4AF37]" /> Duplicate Card
                    </button>
                    <button
                      onClick={() => EditingEngine.pushStateSnapshot('Delete Card', {})}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 border border-red-500/20"
                    >
                      <Trash2 className="w-3 h-3" /> Delete Card
                    </button>
                  </div>
                </div>
              )}

              {/* 4. TEXT & HEADING TYPE INSPECTOR */}
              {(selection.elementType === 'text' || selection.elementType === 'heading' || selection.elementType === 'paragraph' || (!selection.elementType && selection.data?.textContent)) && (
                <div className="space-y-3.5 bg-white/[0.02] border border-white/10 p-3.5 rounded-xl">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <Type className="w-3.5 h-3.5 text-[#D4AF37]" /> Typography & Content Inspector
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-white/70 font-semibold block">Text Content</label>
                    <textarea
                      rows={4}
                      value={fieldValues.genericText ?? selection.data?.textContent ?? ''}
                      onChange={e => handleFieldChange('genericText', e.target.value)}
                      className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    <button
                      onClick={() => handleFieldChange('align', 'left')}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center border ${fieldValues.align === 'left' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 text-white/70 border-white/10'}`}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFieldChange('align', 'center')}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center border ${fieldValues.align === 'center' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 text-white/70 border-white/10'}`}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFieldChange('align', 'right')}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center border ${fieldValues.align === 'right' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-white/5 text-white/70 border-white/10'}`}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL THEME STUDIO */}
        {activeTab === 'theme' && (
          <div className="space-y-4 bg-white/[0.02] border border-white/10 p-4 rounded-xl">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 border-b border-white/10 pb-2">
              <Palette className="w-3.5 h-3.5 text-[#D4AF37]" /> Global Design Tokens (Live Canvas Application)
            </div>

            {/* Accent Color Token */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-semibold block">Primary Gold Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={e => handleAccentChange(e.target.value)}
                  className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={e => handleAccentChange(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>

            {/* Font Family Token */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-semibold block">Brand Typography Scale</label>
              <select
                value={fontFamily}
                onChange={e => handleFontChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
              >
                <option value="Inter">Inter (Clean Modern Sans)</option>
                <option value="Outfit">Outfit (Geometric Brand)</option>
                <option value="Roboto">Roboto (Enterprise Standard)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (SaaS Design)</option>
              </select>
            </div>

            {/* Border Radius Token */}
            <div className="space-y-1.5">
              <label className="text-xs text-white/70 font-semibold block">Component Border Radius</label>
              <select
                value={borderRadius}
                onChange={e => handleRadiusChange(e.target.value)}
                className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
              >
                <option value="0px">Sharp (0px)</option>
                <option value="8px">Subtle Rounded (8px)</option>
                <option value="12px">Standard Glass (12px)</option>
                <option value="16px">Pill Smooth (16px)</option>
                <option value="9999px">Full Capsule (9999px)</option>
              </select>
            </div>

            {/* Site Contact Settings */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <span className="text-[11px] font-bold text-white/80 block uppercase tracking-wider">CMS Global Contacts</span>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block">WhatsApp Number</label>
                <input
                  type="text"
                  value={drafts?.settings?.contactWhatsApp || ''}
                  onChange={e => updateSettings({ contactWhatsApp: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/50 block">Contact Email</label>
                <input
                  type="text"
                  value={drafts?.settings?.contactEmail || ''}
                  onChange={e => updateSettings({ contactEmail: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/10 text-center text-[10px] text-white/40 font-mono">
        Website OS Engine v3.5 (FileReader Active)
      </div>
    </aside>
  );
};

