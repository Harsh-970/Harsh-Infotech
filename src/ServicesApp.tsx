import { motion } from "motion/react";
import { useEffect } from "react";
import { Background, Navbar, Footer } from "./Shared";
import { CheckCircle2, Server, Settings, FileSpreadsheet, Database, Monitor, ArrowRight } from "lucide-react";

export default function ServicesApp() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const services = [
    {
      id: "vps",
      title: "VPS (Virtual Private Server)",
      desc: "High-performance cloud servers for running business applications securely and efficiently.",
      icon: <Server className="w-12 h-12 mb-6" />,
      features: ["99.9% Uptime Guarantee", "SSD Backed Storage", "24/7 Monitoring", "Full Root Access"],
      price: "₹1,999/mo",
      cta: "View Plans"
    },
    {
      id: "amc",
      title: "Tally AMC & Support",
      desc: "Reliable annual maintenance and support for smooth business operations.",
      icon: <Settings className="w-12 h-12 mb-6" />,
      features: ["Priority Remote Support", "Data Corruption Fixes", "Version Upgrades", "On-site Visits"],
      price: "₹4,500/yr",
      cta: "Get Contract"
    },
    {
      id: "excel",
      title: "Excel to Tally Integration",
      desc: "Seamlessly import and manage your vast Excel data directly into Tally.",
      icon: <FileSpreadsheet className="w-12 h-12 mb-6" />,
      features: ["Bulk Ledger Creation", "Voucher Imports", "Custom Mapping", "Error Validation"],
      price: "Custom",
      cta: "Request Demo"
    },
    {
      id: "data",
      title: "Data Migration & Setup",
      desc: "Secure transfer and setup of your existing business data to new systems or cloud.",
      icon: <Database className="w-12 h-12 mb-6" />,
      features: ["Zero Data Loss guarantee", "Downtime Minimization", "Secure Encryption", "Post-Migration Audit"],
      price: "Custom",
      cta: "Start Migration"
    },
    {
      id: "hardware",
      title: "Hardware & System Support",
      desc: "Complete assistance for business systems and physical IT infrastructure.",
      icon: <Monitor className="w-12 h-12 mb-6" />,
      features: ["Network Troubleshooting", "Hardware Repair", "System Upgrades", "Peripheral Setup"],
      price: "Hourly",
      cta: "Contact Support"
    }
  ];

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main className="pt-10 pb-32">
        <section className="text-center px-6 lg:px-20 max-w-4xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 gap-2"
          >
            More <span className="text-white/40">Solutions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-white/60 mx-auto"
          >
            Explore our comprehensive suite of advanced technology solutions tailored for scaling your enterprise.
          </motion.p>
        </section>

        <div className="flex flex-col gap-24 px-6 lg:px-20 max-w-7xl mx-auto flex-1">
          {services.map((svc, i) => {
            if (svc.id === "amc") {
              const amcPlans = [
                {
                  name: "Remote Support AMC",
                  pricingSingle: "₹9,000 / year",
                  pricingMulti: "₹13,500 / year",
                  features: ["Unlimited telephonic support (business hours)", "Quick issue resolution", "Guidance & troubleshooting"],
                  popular: false
                },
                {
                  name: "Basic AMC",
                  pricingSingle: "₹11,000 / year",
                  pricingMulti: "₹18,000 / year",
                  features: ["All Remote AMC features", "6 scheduled on-site visits", "Regular system checks"],
                  popular: true
                },
                {
                  name: "Plus AMC",
                  pricingSingle: "₹25,000 – ₹35,000 / year",
                  pricingMulti: "",
                  features: ["All Basic features", "12 scheduled visits", "Priority support"],
                  popular: false
                },
                {
                  name: "Premium AMC",
                  pricingSingle: "₹35,000 – ₹45,000+ / year",
                  pricingMulti: "",
                  features: ["All Plus features", "16 scheduled visits", "Highest priority support", "Complete system monitoring"],
                  popular: false
                }
              ];

              return (
                <motion.section 
                  key={svc.id} id={svc.id}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                  className="flex flex-col xl:flex-row gap-8 md:gap-12 items-start glass-card p-8 lg:p-12 scroll-mt-32 relative"
                >
                  <div className="flex-1 w-full xl:sticky xl:top-32">
                    {svc.icon}
                    <h2 className="text-4xl font-bold mb-4">{svc.title}</h2>
                    <p className="text-xl text-white/60 mb-8">{svc.desc}</p>
                    <ul className="space-y-4 mb-8">
                      {svc.features.map((ft, fi) => (
                        <li key={fi} className="flex items-center gap-3 text-lg">
                          <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /> {ft}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-full xl:w-[65%] shrink-0 flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {amcPlans.map((plan, idx) => (
                        <div 
                          key={idx} 
                          className={`glass-card p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.15)] ${plan.popular ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/50 scale-[1.02] hover:scale-[1.03] z-10' : ''}`}
                        >
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-bl-xl tracking-wider uppercase shadow-md">
                              Most Popular
                            </div>
                          )}
                          <h3 className="text-2xl font-bold mb-6 pr-20">{plan.name}</h3>
                          
                          <div className="mb-6 space-y-4 flex-1">
                            {plan.pricingSingle && (
                              <div>
                                <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">{plan.pricingMulti ? "Single User" : "Pricing"}</div>
                                <div className="text-2xl sm:text-3xl font-black text-[#D4AF37]">{plan.pricingSingle}</div>
                              </div>
                            )}
                            {plan.pricingMulti && (
                              <div>
                                <div className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Multi User</div>
                                <div className="text-2xl sm:text-3xl font-black text-[#D4AF37]">{plan.pricingMulti}</div>
                              </div>
                            )}
                          </div>

                          <div className="h-px w-full bg-white/10 mb-6" />

                          <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-3 text-sm sm:text-base text-white/70 leading-snug">
                                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <a 
                            href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi, I want AMC support for my business.\nPlan: ${plan.name}`)}`} 
                            data-auth-gated="true" 
                            data-service-name={`AMC Plan: ${plan.name}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 mt-auto z-10 ${plan.popular ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'bg-white/5 text-white hover:bg-white hover:text-black border border-white/10 hover:border-white'}`}
                          >
                            Get AMC Plan <ArrowRight className="w-5 h-5" />
                          </a>
                        </div>
                      ))}
                    </div>
                    
                    {/* Trust Line below cards */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
                      <div className="flex items-center gap-2 text-white/70 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Trusted by 100+ businesses</div>
                      <div className="flex items-center gap-2 text-white/70 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Fast response support</div>
                      <div className="flex items-center gap-2 text-white/70 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Expert Tally professionals</div>
                    </div>
                  </div>
                </motion.section>
              );
            }

            return (
              <motion.section 
                key={svc.id} id={svc.id}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-center glass-card p-10 lg:p-16 scroll-mt-32 relative"
              >
                <div className="flex-1 w-full">
                  {svc.icon}
                  <h2 className="text-4xl font-bold mb-4">{svc.title}</h2>
                  <p className="text-xl text-white/60 mb-8">{svc.desc}</p>
                  <ul className="space-y-4 mb-4 md:mb-0">
                    {svc.features.map((ft, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" /> {ft}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-[400px] shrink-0 glass-card p-10 text-center flex flex-col justify-center items-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-white/40 font-bold tracking-widest uppercase mb-4 text-sm z-10">Starting at</h3>
                  <div className="text-5xl font-black mb-8 z-10">{svc.price}</div>
                  <a href={`https://wa.me/917558604483?text=Hi, I am interested in ${svc.title}`} data-auth-gated="true" data-service-name={svc.title} target="_blank" className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 z-10">
                    {svc.cta} <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </motion.section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
