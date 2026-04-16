import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Background, Navbar, Footer } from "./Shared";
import { CheckCircle2, Zap, Globe, Cpu, ArrowRight, Star, ChevronDown } from "lucide-react";

export default function MainServicesApp() {
  const [showMoreCustomization, setShowMoreCustomization] = useState(false);
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main className="pt-10 pb-32">

        {/* Page Hero */}
        <section className="text-center px-6 lg:px-20 max-w-4xl mx-auto mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6"
          >
            Tally <span className="text-white/40">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-white/60 mx-auto"
          >
            Genuine Tally licenses, cloud access, and custom solutions — everything your business needs in one place.
          </motion.p>
        </section>

        <div className="flex flex-col gap-32 px-6 lg:px-20 max-w-7xl mx-auto">

          {/* ── 1. TALLY PRIME LICENSE ─────────────────────────── */}
          <motion.section
            id="tally-license"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="scroll-mt-32"
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold">Tally Prime License</h2>
                <p className="text-white/50 mt-1">Genuine licensing with complete setup and support</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-white/60 mb-12 max-w-3xl leading-relaxed">
              Get genuine Tally Prime licenses (Single &amp; Multi User) directly from Tally Solutions certified partners.
              Full setup, activation, migration and training included. Annual renewal pricing is the same as license cost.
            </p>

            {/* Plan cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* Silver — Single User */}
              <div className="glass-card p-8 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 mb-6 z-10">
                  <Star className="w-5 h-5 text-white/60" />
                  <span className="text-sm font-bold uppercase tracking-widest text-white/60">Silver Plan</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 z-10">Single User</h3>
                <p className="text-white/50 text-sm mb-8 z-10">Best for individual accountants and small businesses with one Tally user.</p>

                {/* Pricing tiers */}
                <div className="space-y-4 mb-8 z-10">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Monthly Subscription</span>
                    <span className="font-bold text-lg">₹750 / mo</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div>
                      <span className="text-white/70">Yearly Subscription</span>
                      <span className="ml-2 text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">Save 2 months</span>
                    </div>
                    <span className="font-bold text-lg">₹7,500 / yr</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div>
                      <span className="text-white/70">Perpetual License</span>
                      <span className="ml-2 text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-semibold">One time</span>
                    </div>
                    <span className="font-bold text-lg">₹22,500</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 text-sm">Annual Renewal (Perpetual)</span>
                    <span className="text-white/50 text-sm">₹22,500 / yr</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 z-10">
                  {["GST Ready Billing", "Inventory Management", "Bank Reconciliation", "1 Concurrent User", "Free Setup Assistance"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/917558604483?text=Hi, I am interested in Tally Prime Silver (Single User) License"
                  data-auth-gated="true"
                  data-service-name="Tally Prime License"
                  target="_blank"
                  className="mt-auto w-full py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 z-10"
                >
                  Get Quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Gold — Multi User */}
              <div className="glass-card p-8 flex flex-col relative overflow-hidden border-[#D4AF37]/30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent pointer-events-none" />
                <div className="flex items-center gap-3 mb-6 z-10">
                  <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Gold Plan</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 z-10">Multi User</h3>
                <p className="text-white/50 text-sm mb-8 z-10">Ideal for businesses with multiple users needing simultaneous Tally access.</p>

                {/* Pricing tiers */}
                <div className="space-y-4 mb-8 z-10">
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <span className="text-white/70">Monthly Subscription</span>
                    <span className="font-bold text-lg">₹1,500 / mo</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div>
                      <span className="text-white/70">Yearly Subscription</span>
                      <span className="ml-2 text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-semibold">Save 2 months</span>
                    </div>
                    <span className="font-bold text-lg">₹15,000 / yr</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-white/10">
                    <div>
                      <span className="text-white/70">Perpetual License</span>
                      <span className="ml-2 text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full font-semibold">One time</span>
                    </div>
                    <span className="font-bold text-xl text-[#D4AF37]">₹67,500</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-white/50 text-sm">Annual Renewal (Perpetual)</span>
                    <span className="text-white/50 text-sm">₹67,500 / yr</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 z-10">
                  {["Everything in Silver", "Unlimited Concurrent Users", "Multi-Company Support", "Remote Access Ready", "Priority Support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="https://wa.me/917558604483?text=Hi, I am interested in Tally Prime Gold (Multi User) License"
                  data-auth-gated="true"
                  data-service-name="Tally Prime License"
                  target="_blank"
                  className="mt-auto w-full py-3.5 rounded-full bg-[#D4AF37] text-black font-bold hover:bg-[#c9a830] transition-all flex items-center justify-center gap-2 z-10"
                >
                  Get Quote <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Renewal note */}
            <div className="glass-card p-5 flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="text-white font-semibold">Renewal Note:</span> Annual renewal cost for perpetual licenses is identical to the original license price. Subscription plans renew at their respective monthly/yearly rates with no hidden charges.
              </p>
            </div>
          </motion.section>

          {/* ── 2. TALLY ON CLOUD ──────────────────────────────── */}
          <motion.section
            id="tally-cloud"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="scroll-mt-32"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                <Globe className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold">Tally on Cloud</h2>
                <p className="text-white/50 mt-1">Access your Tally data anytime, anywhere</p>
              </div>
            </div>

            <p className="text-lg text-white/60 mb-12 max-w-3xl leading-relaxed">
              We provide fully managed Tally on Cloud solutions without any technical complexity.
              No need to worry about server configuration — everything is optimized for smooth and secure performance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[
                {
                  name: "SINGLE USER (SU)",
                  price: "₹7,200",
                  period: "/ year",
                  features: ["1 User Access", "Secure Cloud Access", "Daily Backup", "Remote Login", "Cloud Support + Tally Support"],
                },
                {
                  name: "MULTI USER (MU)",
                  price: "₹7,200",
                  period: "per user / year",
                  features: ["Multiple Users Access", "Shared Cloud Environment", "Daily Backup", "Remote Login", "Cloud Support + Tally Support"],
                  highlight: true,
                },
              ].map((plan, i) => (
                <div
                  key={i}
                  className={`glass-card p-8 flex flex-col relative overflow-hidden ${plan.highlight ? "border-[#D4AF37]/30" : ""}`}
                >
                  {plan.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 to-transparent pointer-events-none" />
                  )}
                  {plan.highlight && (
                    <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-3 py-1 rounded-full z-10">Popular</span>
                  )}
                  <h3 className="text-2xl font-bold mb-6 z-10">{plan.name}</h3>
                  <ul className="space-y-4 mb-10 flex-1 z-10">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm md:text-base text-white/80">
                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mb-0 z-10">
                    <span className={`text-4xl font-black ${plan.highlight ? "text-[#D4AF37]" : ""}`}>{plan.price}</span>
                    <span className="text-white/50 text-sm ml-1 block mt-1">{plan.period}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-[#D4AF37]/20">
              <div className="flex items-start gap-4 flex-1">
                <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-white/80 leading-relaxed font-medium">
                  No need to select CPU, RAM, or server configurations — everything is already optimized for Tally performance.
                </p>
              </div>
              <div className="flex gap-4 w-full md:w-auto shrink-0">
                <a
                  href="https://wa.me/917558604483?text=Hi, I am interested in Tally on Cloud"
                  data-auth-gated="true"
                  data-service-name="Tally on Cloud"
                  target="_blank"
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  Get Started
                </a>
                <a
                  href="https://wa.me/917558604483?text=Hi, I am interested in Tally on Cloud"
                  data-auth-gated="true"
                  data-service-name="Tally on Cloud"
                  target="_blank"
                  className="px-6 py-3 rounded-full bg-[#D4AF37] text-black font-bold hover:bg-[#c9a830] transition-all flex items-center justify-center gap-2"
                >
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </motion.section>

          {/* ── 3. TALLY CUSTOMIZATION ─────────────────────────── */}
          <motion.section
            id="tally-customization"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
            className="scroll-mt-32"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center">
                <Cpu className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold">Tally Customization</h2>
                <p className="text-white/50 mt-1">TDL-powered workflows tailored to your business</p>
              </div>
            </div>

            <p className="text-lg text-white/60 mb-12 max-w-3xl leading-relaxed">
              We build custom Tally Definition Language (TDL) modules that extend Tally Prime to match your exact business
              workflow — from custom reports and invoices to automated workflows and integrations.
            </p>

            <div className="glass-card p-10 text-center border-[#D4AF37]/20 relative overflow-hidden mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
              <h3 className="text-2xl font-bold mb-3 z-10 relative">Make Your Own Customization</h3>
              <p className="text-white/50 mb-8 max-w-lg mx-auto z-10 relative">
                Every customization is unique. Share your requirements and we'll quote based on complexity, modules, and timeline.
              </p>
              <a
                href="https://wa.me/917558604483?text=Hi, I need a custom Tally TDL solution for my business"
                data-auth-gated="true"
                data-service-name="Tally Customization"
                target="_blank"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#D4AF37] text-black font-bold hover:bg-[#c9a830] transition-all z-10 relative"
              >
                Discuss Your Project <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              {[
                {
                  title: "Custom Invoice & Print Formats",
                  desc: "Design invoices, delivery challans, and receipts exactly matching your brand and format requirements.",
                  features: ["Logo & Brand Integration", "GST Compliant Formats", "Multi-language Support", "Auto Calculation Fields"],
                },
                {
                  title: "Custom Reports & MIS",
                  desc: "Build management reports, stock reports, ledger summaries, and dashboards tailored to your decision-making needs.",
                  features: ["Profit & Loss Variants", "Stock Ageing Analysis", "Custom Ledger Reports", "Excel Export Ready"],
                },
                {
                  title: "Workflow Automation",
                  desc: "Automate repetitive tasks — voucher approvals, party alerts, payment reminders, and more.",
                  features: ["Auto Voucher Posting", "Email / SMS Alerts", "Approval Workflows", "Scheduled Jobs"],
                },
                {
                  title: "Third-Party Integration",
                  desc: "Connect Tally with eCommerce platforms, HRMS, CRM, or any external system via API or import tools.",
                  features: ["GST Portal Filing", "eCommerce Sync", "Payroll Integration", "Bank Statement Import"],
                },
              ].map((item, i) => (
                <div key={i} className="glass-card p-8 flex flex-col relative z-20">
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">{item.desc}</p>
                  <ul className="space-y-3 flex-1">
                    {item.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm text-white/70">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <motion.div 
              initial={false}
              animate={{ height: showMoreCustomization ? 'auto' : 0, opacity: showMoreCustomization ? 1 : 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {[
                  {
                    title: "Auto Bank Reconciliation",
                    desc: "Automate the painful reconciliation process with direct bank statement imports and intelligent mapping algorithms.",
                    features: ["Statement Auto-Import", "Smart Entry Matching", "Discrepancy Alerts", "Bulk Posting Support"],
                  },
                  {
                    title: "GST Automation Suite",
                    desc: "Simplify GST compliance with advanced tools for return filing, reconciliation, and automated e-Way Bill generation.",
                    features: ["GSTR-1 & GSTR-3B Sync", "GSTR-2A Auto Reconciliation", "E-WAY Bill Generation", "Direct Portal Push"],
                  },
                  {
                    title: "Inventory & Warehouse Engine",
                    desc: "Enhance standard Tally inventory with barcode tracking, batch management, and multi-godown stock optimization.",
                    features: ["Barcode Printing & Scanning", "Expiry Date Alerts", "Low Stock Auto-Ordering", "Multi-Branch Transfer"],
                  },
                  {
                    title: "Payroll & HRMS Integration",
                    desc: "Seamlessly connect your HRMS with Tally to automate payroll processing without manual data entry.",
                    features: ["Attendance Sync", "Payslip Mass-Emailing", "PF/ESI Compliance Reports", "Leave Management Sync"],
                  },
                ].map((item, i) => (
                  <div key={`extra-${i}`} className="glass-card p-8 flex flex-col">
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-6">{item.desc}</p>
                    <ul className="space-y-3 flex-1">
                      {item.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-sm text-white/70">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {!showMoreCustomization && (
              <div className="relative pt-8 pb-8 flex flex-col items-center justify-center z-30">
                <button 
                  onClick={() => setShowMoreCustomization(true)} 
                  className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-bold hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] cursor-pointer flex items-center gap-2"
                >
                  Show More <ChevronDown className="w-4 h-4" />
                </button>
                <p className="mt-3 text-sm text-white/50 font-medium">Browse more options</p>
              </div>
            )}
          </motion.section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
