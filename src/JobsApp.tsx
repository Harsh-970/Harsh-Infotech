import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Background, Navbar, Footer } from "./Shared";
import { Briefcase, MapPin, Clock, CircleDollarSign, ArrowRight, Search, FileText, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";
import jobsDataRaw from "./data/jobs.json";

export interface Job {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  benefits: string[];
  priority: number;
}

const jobsData = jobsDataRaw as Job[];

export default function JobsApp() {
  const [selectedJobId, setSelectedJobId] = useState<string>(() => jobsData[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    document.title = "Careers & Open Job Openings - Harsh Infotech";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Explore careers and join our engineering, support, and sales teams at Harsh Infotech. Apply to open TDL developer, support executive, and systems jobs.");
    }
  }, []);

  const departments = useMemo(() => {
    return ["All", ...Array.from(new Set(jobsData.map(j => j.department)))];
  }, []);

  const filteredJobs = useMemo(() => {
    return jobsData.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requirements.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDept = selectedDept === "All" || job.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  const activeJob = useMemo(() => {
    return jobsData.find(j => j.id === selectedJobId) || null;
  }, [selectedJobId]);

  // If filtered list changes, adjust active selection if necessary
  useEffect(() => {
    if (filteredJobs.length > 0 && !filteredJobs.some(j => j.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main className="pt-8 pb-16 md:pb-24 lg:pb-32">
        
        {/* Careers Hero */}
        <section className="text-center px-4 sm:px-6 lg:px-20 max-w-4xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Briefcase className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#D4AF37]">Join Our Team</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[clamp(2.5rem,7vw+1rem,4.5rem)] font-extrabold tracking-tighter mb-6 leading-none"
          >
            Careers at <span className="text-[#D4AF37]">Harsh Infotech</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-base md:text-lg lg:text-xl text-white/60 mx-auto max-w-2xl leading-relaxed"
          >
            Work with top-tier Tally customization engineers, cloud infrastructure technicians, and business solutions professionals. Shape the future of accounting automation.
          </motion.p>
        </section>

        {/* Search & Filters */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 sm:p-5">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search jobs, skills, or roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
            </div>
            
            {/* Department buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
              {departments.map((dept, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                    selectedDept === dept
                      ? "bg-white text-black border-white"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Split Pane Container */}
        <section className="px-4 sm:px-6 lg:px-12 xl:px-20 max-w-7xl mx-auto">
          {filteredJobs.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
              
              {/* Left Column: Job Cards List */}
              <div className="w-full lg:w-[42%] flex flex-col gap-4">
                <span className="text-xs uppercase font-bold text-white/40 tracking-wider mb-1 px-1">
                  Open Positions ({filteredJobs.length})
                </span>
                
                {filteredJobs.map((job) => {
                  const isSelected = job.id === selectedJobId;
                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setMobileDetailOpen(true);
                      }}
                      className={`glass-card p-5 cursor-pointer hover:shadow-lg transition-all border text-left flex items-center justify-between group ${
                        isSelected 
                          ? "border-[#D4AF37] bg-white/[0.04] shadow-[0_0_15px_rgba(212,175,55,0.06)]"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="space-y-2 flex-1 min-w-0 pr-4">
                        <h3 className={`text-lg font-bold tracking-tight truncate transition-colors ${isSelected ? "text-[#D4AF37]" : "text-white"}`}>
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/40">{job.department}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/50 pt-1">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{job.type}</span>
                        </div>
                      </div>
                      
                      <ChevronRight className={`w-5 h-5 text-white/30 group-hover:text-white transition-all transform shrink-0 ${
                        isSelected ? "translate-x-1 text-[#D4AF37]" : ""
                      }`} />
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Desktop Detail View */}
              <div className="hidden lg:block lg:w-[58%] glass-card p-8 lg:p-10 sticky top-32 border border-white/10 min-h-[500px]">
                {activeJob ? (
                  <div className="space-y-8 text-left">
                    {/* Header Details */}
                    <div>
                      <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                        {activeJob.department}
                      </span>
                      <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">{activeJob.title}</h2>
                      
                      <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-5 text-sm text-white/70">
                        <div className="flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <span>{activeJob.location}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <span>{activeJob.type}</span>
                        </div>
                        <div className="flex items-center gap-2.5 col-span-2">
                          <CircleDollarSign className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <span>{activeJob.salaryRange}</span>
                        </div>
                      </div>
                    </div>

                    {/* Job Description */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#D4AF37]" /> Job Overview
                      </h4>
                      <p className="text-white/60 leading-relaxed text-sm md:text-base">{activeJob.description}</p>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Key Requirements
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/60">
                        {activeJob.requirements.map((req, ri) => (
                          <li key={ri} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> What We Offer
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/60">
                        {activeJob.benefits.map((benefit, bi) => (
                          <li key={bi} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Call to Action */}
                    <div className="pt-4 border-t border-white/5">
                      <a
                        href="#"
                        data-auth-gated="true"
                        data-auth-action="email"
                        data-email="harshinfotech2005@gmail.com"
                        data-service-name={`Job App: ${activeJob.title}`}
                        className="inline-flex py-4 px-10 rounded-full bg-white text-black font-bold items-center gap-2 transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/5 group/apply cursor-pointer"
                      >
                        <span>Apply for this Position</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/apply:translate-x-1" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 text-center py-20">
                    <Briefcase className="w-16 h-16 mb-4" />
                    <span>Select a job listing to view complete descriptions and apply.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 glass-card p-10 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Careers Found</h3>
              <p className="text-white/50 text-sm">We couldn't find any job openings matching your search criteria. Try modifying your search query or selecting a different department filter.</p>
            </div>
          )}
        </section>

        {/* Mobile Detail Panel Modal Overlay */}
        <AnimatePresence>
          {mobileDetailOpen && activeJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/75 backdrop-blur-md"
              onClick={() => setMobileDetailOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg h-full bg-[#070F1E] border-l border-white/10 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between"
              >
                <div className="space-y-6 text-left">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                      {activeJob.department}
                    </span>
                    <button 
                      onClick={() => setMobileDetailOpen(false)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X className="w-6 h-6 text-white/70" />
                    </button>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-black text-white leading-tight mb-3">{activeJob.title}</h2>
                    <div className="flex flex-col gap-2 text-xs text-white/60 pt-2 border-t border-white/5">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />{activeJob.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#D4AF37]" />{activeJob.type}</span>
                      <span className="flex items-center gap-1.5"><CircleDollarSign className="w-3.5 h-3.5 text-[#D4AF37]" />{activeJob.salaryRange}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/5" />

                  {/* Description */}
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D4AF37]" /> Job Overview
                    </h4>
                    <p className="text-white/60 leading-relaxed text-sm">{activeJob.description}</p>
                  </div>

                  {/* Requirements */}
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Key Requirements
                    </h4>
                    <ul className="space-y-2 text-xs text-white/60">
                      {activeJob.requirements.map((req, ri) => (
                        <li key={ri} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" /> Benefits
                    </h4>
                    <ul className="space-y-2 text-xs text-white/60">
                      {activeJob.benefits.map((benefit, bi) => (
                        <li key={bi} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-8 border-t border-white/5">
                  <a
                    href="#"
                    data-auth-gated="true"
                    data-auth-action="email"
                    data-email="harshinfotech2005@gmail.com"
                    data-service-name={`Job App: ${activeJob.title}`}
                    className="w-full py-4 px-6 rounded-xl bg-white text-black font-bold text-center transition-all hover:bg-white/90 hover:shadow-lg flex items-center justify-center gap-2 group/apply cursor-pointer"
                  >
                    <span>Apply for this Position</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/apply:translate-x-1" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
