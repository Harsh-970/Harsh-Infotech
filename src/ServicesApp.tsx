import { motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { Background, Navbar, Footer } from "./Shared";
import { CheckCircle2, Server, Settings, FileSpreadsheet, Database, Monitor, ArrowRight } from "lucide-react";
import servicesDataRaw from "./data/services.json";
import pricingDataRaw from "./data/pricing.json";

export interface Service {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  category: string;
  description: string;
  price: string;
  benefits: string[];
  features: string[];
  image: string;
  documentUrl: string;
  relatedItems: string[];
  seoTitle?: string;
  seoDescription?: string;
  priority?: number;
  tags?: string[];
  hasCustomImage?: boolean;
}

export interface PricingPlan {
  id: string;
  planName: string;
  serviceSlug: string;
  pricingPeriod: string;
  price: string;
  features: string[];
  popular: boolean;
}

const servicesData = servicesDataRaw as Service[];
const pricingData = pricingDataRaw as PricingPlan[];

const getServiceIcon = (slug: string) => {
  if (slug === 'vps') return <Server className="w-12 h-12 mb-6 text-[#D4AF37]" />;
  if (slug === 'amc') return <Settings className="w-12 h-12 mb-6 text-[#D4AF37]" />;
  if (slug === 'excel') return <FileSpreadsheet className="w-12 h-12 mb-6 text-[#D4AF37]" />;
  if (slug === 'data-migration') return <Database className="w-12 h-12 mb-6 text-[#D4AF37]" />;
  if (slug === 'hardware-support') return <Monitor className="w-12 h-12 mb-6 text-[#D4AF37]" />;
  return <Server className="w-12 h-12 mb-6 text-[#D4AF37]" />;
};

const getServiceCta = (slug: string) => {
  if (slug === "amc") return "Get Contract";
  if (slug === "excel") return "Request Demo";
  if (slug === "data-migration") return "Start Migration";
  if (slug === "hardware-support") return "Contact Support";
  return "View Plans";
};

export default function ServicesApp() {
  useEffect(() => {
    const activeSlug = typeof window !== "undefined" ? (window as any).__ACTIVE_SLUG__ : null;
    const hash = window.location.hash;
    const targetId = hash ? hash.replace('#', '') : activeSlug;
    
    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, []);

  // Filter dynamic services list (only supplementary solutions)
  const services = useMemo(() => {
    return servicesData
      .filter(s => s.category === "More")
      .map(s => ({
        id: s.slug, // mapping slug to id for anchors
        title: s.title,
        desc: s.description,
        icon: getServiceIcon(s.slug),
        features: s.features,
        price: s.price,
        cta: getServiceCta(s.slug)
      }));
  }, []);

  // Filter dynamic AMC plans
  const amcPlans = useMemo(() => {
    return pricingData
      .filter(p => p.serviceSlug === "amc")
      .map(p => {
        const isMulti = p.price.includes('|');
        return {
          name: p.planName,
          pricingSingle: isMulti ? p.price.split('|')[0].replace('(Single)', '').trim() : p.price,
          pricingMulti: isMulti ? p.price.split('|')[1].replace('(Multi)', '').trim() : "",
          features: p.features,
          popular: p.popular
        };
      });
  }, []);

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main className="pt-8 pb-16 md:pb-24 lg:pb-32">
        <section className="text-center px-4 sm:px-6 lg:px-20 max-w-4xl mx-auto mb-16 md:mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="text-[clamp(2.5rem,7vw+1rem,4.5rem)] font-extrabold tracking-tighter mb-6 gap-2"
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

        <div className="flex flex-col gap-12 md:gap-20 lg:gap-24 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto flex-1">
          {services.map((svc) => {
            if (svc.id === "amc") {
              return (
                <motion.section 
                  key={svc.id} id={svc.id}
                  initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                  className="flex flex-col xl:flex-row gap-8 md:gap-12 items-start glass-card p-5 sm:p-8 lg:p-12 scroll-mt-32 relative"
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
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-center glass-card p-6 sm:p-10 lg:p-16 scroll-mt-32 relative"
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
                <div className="w-full md:w-[400px] shrink-0 glass-card p-6 sm:p-10 text-center flex flex-col justify-center items-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-white/40 font-bold tracking-widest uppercase mb-4 text-sm z-10">Starting at</h3>
                  <div className="text-5xl font-black mb-8 z-10">{svc.price}</div>
                  <a href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi, I am interested in ${svc.title}`)}`} data-auth-gated="true" data-service-name={svc.title} target="_blank" rel="noopener noreferrer" className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 z-10 cursor-pointer">
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
