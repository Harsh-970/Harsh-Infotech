import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { Layout, Link as LinkIcon, Image, RefreshCw, CheckCircle, FileText, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { drafts, isDraftModified, publishAll } = useCMS();

  const activePages = drafts.pages.length;
  const activeLinks = drafts.links.filter(l => l.active).length;
  const totalFlows = drafts.visualFlow.length;

  return (
    <div className="space-[#1e293b] space-y-6">
      {/* Top Banner Alert if Draft modified */}
      {isDraftModified ? (
        <div className="p-4 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Unpublished Draft Changes Pending</h4>
              <p className="text-xs text-white/60">You have safe draft edits saved. Public visitors will not see changes until you click Publish.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href="/index.html?preview=draft"
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-initial px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview Draft
            </a>
            <button
              onClick={publishAll}
              className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-lg transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Publish Now
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Site is Live & Up to Date</h4>
            <p className="text-xs text-white/60">All recent draft changes have been published to the live site.</p>
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('pages')}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-medium">Total Pages</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layout className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{activePages}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/40 group-hover:text-[#D4AF37]">
            <span>Manage site pages</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('links')}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-medium">Active Actions & Links</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <LinkIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{activeLinks}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/40 group-hover:text-[#D4AF37]">
            <span>Configure CTAs & WhatsApp</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('links')}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-medium">Action Flow Connections</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalFlows}</div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/40 group-hover:text-[#D4AF37]">
            <span>View visual flowchart</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('media')}
          className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/50 font-medium">Media Assets</span>
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
              <Image className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">Assets Ready</div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/40 group-hover:text-[#D4AF37]">
            <span>Browse media gallery</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#D4AF37]" /> Quick Page Management
          </h3>
          <div className="divide-y divide-white/5">
            {drafts.pages.slice(0, 5).map(page => (
              <div key={page.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <h5 className="font-semibold text-sm text-white">{page.title}</h5>
                  <p className="text-xs text-white/40">URL: /{page.slug === 'home' ? '' : `${page.slug}.html`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${page.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {page.status}
                  </span>
                  <button
                    onClick={() => setActiveTab('pages')}
                    className="px-3 py-1.5 text-xs text-white/80 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System Info */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Safe Local Workflow
            </h3>
            <ul className="space-y-3 text-xs text-white/70">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Running on <strong>localhost:3000</strong> for safe testing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Edits automatically save to <strong>Draft Mode</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Closing browser or turning off PC will <strong>never lose drafts</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                <span>Public site updates only when you click <strong>Publish</strong>.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <button
              onClick={() => setActiveTab('whiteboard')}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Open Whiteboard Sketch Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
