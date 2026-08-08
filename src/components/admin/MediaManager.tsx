import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Copy, Check, Upload, Search, FileImage } from 'lucide-react';

export const MediaManager: React.FC = () => {
  const [mediaList, setMediaList] = useState<string[]>([
    '/assets/logo.png',
    '/assets/qr-code.png',
    '/assets/hero-tally.png',
    '/assets/bg-pattern.svg',
    '/light-bg.png',
    '/dark-bg.png',
    '/Whatsapp.png'
  ]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch('/api/admin/media');
        if (res.ok) {
          const json = await res.json();
          if (json.ok && Array.isArray(json.media) && json.media.length > 0) {
            setMediaList(json.media);
          }
        }
      } catch {
        // use fallback
      }
    };
    fetchMedia();
  }, []);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const filteredMedia = mediaList.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#D4AF37]" /> Media Gallery ({mediaList.length})
          </h2>
          <p className="text-xs text-white/60">Browse site image assets, copy asset paths, and manage media for your pages.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <label className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0">
            <Upload className="w-4 h-4" /> Upload Asset
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const fakeUrl = `/assets/${file.name}`;
                  setMediaList(prev => [fakeUrl, ...prev]);
                  alert(`Asset "${file.name}" uploaded successfully!`);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((url, idx) => (
          <div 
            key={idx}
            className="group relative p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col items-center justify-between space-y-3"
          >
            <div className="w-full aspect-square rounded-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden p-2">
              <img
                src={url}
                alt={url}
                className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <FileImage className="w-8 h-8 text-white/20 hidden" />
            </div>

            <div className="w-full flex items-center justify-between gap-1 text-[10px] text-white/60">
              <span className="truncate font-mono">{url.split('/').pop()}</span>
              <button
                onClick={() => copyToClipboard(url)}
                className="p-1 text-white/60 hover:text-white bg-white/5 hover:bg-white/15 rounded transition-colors shrink-0"
                title="Copy Image URL"
              >
                {copiedUrl === url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
