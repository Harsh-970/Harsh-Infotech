import React, { useState, useEffect } from 'react';
import { EditingEngine, SelectionState, ComponentSchema, EditableFieldSchema } from '../../engine/EditingEngine';
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
  Layers as LayersIcon
} from 'lucide-react';

interface DynamicInspectorProps {
  onStateChange?: (fieldId: string, value: any) => void;
}

export const DynamicInspector: React.FC<DynamicInspectorProps> = ({ onStateChange }) => {
  const [selection, setSelection] = useState<SelectionState>(EditingEngine.getSelection());
  const [schema, setSchema] = useState<ComponentSchema | undefined>(undefined);
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  const [width, setWidth] = useState<number>(() => {
    const saved = localStorage.getItem('hi_inspector_width');
    return saved ? Math.min(Math.max(parseInt(saved, 10), 260), 520) : 320;
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
    if (onStateChange) {
      onStateChange(fieldId, value);
    }
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
      className="relative border-l border-white/10 bg-[#0b1329] p-5 flex flex-col justify-between shrink-0 h-full overflow-y-auto select-none sticky top-0"
    >
      {/* Drag-to-Resize Handle */}
      <div 
        onMouseDown={startResizing} 
        className="absolute left-0 top-0 bottom-0 w-1.5 hover:w-2 hover:bg-[#D4AF37] cursor-col-resize z-50 transition-colors"
        title="Drag to resize inspector width (Min: 260px, Max: 520px)"
      />
      <div className="space-y-6">
        {/* Top Title Bar with Undo / Redo */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D4AF37]" /> Dynamic Inspector
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

        {/* Selected Component / Element Header */}
        {selection.elementName ? (
          <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-1">
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-wider block">Active Selection</span>
            <div className="text-xs font-extrabold text-white">{selection.elementName}</div>
            <span className="text-[10px] text-white/50 font-mono">Component: {selection.componentId || 'Global'}</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/50 text-center">
            Click any element on the page to inspect and edit properties dynamically.
          </div>
        )}

        {/* DYNAMIC FIELD GENERATION FROM COMPONENT SCHEMA */}
        {schema ? (
          <div className="space-y-4">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Schema Controls for {schema.name}
            </div>

            {schema.fields.map((field: EditableFieldSchema) => (
              <div key={field.id} className="space-y-1.5">
                <label className="block text-xs text-white/70 font-semibold">{field.label}</label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={fieldValues[field.id] || selection.data?.textContent || ''}
                    onChange={e => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    rows={3}
                    value={fieldValues[field.id] || selection.data?.textContent || ''}
                    onChange={e => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={fieldValues[field.id] || ''}
                    onChange={e => handleFieldChange(field.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white"
                  >
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {field.type === 'color' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fieldValues[field.id] || field.defaultValue || '#D4AF37'}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={fieldValues[field.id] || field.defaultValue || '#D4AF37'}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-[#D4AF37]" /> Generic Text Editor
            </div>
            <textarea
              rows={4}
              placeholder="Click any text element on screen to edit content..."
              value={selection.data?.textContent || ''}
              onChange={e => handleFieldChange('genericText', e.target.value)}
              className="w-full px-3 py-2 bg-[#070b13] border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
            />
          </div>
        )}

        {/* EXTENSION POINTS FOR FUTURE MODULES (Design System, Assets, Versions) */}
        <div className="pt-4 border-t border-white/10 space-y-2 text-[11px] text-white/40">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white/60">Global Tokens</span>
            <span className="text-[10px] text-white/30 font-mono">Plug-in ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white/60">Component Library</span>
            <span className="text-[10px] text-white/30 font-mono">Plug-in ready</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white/60">Version History</span>
            <span className="text-[10px] text-white/30 font-mono">Plug-in ready</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10 text-center text-[10px] text-white/40 font-mono">
        Editing Engine v3.0 (Foundation Active)
      </div>
    </aside>
  );
};
