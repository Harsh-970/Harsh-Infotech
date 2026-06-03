import { useState, useEffect, useMemo } from "react";
import { Background, Navbar, Footer } from "./Shared";
import { CheckCircle2, Star, Sparkles, ChevronRight, FileDown, Shield } from "lucide-react";
import caseStudiesDataRaw from "./data/case-studies.json";

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industry: string;
  clientType: string;
  problem: string[];
  solution: string[];
  results: string[];
  image: string;
  documentUrl: string;
  relatedItems: string[];
  seoTitle?: string;
  seoDescription?: string;
  priority?: number;
  tags?: string[];
  hasCustomImage?: boolean;
}

const caseStudiesData = caseStudiesDataRaw as CaseStudy[];

export default function CaseStudiesApp() {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    if (typeof window !== "undefined" && (window as any).__ACTIVE_SLUG__) {
      return (window as any).__ACTIVE_SLUG__;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("study");
  });

  const activeStudy = useMemo(() => {
    if (!activeSlug) return null;
    return caseStudiesData.find(cs => cs.slug === activeSlug) || null;
  }, [activeSlug]);

  const recommendedStudies = useMemo(() => {
    if (!activeStudy) return [];
    
    // Explicit recommendation
    if (activeStudy.relatedItems && activeStudy.relatedItems.length > 0) {
      return caseStudiesData
        .filter(cs => cs.id !== activeStudy.id && activeStudy.relatedItems.includes(cs.slug))
        .slice(0, 3);
    }
    
    // Default fallback
    return caseStudiesData
      .filter(cs => cs.id !== activeStudy.id && cs.industry === activeStudy.industry)
      .slice(0, 3);
  }, [activeStudy]);

  const navigateToStudy = (slug: string) => {
    setActiveSlug(slug);
    const newUrl = `${window.location.pathname}?study=${slug}`;
    window.history.pushState({ slug }, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (activeStudy) {
      document.title = activeStudy.seoTitle || `${activeStudy.title} - Case Study | Harsh Infotech`;
    }
  }, [activeStudy]);

  if (!activeStudy) {
    return (
      <div className="min-h-screen selection:bg-white selection:text-black">
        <Background />
        <Navbar />
        <main className="pt-24 pb-16 text-center max-w-xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-4 text-text-primary">Case Study Not Found</h1>
          <p className="text-text-secondary mb-8">The requested success story cannot be resolved or is not active.</p>
          <a href="/" className="px-6 py-3 rounded-full bg-white text-black font-bold">Go to Homepage</a>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />

      <main className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-6 sm:p-10 shadow-lg space-y-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 uppercase">
                  {activeStudy.industry} Success Story
                </span>
                <span className="text-xs font-bold text-text-secondary bg-white/5 px-2.5 py-1 rounded">
                  {activeStudy.clientType}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight">
                {activeStudy.title}
              </h1>
            </div>

            {/* Problem section */}
            <div className="glass-card p-6 sm:p-10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" /> Challenges & Pain Points
              </h2>
              <ul className="space-y-4">
                {activeStudy.problem.map((prob, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/25 text-red-500 font-bold text-sm flex items-center justify-center shrink-0">
                      !
                    </div>
                    <p className="text-sm text-text-primary/95 leading-relaxed font-semibold">{prob}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solution section */}
            <div className="glass-card p-6 sm:p-10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> The Solution
              </h2>
              <ul className="space-y-4">
                {activeStudy.solution.map((sol, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-sm text-text-primary leading-relaxed">{sol}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Results section */}
            <div className="glass-card p-6 sm:p-10 shadow-lg">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" /> Key Business Outcomes
              </h2>
              <ul className="space-y-4">
                {activeStudy.results.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-6 h-6 text-accent-blue shrink-0 mt-0.5" />
                    <p className="text-sm text-text-primary font-medium">{res}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Right Column: CTA / Info */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            <div className="glass-card p-6 sm:p-8 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden text-center flex flex-col justify-center items-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"></div>
              
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-4">Case Study Actions</span>
              
              <div className="space-y-3.5 w-full">
                <a
                  href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi, I read your case study "${activeStudy.title}" and would like to consult on a similar solution for my company.`)}`}
                  data-auth-gated="true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black text-base hover:brightness-110 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                >
                  Consult an Expert
                </a>

                {activeStudy.documentUrl && (
                  <a
                    href={activeStudy.documentUrl}
                    download
                    className="w-full py-4 rounded-full bg-white/10 border border-white/20 hover:border-white/30 text-text-primary font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" /> Download PDF Case Study
                  </a>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 text-left w-full text-xs text-text-secondary">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent-blue" /> Verified Client Case Study</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-blue" /> Deployable Customizations Available</div>
              </div>
            </div>
          </div>

        </div>

        {/* Recommended Case Studies */}
        {recommendedStudies.length > 0 && (
          <section className="mt-20">
            <div className="h-px bg-white/10 mb-12" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-8 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" /> Related Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedStudies.map((cs) => (
                <div
                  key={cs.id}
                  onClick={() => navigateToStudy(cs.slug)}
                  className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex gap-2 items-center mb-3">
                      <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">{cs.industry}</span>
                      <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded">{cs.clientType}</span>
                    </div>
                    <h3 className="font-bold text-text-primary group-hover:text-[#D4AF37] transition-colors leading-tight mb-2 text-base line-clamp-2">
                      {cs.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-end mt-6 border-t border-white/5 pt-4">
                    <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                      Read full study <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
