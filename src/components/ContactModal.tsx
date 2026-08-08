import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, PhoneCall, Mail, X, ShieldCheck } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  let settings = {
    contactWhatsApp: '917558604483',
    contactPhone: '+917558604483',
    contactEmail: 'harshinfotech2005@gmail.com'
  };

  try {
    const cms = useCMS();
    if (cms?.drafts?.settings) {
      settings = {
        contactWhatsApp: cms.drafts.settings.contactWhatsApp || settings.contactWhatsApp,
        contactPhone: cms.drafts.settings.contactPhone || settings.contactPhone,
        contactEmail: cms.drafts.settings.contactEmail || settings.contactEmail
      };
    }
  } catch {
    // CMSContext optional fallback if rendered outside provider
  }

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const cleanNumber = settings.contactWhatsApp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Hello! I would like to inquire about Harsh Infotech consultancy services.");
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleCall = () => {
    const cleanPhone = settings.contactPhone.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanPhone}`;
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Inquiry - Harsh Infotech Services");
    const body = encodeURIComponent("Hello Harsh Infotech Team,\n\nI would like to discuss my requirements with you.\n\nBest regards,");
    window.location.href = `mailto:${settings.contactEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-[#070b13] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[11px] font-extrabold text-[#D4AF37] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Fast Response Guaranteed
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Get in Touch with Us
            </h3>
            <p className="text-xs sm:text-sm text-white/60">
              Select your preferred channel to connect directly with our experts.
            </p>
          </div>

          {/* Contact Options */}
          <div className="space-y-3.5">
            {/* WhatsApp Option */}
            <button
              onClick={handleWhatsApp}
              className="w-full p-4 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition-all duration-300 group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Chat on WhatsApp
                  </h4>
                  <p className="text-xs text-white/50">Instant message & query support</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
                Online
              </span>
            </button>

            {/* Direct Call Option */}
            <button
              onClick={handleCall}
              className="w-full p-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all duration-300 group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    Direct Phone Call
                  </h4>
                  <p className="text-xs text-white/50">{settings.contactPhone}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                Call Now
              </span>
            </button>

            {/* Email Option */}
            <button
              onClick={handleEmail}
              className="w-full p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-left transition-all duration-300 group flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    Send Email Inquiry
                  </h4>
                  <p className="text-xs text-white/50">{settings.contactEmail}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full border border-blue-400/20">
                Email
              </span>
            </button>
          </div>

          <div className="mt-6 text-center text-[10px] text-white/40">
            Harsh Infotech Consultancy Services • Configurable via CMS
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
