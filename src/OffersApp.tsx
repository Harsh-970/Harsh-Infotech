import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Background, Navbar, Footer } from "./Shared";
import { Tag, Calendar, Copy, Check, ArrowRight, Star, AlertCircle, Percent } from "lucide-react";
import offersDataRaw from "./data/offers.json";

export interface Offer {
  id: string;
  offerName: string;
  slug: string;
  discount: string;
  category: string;
  description: string;
  couponCode: string;
  expiryDate: string;
}

const offersData = offersDataRaw as Offer[];

export default function OffersApp() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    document.title = "Special Offers & Customization Discounts - Harsh Infotech";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Browse current offers, discounts, and package bundles on Tally licenses, customizations, VPS on Cloud, and support contracts from Harsh Infotech.");
    }
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(offersData.map(o => o.category)))];
  }, []);

  const filteredOffers = useMemo(() => {
    if (selectedCategory === "All") return offersData;
    return offersData.filter(o => o.category === selectedCategory);
  }, [selectedCategory]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  const isExpiredSoon = (dateStr: string) => {
    try {
      const expDate = new Date(dateStr);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 15;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main className="pt-8 pb-16 md:pb-24 lg:pb-32">
        {/* Page Hero */}
        <section className="text-center px-4 sm:px-6 lg:px-20 max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Tag className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Limited Time Offers</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.5rem,7vw+1rem,4.5rem)] font-extrabold tracking-tighter mb-6 leading-none"
          >
            Exclusive <span className="text-[#D4AF37]">Deals</span> & Offers
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-base md:text-lg lg:text-xl text-white/60 mx-auto max-w-2xl leading-relaxed"
          >
            Maximize your business budget. Save on licenses, cloud VPS instances, custom TDL modules, and AMC support bundles.
          </motion.p>
        </section>

        {/* Filters */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-12">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Offers Grid */}
        <section className="px-4 sm:px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredOffers.map((offer, idx) => {
                  const urgent = isExpiredSoon(offer.expiryDate);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      key={offer.id}
                      className="glass-card p-6 sm:p-8 lg:p-10 flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(212,175,55,0.08)] relative group overflow-hidden"
                    >
                      {/* Gold pulse border highlights */}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div>
                        {/* Tags */}
                        <div className="flex justify-between items-center mb-6 gap-2">
                          <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                            {offer.category}
                          </span>
                          
                          <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Expires: {new Date(offer.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>

                        {/* Title and Discount */}
                        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{offer.offerName}</h2>
                          <span className="text-2xl font-black text-[#D4AF37] bg-white/5 border border-white/10 px-3 py-1 rounded-xl flex items-center gap-1 shrink-0">
                            <Percent className="w-5 h-5 text-[#D4AF37]" />
                            {offer.discount}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-white/60 leading-relaxed mb-8">{offer.description}</p>
                      </div>

                      <div className="mt-auto space-y-4">
                        {/* Coupon copy section */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                          <div className="flex flex-col pl-2">
                            <span className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">Promo Code</span>
                            <span className="text-base font-black tracking-wider text-white uppercase">{offer.couponCode}</span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => copyToClipboard(offer.couponCode)}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
                          >
                            {copiedCode === offer.couponCode ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-500">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Claim CTA button */}
                        <a
                          href="#"
                          data-auth-gated="true"
                          data-auth-action="whatsapp"
                          data-phone="917558604483"
                          data-service-name={`Offer: ${offer.offerName} (${offer.couponCode})`}
                          className="w-full py-4 px-6 rounded-2xl bg-white text-black font-bold text-center transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/5 flex items-center justify-center gap-2 group/btn cursor-pointer"
                        >
                          <span>Claim Offer via WhatsApp</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </a>

                        {/* Urgency warning banner if expiring soon */}
                        {urgent && (
                          <div className="flex items-center gap-2 text-red-400 justify-center text-xs mt-2 font-semibold">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Expiring soon! Claim before it runs out.</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 glass-card p-10 max-w-xl mx-auto">
                <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Active Offers</h3>
                <p className="text-white/50 text-sm">There are currently no active offers listed in this category. Please check back later or contact our support team for custom corporate package discounts.</p>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
      <Footer />
    </div>
  );
}
