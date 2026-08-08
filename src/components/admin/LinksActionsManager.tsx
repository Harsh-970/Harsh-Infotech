import React, { useState } from 'react';
import { useCMS, LinkItem, FlowItem } from '../../context/CMSContext';
import { Link as LinkIcon, Plus, Trash2, Edit2, CheckCircle, ArrowRight, ToggleLeft, ToggleRight, Phone, MessageSquare, QrCode, Layers, GitMerge, FileText } from 'lucide-react';

interface LinksActionsManagerProps {
  setActiveTab?: (tab: string) => void;
}

export const LinksActionsManager: React.FC<LinksActionsManagerProps> = ({ setActiveTab }) => {
  const { drafts, addLink, updateLink, deleteLink, addFlowStep, deleteFlowStep } = useCMS();
  
  // Section toggle: 'links' | 'visual_flow'
  const [subTab, setSubTab] = useState<'links' | 'visual_flow'>('links');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isAddFlowModalOpen, setIsAddFlowModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);

  // New Link form state
  const [newLinkData, setNewLinkData] = useState<Omit<LinkItem, 'id'>>({
    label: '',
    type: 'whatsapp',
    target: '',
    category: 'Direct Action',
    phone: '917558604483',
    message: 'Hi Harsh Infotech, I am interested in Tally solutions',
    active: true
  });

  // New Flow step form state
  const [newFlowData, setNewFlowData] = useState<Omit<FlowItem, 'id'>>({
    source: '',
    target: '',
    actionType: 'Conversion Action',
    description: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkData.label) return;

    let target = newLinkData.target;
    if (newLinkData.type === 'whatsapp') {
      target = `https://wa.me/${newLinkData.phone}?text=${encodeURIComponent(newLinkData.message || '')}`;
    } else if (newLinkData.type === 'call') {
      target = `tel:${newLinkData.phone}`;
    }

    addLink({
      ...newLinkData,
      target
    });

    setIsAddLinkModalOpen(false);
    setNewLinkData({
      label: '',
      type: 'whatsapp',
      target: '',
      category: 'Direct Action',
      phone: '917558604483',
      message: 'Hi Harsh Infotech, I am interested in Tally solutions',
      active: true
    });
    showToast('Link/Action created as Draft!');
  };

  const handleUpdateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;

    let target = editingLink.target;
    if (editingLink.type === 'whatsapp' && editingLink.phone) {
      target = `https://wa.me/${editingLink.phone}?text=${encodeURIComponent(editingLink.message || '')}`;
    } else if (editingLink.type === 'call' && editingLink.phone) {
      target = `tel:${editingLink.phone}`;
    }

    updateLink(editingLink.id, {
      ...editingLink,
      target
    });

    setEditingLink(null);
    showToast('Link/Action updated as Draft!');
  };

  const handleCreateFlow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowData.source || !newFlowData.target) return;

    addFlowStep(newFlowData);
    setIsAddFlowModalOpen(false);
    setNewFlowData({
      source: '',
      target: '',
      actionType: 'Conversion Action',
      description: ''
    });
    showToast('Flow connection step added!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'call':
        return <Phone className="w-4 h-4 text-blue-400" />;
      case 'qr_code':
        return <QrCode className="w-4 h-4 text-purple-400" />;
      default:
        return <LinkIcon className="w-4 h-4 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" /> {toastMessage}
        </div>
      )}

      {/* Top Header & Page / Link Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#D4AF37]" /> Links & Actions Control
          </h2>
          <p className="text-xs text-white/60">Separated management for buttons, WhatsApp actions, call triggers, and visual connection flows.</p>
        </div>

        {/* Clear Toggle between Page Editing and Link/Action Editing */}
        <div className="flex items-center gap-2 p-1 bg-black/40 border border-white/10 rounded-xl">
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('pages')}
              className="px-3 py-1.5 text-xs font-semibold text-white/60 hover:text-white rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" /> Page Content Editing
            </button>
          )}

          <button
            onClick={() => setSubTab('links')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${subTab === 'links' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> Link & Action Editing
          </button>

          <button
            onClick={() => setSubTab('visual_flow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${subTab === 'visual_flow' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            <GitMerge className="w-3.5 h-3.5" /> Visual Connection Flow
          </button>
        </div>
      </div>

      {/* SUBTAB 1: LINKS & ACTIONS MANAGER */}
      {subTab === 'links' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" /> Configured Buttons & Actions ({drafts.links.length})
            </h3>
            <button
              onClick={() => setIsAddLinkModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Link/Action
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.links.map(link => (
              <div
                key={link.id}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(link.type)}
                      <span className="text-xs font-bold text-white/80 capitalize">{link.type.replace('_', ' ')}</span>
                    </div>
                    <button
                      onClick={() => {
                        updateLink(link.id, { active: !link.active });
                        showToast(`Status toggled to ${!link.active ? 'Active' : 'Disabled'}`);
                      }}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {link.active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-white/30" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">{link.label}</h4>
                  <p className="text-xs font-mono text-white/50 break-all mb-3 bg-black/40 p-2 rounded-lg border border-white/5">
                    {link.target}
                  </p>

                  {link.type === 'whatsapp' && (
                    <div className="text-[11px] text-white/60 space-y-1 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20">
                      <div><strong>Phone:</strong> {link.phone}</div>
                      <div><strong>Message:</strong> {link.message}</div>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-white/40">{link.category}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-1.5 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete action "${link.label}"?`)) {
                          deleteLink(link.id);
                          showToast(`Removed "${link.label}"`);
                        }
                      }}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: VISUAL CONNECTION FLOW */}
      {subTab === 'visual_flow' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitMerge className="w-4 h-4 text-[#D4AF37]" /> Action Connection Flowchart
              </h3>
              <p className="text-xs text-white/60">Visual representation of user journey paths from button clicks to page destinations and WhatsApp/Call conversion actions.</p>
            </div>

            <button
              onClick={() => setIsAddFlowModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-bold text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Flow Step
            </button>
          </div>

          {/* Interactive Flowchart Diagram */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
            <div className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Customer Conversion Journey</div>
            
            <div className="relative space-y-4">
              {drafts.visualFlow.map((flow, index) => (
                <div key={flow.id} className="relative flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10">
                  {/* Step Number */}
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black font-extrabold text-xs flex items-center justify-center shrink-0 shadow-lg shadow-[#D4AF37]/20">
                    {index + 1}
                  </div>

                  {/* Source Box */}
                  <div className="flex-1 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center md:text-left">
                    <span className="block text-[10px] text-blue-300 font-bold uppercase">Trigger / Source</span>
                    <span className="text-xs font-bold text-white">{flow.source}</span>
                  </div>

                  {/* Connector Arrow */}
                  <div className="flex flex-col items-center shrink-0">
                    <span className="text-[10px] text-white/50 font-mono bg-white/5 px-2 py-0.5 rounded-full border border-white/10 mb-1">
                      {flow.actionType}
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                  </div>

                  {/* Target Box */}
                  <div className="flex-1 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center md:text-left">
                    <span className="block text-[10px] text-emerald-300 font-bold uppercase">Target / Destination</span>
                    <span className="text-xs font-bold text-white">{flow.target}</span>
                  </div>

                  {/* Action delete */}
                  <button
                    onClick={() => {
                      deleteFlowStep(flow.id);
                      showToast('Flow step deleted');
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                    title="Remove Step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Link Modal */}
      {isAddLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF37]" /> Add Action or Link
            </h3>

            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Action Label</label>
                <input
                  type="text"
                  placeholder="e.g. WhatsApp Consultation"
                  value={newLinkData.label}
                  onChange={e => setNewLinkData({ ...newLinkData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Action Type</label>
                  <select
                    value={newLinkData.type}
                    onChange={e => setNewLinkData({ ...newLinkData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#0b1329] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="whatsapp">WhatsApp Action</option>
                    <option value="call">Phone Call</option>
                    <option value="navigation">Navbar Link</option>
                    <option value="button">CTA Button</option>
                    <option value="qr_code">QR Code</option>
                    <option value="external">External URL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newLinkData.category}
                    onChange={e => setNewLinkData({ ...newLinkData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              {newLinkData.type === 'whatsapp' && (
                <div className="space-y-3 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                  <div>
                    <label className="block text-xs text-emerald-300 font-semibold mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={newLinkData.phone || ''}
                      onChange={e => setNewLinkData({ ...newLinkData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-emerald-300 font-semibold mb-1">Pre-filled Message</label>
                    <textarea
                      rows={2}
                      value={newLinkData.message || ''}
                      onChange={e => setNewLinkData({ ...newLinkData, message: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {newLinkData.type === 'call' && (
                <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                  <label className="block text-xs text-blue-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newLinkData.phone || ''}
                    onChange={e => setNewLinkData({ ...newLinkData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              {(newLinkData.type === 'navigation' || newLinkData.type === 'button' || newLinkData.type === 'external') && (
                <div>
                  <label className="block text-xs text-white/70 font-semibold mb-1">Target URL / Hash</label>
                  <input
                    type="text"
                    placeholder="e.g. /services.html or #contact"
                    value={newLinkData.target}
                    onChange={e => setNewLinkData({ ...newLinkData, target: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddLinkModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 bg-white/5 rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl shadow-lg shadow-[#D4AF37]/20"
                >
                  Save Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit Action: {editingLink.label}
            </h3>

            <form onSubmit={handleUpdateLink} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Action Label</label>
                <input
                  type="text"
                  value={editingLink.label}
                  onChange={e => setEditingLink({ ...editingLink, label: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              {editingLink.type === 'whatsapp' && (
                <div className="space-y-3 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                  <div>
                    <label className="block text-xs text-emerald-300 font-semibold mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={editingLink.phone || ''}
                      onChange={e => setEditingLink({ ...editingLink, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-emerald-300 font-semibold mb-1">Pre-filled Message</label>
                    <textarea
                      rows={2}
                      value={editingLink.message || ''}
                      onChange={e => setEditingLink({ ...editingLink, message: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              )}

              {editingLink.type === 'call' && (
                <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                  <label className="block text-xs text-blue-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingLink.phone || ''}
                    onChange={e => setEditingLink({ ...editingLink, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Target URL / Value</label>
                <input
                  type="text"
                  value={editingLink.target}
                  onChange={e => setEditingLink({ ...editingLink, target: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 bg-white/5 rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl shadow-lg shadow-[#D4AF37]/20"
                >
                  Update Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Flow Modal */}
      {isAddFlowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-white/20 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#D4AF37]" /> Add Visual Connection Flow Step
            </h3>

            <form onSubmit={handleCreateFlow} className="space-y-4">
              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Trigger / Source Node</label>
                <input
                  type="text"
                  placeholder="e.g. Homepage Hero CTA ('Get Started')"
                  value={newFlowData.source}
                  onChange={e => setNewFlowData({ ...newFlowData, source: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Target / Destination Node</label>
                <input
                  type="text"
                  placeholder="e.g. Tally on Cloud Pricing Options"
                  value={newFlowData.target}
                  onChange={e => setNewFlowData({ ...newFlowData, target: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-white/70 font-semibold mb-1">Action Type</label>
                <input
                  type="text"
                  placeholder="e.g. Option Selection or WhatsApp Conversion"
                  value={newFlowData.actionType}
                  onChange={e => setNewFlowData({ ...newFlowData, actionType: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddFlowModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-white/70 bg-white/5 rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl shadow-lg shadow-[#D4AF37]/20"
                >
                  Save Flow Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
