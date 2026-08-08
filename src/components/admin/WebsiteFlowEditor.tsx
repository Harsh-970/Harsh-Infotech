import React, { useState } from 'react';
import { useCMS, FlowItem } from '../../context/CMSContext';
import { GitMerge, Plus, Trash2, ArrowRight, CheckCircle, Sparkles, MessageSquare, Phone, QrCode } from 'lucide-react';

export const WebsiteFlowEditor: React.FC = () => {
  const { drafts, addFlowStep, deleteFlowStep } = useCMS();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newFlow, setNewFlow] = useState<Omit<FlowItem, 'id'>>({
    source: '',
    target: '',
    actionType: 'Conversion Action',
    description: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlow.source || !newFlow.target) return;

    addFlowStep(newFlow);
    setIsAddModalOpen(false);
    setNewFlow({
      source: '',
      target: '',
      actionType: 'Conversion Action',
      description: ''
    });
    showToast('Flow journey step added!');
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-[#D4AF37]" /> Website User Journey & Action Flow Editor
          </h2>
          <p className="text-xs text-white/60">Node-based workspace dedicated to mapping user conversion paths, button triggers, and WhatsApp actions.</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Journey Step
        </button>
      </div>

      {/* Node Journey Flowchart */}
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">User Conversion Funnel</span>
          <span className="text-xs text-[#D4AF37] font-mono font-bold">{drafts.visualFlow.length} Active Steps</span>
        </div>

        <div className="space-y-4">
          {drafts.visualFlow.map((flow, idx) => (
            <div key={flow.id} className="relative flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center shrink-0 shadow-lg shadow-[#D4AF37]/20">
                {idx + 1}
              </div>

              {/* Source Box */}
              <div className="flex-1 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="block text-[10px] text-blue-300 font-bold uppercase mb-1">Trigger Node</span>
                <span className="text-xs font-extrabold text-white">{flow.source}</span>
              </div>

              {/* Arrow Connection */}
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[10px] text-white/60 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10 mb-1">
                  {flow.actionType}
                </span>
                <ArrowRight className="w-6 h-6 text-[#D4AF37]" />
              </div>

              {/* Target Box */}
              <div className="flex-1 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="block text-[10px] text-emerald-300 font-bold uppercase mb-1">Destination / Action</span>
                <span className="text-xs font-extrabold text-white">{flow.target}</span>
              </div>

              <button
                onClick={() => {
                  deleteFlowStep(flow.id);
                  showToast('Journey step removed');
                }}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                title="Delete Step"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF37]" /> Add Flow Journey Step
            </h3>

            <form onSubmit={handleAddStep} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Trigger / Source Node</label>
                <input
                  type="text"
                  placeholder="e.g. Homepage Hero Button ('Get Started')"
                  value={newFlow.source}
                  onChange={e => setNewFlow({ ...newFlow, source: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Destination / Action Node</label>
                <input
                  type="text"
                  placeholder="e.g. Tally on Cloud Services Page"
                  value={newFlow.target}
                  onChange={e => setNewFlow({ ...newFlow, target: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Action Description</label>
                <input
                  type="text"
                  placeholder="e.g. Conversion action leading to WhatsApp chat"
                  value={newFlow.actionType}
                  onChange={e => setNewFlow({ ...newFlow, actionType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 bg-white/5 rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl shadow-lg shadow-[#D4AF37]/20"
                >
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
