import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, RotateCcw, Download, StickyNote, Square, Circle } from 'lucide-react';

export const WhiteboardCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#D4AF37');
  const [lineWidth, setLineWidth] = useState(3);
  const [stickyNotes, setStickyNotes] = useState<{ id: string; x: number; y: number; text: string; color: string }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill initial dark background
    ctx.fillStyle = '#070c18';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#070c18';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#070c18';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setStickyNotes([]);
  };

  const addStickyNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      x: 100 + stickyNotes.length * 30,
      y: 100 + stickyNotes.length * 20,
      text: 'New Plan Note...',
      color: '#f59e0b'
    };
    setStickyNotes([...stickyNotes, newNote]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'harsh-infotech-whiteboard-sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Pen className="w-5 h-5 text-[#D4AF37]" /> Whiteboard & Sketch Canvas
          </h2>
          <p className="text-xs text-white/60">Optional visual planning space for sketching page funnels, wireframes, or notes.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tools */}
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${tool === 'pen' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'}`}
            >
              <Pen className="w-3.5 h-3.5" /> Pen
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${tool === 'eraser' ? 'bg-[#D4AF37] text-black' : 'text-white/60 hover:text-white'}`}
            >
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1.5 p-1.5 bg-black/40 border border-white/10 rounded-xl">
            {['#D4AF37', '#10b981', '#3b82f6', '#ef4444', '#ffffff'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                className={`w-5 h-5 rounded-full transition-transform ${color === c && tool === 'pen' ? 'scale-125 ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Stroke Width */}
          <input
            type="range"
            min="1"
            max="10"
            value={lineWidth}
            onChange={e => setLineWidth(Number(e.target.value))}
            className="w-20 accent-[#D4AF37]"
            title="Stroke Width"
          />

          <button
            onClick={addStickyNote}
            className="px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <StickyNote className="w-3.5 h-3.5 text-amber-400" /> Sticky Note
          </button>

          <button
            onClick={clearCanvas}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={downloadCanvas}
            className="p-2 text-white/70 hover:text-white bg-white/10 rounded-xl transition-colors"
            title="Download Sketch"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Workspace */}
      <div className="relative w-full h-[550px] rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#070c18]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Floating Sticky Notes overlay */}
        {stickyNotes.map((note, index) => (
          <div
            key={note.id}
            style={{ left: `${note.x}px`, top: `${note.y}px` }}
            className="absolute p-3 rounded-xl bg-amber-400/90 text-black shadow-xl w-48 border border-amber-300"
          >
            <textarea
              rows={3}
              value={note.text}
              onChange={e => {
                const next = [...stickyNotes];
                next[index].text = e.target.value;
                setStickyNotes(next);
              }}
              className="w-full bg-transparent text-xs font-semibold text-black focus:outline-none resize-none placeholder-black/50"
            />
            <button
              onClick={() => setStickyNotes(stickyNotes.filter(n => n.id !== note.id))}
              className="absolute top-1 right-1 text-[10px] text-black/60 hover:text-black font-bold px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
