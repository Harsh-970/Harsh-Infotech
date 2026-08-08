import React, { useState } from 'react';
import { useCMS } from '../../context/CMSContext';
import { Settings as SettingsIcon, Save, Key, Globe, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { drafts, updateSettings, publishAll } = useCMS();
  const [passcode, setPasscode] = useState(drafts.settings.adminPasscode || 'admin123');
  const [siteName, setSiteName] = useState(drafts.settings.siteName || 'Harsh Infotech Consultancy Services');
  const [contactPhone, setContactPhone] = useState(drafts.settings.contactPhone || '+917558604483');
  const [contactWhatsApp, setContactWhatsApp] = useState(drafts.settings.contactWhatsApp || '917558604483');
  const [contactEmail, setContactEmail] = useState(drafts.settings.contactEmail || 'info@harshinfotech.com');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adminPasscode: passcode,
      siteName,
      contactPhone,
      contactWhatsApp,
      contactEmail
    });
    showToast('Admin settings updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-black font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-[#D4AF37]" /> Admin & Site Settings
        </h2>
        <p className="text-xs text-white/60">Configure admin access passcode, site contact defaults, auto-save, and publication controls.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Passcode Security Card */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-[#D4AF37]" /> Admin Security & Passcode
          </h3>
          <div className="max-w-md">
            <label className="block text-xs text-white/70 font-semibold mb-1">Admin Passcode</label>
            <input
              type="text"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              required
            />
            <p className="text-[11px] text-white/40 mt-1">This passcode is required to log into the Admin Panel at <code>/admin.html</code>.</p>
          </div>
        </div>

        {/* Global Contact Defaults Card */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D4AF37]" /> Site Metadata & Defaults
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/70 font-semibold mb-1">Company / Site Title</label>
              <input
                type="text"
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 font-semibold mb-1">Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-xs text-white/70 font-semibold mb-1">Primary WhatsApp Number</label>
              <input
                type="text"
                value={contactWhatsApp}
                onChange={e => setContactWhatsApp(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* Publication Control Card */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Publication Status
          </h3>
          <p className="text-xs text-white/60">
            Last Published: <strong>{drafts.settings.lastPublishedAt ? new Date(drafts.settings.lastPublishedAt).toLocaleString() : 'Never'}</strong>
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                publishAll();
                showToast('All drafts published to live site!');
              }}
              className="px-5 py-2.5 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" /> Force Publish All Drafts
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-xs font-bold text-black bg-[#D4AF37] hover:bg-[#c9a830] rounded-xl transition-colors shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
