import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ArrowLeft, CheckCircle2, ChevronRight, HelpCircle, 
  Tag, MessageSquare, TrendingUp, Sparkles, Filter, RefreshCw,
  Phone, Globe, Info, Zap, Settings, Shield, ChevronDown,
  Layers, Grid3X3, LayoutList
} from "lucide-react";
import { Background, Navbar, Footer } from "./Shared";
import { customizationsData, CustomizationModule } from "./data/customizations";

export default function CustomizationsApp() {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("module");
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedCompatibilities, setSelectedCompatibilities] = useState<string[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [layoutMode, setLayoutMode] = useState<"grid" | "list" | "stack">("grid");
  const [activeIndex, setActiveIndex] = useState(0);

  const getLayoutStyles = (stackPosition: number) => {
    switch (layoutMode) {
      case "stack":
        return {
          top: stackPosition * 6,
          left: stackPosition * 6,
          zIndex: filteredItems.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        };
      case "grid":
      case "list":
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        };
    }
  };

  const containerClass = {
    grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6",
    list: "flex flex-col gap-6 max-w-4xl mx-auto w-full",
    stack: "relative h-[480px] w-full max-w-xs mx-auto",
  };

  const displayItems = useMemo(() => {
    if (layoutMode !== "stack") return filteredItems;
    if (filteredItems.length === 0) return [];
    
    const reordered = [];
    for (let i = 0; i < filteredItems.length; i++) {
      const index = (activeIndex + i) % filteredItems.length;
      reordered.push({ ...filteredItems[index], stackPosition: i });
    }
    return reordered.reverse();
  }, [filteredItems, layoutMode, activeIndex]);

  // Sync browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveSlug(params.get("module"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToModule = (slug: string | null) => {
    setActiveSlug(slug);
    const newUrl = slug 
      ? `${window.location.pathname}?module=${slug}` 
      : window.location.pathname;
    window.history.pushState({ slug }, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SEO Metatags & Title
  useEffect(() => {
    if (activeSlug) {
      const activeModule = customizationsData.find(m => m.slug === activeSlug);
      if (activeModule) {
        document.title = `${activeModule.title} - Tally Customizations | Harsh Infotech`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", `${activeModule.title}: ${activeModule.description}`);
        }
      }
    } else {
      document.title = "Tally Customizations & Business Modules Marketplace - Harsh Infotech";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "Browse premium Tally Prime TDL customizations, vertical business modules, retail grid billing POS, biometric payroll integration, and MIS dashboards by Harsh Infotech.");
      }
    }
  }, [activeSlug]);

  // Schema-ready JSON-LD structured markup
  useEffect(() => {
    const existingScript = document.getElementById("jsonld-schema");
    if (existingScript) existingScript.remove();

    let schemaData = {};
    if (activeSlug) {
      const activeModule = customizationsData.find(m => m.slug === activeSlug);
      if (activeModule) {
        schemaData = {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": activeModule.title,
          "description": activeModule.description,
          "category": activeModule.category,
          "image": `${window.location.origin}${activeModule.image}`,
          "offers": {
            "@type": "Offer",
            "price": activeModule.price.replace(/[^\d]/g, ''),
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": window.location.href
          }
        };
      }
    } else {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Tally Customizations Catalog",
        "numberOfItems": customizationsData.length,
        "itemListElement": customizationsData.map((m, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${window.location.origin}/customizations.html?module=${m.slug}`,
          "name": m.title
        }))
      };
    }

    const script = document.createElement("script");
    script.id = "jsonld-schema";
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("jsonld-schema");
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [activeSlug]);

  // Categories & Industries derived lists
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(customizationsData.map(c => c.category)))];
  }, []);

  const industries = useMemo(() => {
    return ["All", ...Array.from(new Set(customizationsData.map(c => c.industry)))];
  }, []);

  const quickFilterOptions = ["Tally Prime", "Cloud Compatible", "GST Enabled", "Barcode Support"];

  // Toggle compatibility chips
  const toggleCompatibility = (tag: string) => {
    setSelectedCompatibilities(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Search suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return customizationsData
      .filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return customizationsData
      .filter(item => {
        // Search filter
        const matchesSearch = searchQuery.trim() === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

        // Industry filter
        const matchesIndustry = selectedIndustry === "All" || item.industry === selectedIndustry;

        // Compatibility filter
        const matchesCompatibility = selectedCompatibilities.every(comp => 
          item.compatibility.includes(comp)
        );

        return matchesSearch && matchesCategory && matchesIndustry && matchesCompatibility;
      })
      .sort((a, b) => {
        if (selectedSort === "popular") {
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
        }
        if (selectedSort === "a-z") {
          return a.title.localeCompare(b.title);
        }
        if (selectedSort === "z-a") {
          return b.title.localeCompare(a.title);
        }
        if (selectedSort === "price-low") {
          const priceA = parseInt(a.price.replace(/[^\d]/g, "")) || 0;
          const priceB = parseInt(b.price.replace(/[^\d]/g, "")) || 0;
          return priceA - priceB;
        }
        if (selectedSort === "price-high") {
          const priceA = parseInt(a.price.replace(/[^\d]/g, "")) || 0;
          const priceB = parseInt(b.price.replace(/[^\d]/g, "")) || 0;
          return priceB - priceA;
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedIndustry, selectedSort, selectedCompatibilities]);

  // Active module for details page
  const activeModule = useMemo(() => {
    if (!activeSlug) return null;
    return customizationsData.find(m => m.slug === activeSlug) || null;
  }, [activeSlug]);

  // Recommended modules for details page
  const recommendedModules = useMemo(() => {
    if (!activeModule) return [];
    const primary = customizationsData.filter(m => 
      m.id !== activeModule.id && 
      (m.category === activeModule.category || m.industry === activeModule.industry)
    );
    const ids = new Set(primary.map(p => p.id));
    const backup = customizationsData.filter(m => m.id !== activeModule.id && !ids.has(m.id));
    return [...primary, ...backup].slice(0, 3);
  }, [activeModule]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedIndustry("All");
    setSelectedSort("popular");
    setSelectedCompatibilities([]);
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />

      <main className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeModule ? (
            /* MARKETPLACE LIST VIEW */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* HERO SECTION */}
              <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider mb-6 text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" /> Marketplace & Catalog
                </div>
                <h1 className="text-[clamp(2.25rem,6vw+1rem,4rem)] font-extrabold tracking-tighter leading-none mb-6">
                  Tally <span className="text-white/40">Customizations</span>
                </h1>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  Enhance Tally Prime and automate core operational workflows with plug-and-play TDL modules. 
                  Tailor invoice creation, layouts, integrations, and reports to your specific industry guidelines.
                </p>
              </section>

              {/* SEARCH & FILTERS CONTAINER */}
              <section className="glass-card p-6 mb-10 z-30 relative shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  
                  {/* Search Bar + Suggestions */}
                  <div className="lg:col-span-6 relative">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-60" />
                      <input
                        type="text"
                        placeholder="Search customizations, categories, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                        className="w-full bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-all text-text-primary placeholder:text-text-secondary/50"
                      />
                    </div>

                    {/* Suggestions Dropdown */}
                    <AnimatePresence>
                      {searchFocused && suggestions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 right-0 mt-2 rounded-xl bg-surface border border-white/10 dark:border-white/5 shadow-2xl p-2 z-50 max-h-60 overflow-y-auto"
                        >
                          <div className="text-[10px] font-bold text-text-secondary/50 px-3 py-1.5 uppercase tracking-wider">Suggestions</div>
                          {suggestions.map((sug) => (
                            <button
                              key={sug.id}
                              onMouseDown={() => {
                                navigateToModule(sug.slug);
                                setSearchQuery("");
                              }}
                              className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 dark:hover:bg-white/5 flex items-center justify-between text-xs font-semibold text-text-primary transition-colors"
                            >
                              <span>{sug.title}</span>
                              <span className="text-[10px] bg-white/10 text-text-secondary px-2 py-0.5 rounded">{sug.category}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Category Filter */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-text-primary font-medium"
                      >
                        <option value="All" className="bg-[#0A1931] text-white">All Categories</option>
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat} className="bg-[#0A1931] text-white">{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-60 pointer-events-none" />
                    </div>
                  </div>

                  {/* Industry Filter */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full appearance-none bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-text-primary font-medium"
                      >
                        <option value="All" className="bg-[#0A1931] text-white">All Industries</option>
                        {industries.filter(i => i !== "All").map(ind => (
                          <option key={ind} value={ind} className="bg-[#0A1931] text-white">{ind} Industry</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-60 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* HORIZONTAL RULE */}
                <div className="h-px bg-white/10 my-4" />

                {/* BOTTOM FILTERS ROW: Sort, Quick Chips, Clear */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  
                  {/* Quick Filters Chips */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs font-bold text-text-secondary flex items-center gap-1.5 mr-2">
                      <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Compatibility:
                    </span>
                    {quickFilterOptions.map(chip => {
                      const active = selectedCompatibilities.includes(chip);
                      return (
                        <button
                          key={chip}
                          onClick={() => toggleCompatibility(chip)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold ${
                            active 
                              ? 'bg-accent-blue/15 border-accent-blue/40 text-text-primary' 
                              : 'bg-white/5 border-white/5 hover:border-white/20 text-text-secondary'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sort Dropdown & Reset */}
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                    <div className="relative w-full sm:w-44">
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="w-full appearance-none bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-xl px-3.5 py-2.5 pr-10 text-xs focus:outline-none focus:border-[#D4AF37]/50 transition-all text-text-primary font-semibold"
                      >
                        <option value="popular" className="bg-[#0A1931] text-white">Sort: Popularity</option>
                        <option value="a-z" className="bg-[#0A1931] text-white">Sort: A-Z</option>
                        <option value="z-a" className="bg-[#0A1931] text-white">Sort: Z-A</option>
                        <option value="price-low" className="bg-[#0A1931] text-white">Price: Low to High</option>
                        <option value="price-high" className="bg-[#0A1931] text-white">Price: High to Low</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-60 pointer-events-none" />
                    </div>

                    {(searchQuery || selectedCategory !== "All" || selectedIndustry !== "All" || selectedCompatibilities.length > 0) && (
                      <button
                        onClick={resetFilters}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all shrink-0 flex items-center justify-center cursor-pointer"
                        title="Clear Filters"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Layout Toggle Selector */}
              <div className="flex items-center justify-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1.5 w-fit mx-auto mb-8">
                <button
                  onClick={() => setLayoutMode("grid")}
                  className={`rounded-lg px-4 py-2 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    layoutMode === "grid"
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                  aria-label="Switch to grid layout"
                >
                  <Grid3X3 className="w-3.5 h-3.5" /> Grid
                </button>
                <button
                  onClick={() => setLayoutMode("list")}
                  className={`rounded-lg px-4 py-2 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    layoutMode === "list"
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                  aria-label="Switch to list layout"
                >
                  <LayoutList className="w-3.5 h-3.5" /> List
                </button>
                <button
                  onClick={() => setLayoutMode("stack")}
                  className={`rounded-lg px-4 py-2 transition-all text-xs font-bold flex items-center gap-2 cursor-pointer ${
                    layoutMode === "stack"
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                  aria-label="Switch to stack layout"
                >
                  <Layers className="w-3.5 h-3.5" /> Stack
                </button>
              </div>

              {/* DYNAMIC CARD CONTAINER WITH LAYOUT MODES */}
              {filteredItems.length > 0 ? (
                <div className="relative w-full">
                  <motion.div 
                    layout 
                    className={containerClass[layoutMode]}
                  >
                    <AnimatePresence mode="popLayout">
                      {displayItems.map((module) => {
                        const stackPos = (module as any).stackPosition;
                        const styles = getLayoutStyles(stackPos);
                        const isTopCard = layoutMode === "stack" && stackPos === 0;

                        return (
                          <motion.div
                            layout
                            key={module.id}
                            layoutId={module.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              x: 0,
                              ...styles,
                            }}
                            exit={{ opacity: 0, scale: 0.8, x: -200 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                            whileHover={layoutMode !== "stack" ? { y: -5 } : undefined}
                            onClick={() => {
                              if (layoutMode === "stack" && !isTopCard) {
                                // Bring this card to top
                                const index = filteredItems.findIndex(m => m.id === module.id);
                                if (index >= 0) setActiveIndex(index);
                              }
                            }}
                            className={`glass-card flex flex-col group ${
                              layoutMode === "stack" ? "absolute w-full max-w-xs h-[420px]" : "h-full"
                            } ${
                              layoutMode === "list" ? "md:flex-row md:h-64" : ""
                            }`}
                          >
                            {/* Popular / Featured Badges */}
                            {module.popular && (
                              <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black text-[9px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider uppercase z-20 shadow-md">
                                Popular
                              </div>
                            )}

                            {/* Header block with visual icon representation */}
                            <div className={`p-6 pb-2 ${layoutMode === "list" ? "md:w-2/3 flex flex-col justify-center" : ""}`}>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">
                                  {module.category}
                                </span>
                                <span className="text-[10px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded">
                                  {module.industry}
                                </span>
                              </div>
                              
                              <h3 className="text-lg font-bold text-text-primary group-hover:text-[#D4AF37] transition-colors leading-tight mb-2 min-h-[3rem] flex items-center">
                                {module.title}
                              </h3>

                              <p className="text-xs text-text-secondary leading-relaxed min-h-[4.5rem] line-clamp-3">
                                {module.description}
                              </p>
                            </div>

                            {/* Attribute List */}
                            <div className={`p-6 pt-0 flex-1 flex flex-col justify-end ${layoutMode === "list" ? "md:w-1/3 md:border-l md:border-white/10 md:p-6" : ""}`}>
                              {layoutMode !== "list" && <div className="h-px bg-white/10 my-4" />}

                              <div className="mb-5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/50 mb-2">Key Benefits</div>
                                <ul className="space-y-1.5">
                                  {module.benefits.slice(0, 2).map((benefit, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-text-primary/95 leading-tight">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-blue shrink-0 mt-0.5" />
                                      <span className="line-clamp-1">{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Compatibility tags */}
                              <div className="flex flex-wrap gap-1 mb-4 min-h-[2.5rem]">
                                {module.compatibility.slice(0, 3).map((comp, idx) => (
                                  <span key={idx} className="text-[9px] font-semibold text-text-secondary bg-white/5 dark:bg-black/10 border border-white/5 rounded px-2 py-0.5">
                                    {comp}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center justify-between mt-auto">
                                <div>
                                  <div className="text-[9px] uppercase tracking-wider text-text-secondary/40 font-bold">Starting Price</div>
                                  <div className="text-xl font-black text-text-primary">{module.price}</div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigateToModule(module.slug);
                                    }}
                                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-xs font-bold text-text-primary hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer z-30"
                                  >
                                    Details
                                  </button>
                                  <a
                                    href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi, I am interested in details and pricing for the Tally module: ${module.title}`)}`}
                                    data-auth-gated="true"
                                    data-service-name={`Customization: ${module.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black text-xs font-black hover:brightness-110 hover:shadow-lg transition-all flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.2)] z-30"
                                  >
                                    Inquire
                                  </a>
                                </div>
                              </div>
                            </div>

                            {layoutMode === "stack" && isTopCard && (
                              <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest animate-pulse">Click other cards to cycle stack</span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>

                  {/* STACK PAGE INDICATORS */}
                  {layoutMode === "stack" && filteredItems.length > 1 && (
                    <div className="flex justify-center gap-1.5 mt-6 relative z-30">
                      {filteredItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${
                            index === activeIndex ? "w-6 bg-[#D4AF37]" : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                          aria-label={`Go to card ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* EMPTY STATE UI */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-12 text-center max-w-xl mx-auto my-12"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-text-secondary">
                    <Info className="w-8 h-8 opacity-60" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Customizations Found</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    We couldn't find any modules matching your current filter criteria. Try adjusting your search query, selecting "All Categories", or turning off compatibility chips.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* MARKETPLACE DETAIL VIEW */
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center gap-2 text-xs font-bold mb-8 text-text-secondary bg-white/5 border border-white/5 rounded-full px-4 py-2.5 w-fit">
                <a href="/" className="hover:text-text-primary transition-colors">Home</a>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <button onClick={() => navigateToModule(null)} className="hover:text-text-primary transition-colors cursor-pointer">Customizations</button>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <span className="text-[#D4AF37] max-w-[200px] sm:max-w-xs truncate">{activeModule.title}</span>
              </nav>

              {/* Back Button */}
              <button
                onClick={() => navigateToModule(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary mb-8 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace catalog
              </button>

              {/* MAIN DETAILS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* LEFT DETAIL COLUMN */}
                <div className="lg:col-span-8 space-y-10">
                  
                  {/* MODULE HEADER PANEL */}
                  <div className="glass-card p-6 sm:p-10 relative overflow-hidden shadow-xl">
                    <div className="flex flex-wrap gap-2 items-center mb-6">
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 uppercase">
                        {activeModule.category} Module
                      </span>
                      <span className="text-xs font-bold text-text-secondary bg-white/5 px-2.5 py-1 rounded">
                        {activeModule.industry} Industry
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {activeModule.compatibility.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-text-secondary bg-white/5 dark:bg-black/15 border border-white/5 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight mb-4">
                      {activeModule.title}
                    </h1>

                    <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6">
                      {activeModule.description}
                    </p>
                  </div>

                  {/* PROBLEMS SOLVED SECTION */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#D4AF37]" /> Pain Points Solved
                    </h2>
                    <ul className="space-y-4">
                      {activeModule.problemsSolved.map((prob, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-sm flex items-center justify-center shrink-0">
                            !
                          </div>
                          <p className="text-sm text-text-primary/90 leading-relaxed font-semibold">{prob}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KEY FEATURES LIST */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[#D4AF37]" /> Key Module Features
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeModule.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="text-sm text-text-primary font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WORKFLOW DIAGRAM */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <Settings className="w-5 h-5 text-[#D4AF37]" /> Process Workflow Diagram
                    </h2>
                    <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8 py-2">
                      {activeModule.workflow.map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Step number badge */}
                          <div className="absolute -left-[41px] sm:-left-[49px] top-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border-2 border-accent-blue flex items-center justify-center text-xs sm:text-sm font-bold text-text-primary shadow-md">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm text-text-primary font-bold mb-1">Step {idx + 1}</p>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE BENEFITS */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#D4AF37]" /> Business Benefits
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {activeModule.benefits.map((benefit, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex gap-4">
                          <CheckCircle2 className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-text-primary mb-1">Outcome {idx + 1}</h4>
                            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{benefit}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQS ACCORDION */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-[#D4AF37]" /> Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {activeModule.faq.map((item, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white/5 border border-white/5">
                          <h4 className="text-sm sm:text-base font-bold text-text-primary mb-2 flex items-start gap-2.5">
                            <span className="text-[#D4AF37] font-black text-base leading-none">Q.</span>
                            <span>{item.q}</span>
                          </h4>
                          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-5 border-l border-[#D4AF37]/30">
                            {item.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT DETAIL COLUMN (PRICING, ACTIONS, INFO) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                  
                  {/* PRICING CARD */}
                  <div className="glass-card p-6 sm:p-8 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden text-center flex flex-col justify-center items-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"></div>
                    
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-2">Module Cost</span>
                    <div className="text-xs text-text-secondary/50 font-bold mb-1">Starting Price</div>
                    <div className="text-4xl sm:text-5xl font-black text-text-primary mb-6">{activeModule.price}</div>
                    
                    <div className="h-px bg-white/10 w-full mb-6" />

                    <div className="space-y-3.5 w-full">
                      <a
                        href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi Harsh Infotech team, I want to inquire about purchasing: ${activeModule.title}`)}`}
                        data-auth-gated="true"
                        data-service-name={`Inquire Customization: ${activeModule.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black text-lg hover:brightness-110 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      >
                        <img src="/Whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                        Inquire on WhatsApp
                      </a>

                      <a
                        href="tel:+917558604483"
                        className="w-full py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-text-primary font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" /> Call Sales Representative
                      </a>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 text-left w-full text-xs text-text-secondary">
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent-blue" /> Genuine Tally Prime Customization</div>
                      <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-accent-blue" /> Lifetime Module Updates & Support</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-blue" /> Expert Installation Assistance Included</div>
                    </div>
                  </div>

                  {/* SPECIFICATION CARD */}
                  <div className="glass-card p-6 shadow-lg space-y-4">
                    <h3 className="font-bold text-text-primary text-sm uppercase tracking-wider border-b border-white/10 pb-2">Technical Specifications</h3>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between"><span className="text-text-secondary">Industry target:</span><span className="font-bold text-text-primary">{activeModule.industry}</span></div>
                      <div className="flex justify-between"><span className="text-text-secondary">TDL Category:</span><span className="font-bold text-text-primary">{activeModule.category}</span></div>
                      <div className="flex justify-between"><span className="text-text-secondary">Tax Compatibility:</span><span className="font-bold text-text-primary">GST ready</span></div>
                      <div className="flex justify-between"><span className="text-text-secondary">Framework:</span><span className="font-bold text-text-primary">Tally Definition Language</span></div>
                      <div className="flex justify-between"><span className="text-text-secondary">Version updates:</span><span className="font-bold text-text-primary">Lifetime Free updates</span></div>
                    </div>
                  </div>

                </div>

              </div>

              {/* RECOMMENDED CUSTOMIZATIONS */}
              <section className="mt-20">
                <div className="h-px bg-white/10 mb-12" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-8 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="w-6 h-6 text-[#D4AF37]" /> Recommended Customizations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedModules.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => navigateToModule(rec.slug)}
                      className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex gap-2 items-center mb-3">
                          <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">{rec.category}</span>
                          <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded">{rec.industry}</span>
                        </div>
                        <h3 className="font-bold text-text-primary group-hover:text-[#D4AF37] transition-colors leading-tight mb-2 text-base">
                          {rec.title}
                        </h3>
                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 border-t border-white/5 pt-4">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-text-secondary/40 font-bold">Price</div>
                          <div className="text-base font-black text-text-primary">{rec.price}</div>
                        </div>
                        <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                          View details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </motion.div>
          )}
        </AnimatePresence>

        {/* BOTTOM CALL TO ACTION SECTION */}
        <section className="mt-20 sm:mt-24 p-8 sm:p-12 lg:p-16 glass-card text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-transparent opacity-0 dark:opacity-100"></div>
          <div className="max-w-2xl mx-auto z-10 relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight mb-4">
              Need a Custom TDL Built?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8">
              Every business functions uniquely. If you have custom billing logic, proprietary reports, or third-party CRM APIs that need direct Tally integration, our development team is ready to assist.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://wa.me/917558604483?text=Hi%20Harsh%20Infotech,%20I%20need%20a%20completely%20custom%20Tally%20TDL%20customization%20built%20for%20my%20business."
                data-auth-gated="true"
                data-service-name="Custom TDL development inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black font-black text-base hover:brightness-110 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                <img src="/Whatsapp.png" alt="WhatsApp" className="w-5 h-5 object-contain" />
                Discuss Custom Requirements
              </a>
              <a
                href="tel:+917558604483"
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-text-primary font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
