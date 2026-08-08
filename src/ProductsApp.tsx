import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Background, Navbar, Footer } from "./Shared";
import { 
  CheckCircle2, Server, Monitor, Printer, Scan, 
  ArrowRight, Search, ChevronRight, ArrowLeft, FileDown, 
  Sparkles, RefreshCw, ChevronDown, Info, Phone, Shield
} from "lucide-react";
import productsDataRaw from "./data/products.json";

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: string;
  specifications: string[];
  image: string;
  documentUrl?: string;
  relatedItems?: string[];
  seoTitle?: string;
  seoDescription?: string;
  priority?: number;
  tags?: string[];
  hasCustomImage?: boolean;
}

const productsData = productsDataRaw as Product[];

// Helper to resolve product category icons
const getProductIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('server')) return <Server className="w-10 h-10 text-[#D4AF37] shrink-0" />;
  if (cat.includes('workstation') || cat.includes('computer')) return <Monitor className="w-10 h-10 text-[#D4AF37] shrink-0" />;
  if (cat.includes('print')) return <Printer className="w-10 h-10 text-[#D4AF37] shrink-0" />;
  if (cat.includes('scan')) return <Scan className="w-10 h-10 text-[#D4AF37] shrink-0" />;
  return <Server className="w-10 h-10 text-[#D4AF37] shrink-0" />;
};

export default function ProductsApp() {
  const [activeSlug, setActiveSlug] = useState<string | null>(() => {
    if (typeof window !== "undefined" && (window as any).__ACTIVE_SLUG__) {
      return (window as any).__ACTIVE_SLUG__;
    }
    const params = new URLSearchParams(window.location.search);
    return params.get("product");
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedSort, setSelectedSort] = useState("priority");
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync browser history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setActiveSlug(params.get("product"));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToProduct = (slug: string | null) => {
    setActiveSlug(slug);
    const newUrl = slug 
      ? `${window.location.pathname}?product=${slug}` 
      : window.location.pathname;
    window.history.pushState({ slug }, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SEO Metatags & Title
  useEffect(() => {
    if (activeSlug) {
      const activeProd = productsData.find(p => p.slug === activeSlug);
      if (activeProd) {
        document.title = activeProd.seoTitle || `${activeProd.title} - Hardware Products | Harsh Infotech`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute("content", activeProd.seoDescription || activeProd.description);
        }
      }
    } else {
      document.title = "Enterprise Hardware Products & IT Infrastructure - Harsh Infotech";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "Procure premium enterprise servers, professional workstations, network laser printers, and ADF scanners from HP, Dell, Canon, and Epson.");
      }
    }
  }, [activeSlug]);

  // Scrolling to hash when catalog is visible
  useEffect(() => {
    if (!activeSlug) {
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash) {
          setTimeout(() => {
            const targetId = hash.replace('#', '');
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }, 150);
        }
      };
      // Run once on mount / status transition
      handleHashChange();
      window.addEventListener("hashchange", handleHashChange);
      return () => window.removeEventListener("hashchange", handleHashChange);
    }
  }, [activeSlug]);

  // Derived filter options
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(productsData.map(p => p.category)))];
  }, []);

  const brands = useMemo(() => {
    return ["All", ...Array.from(new Set(productsData.map(p => p.brand)))];
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return productsData
      .filter(p => {
        const matchesSearch = searchQuery.trim() === "" ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesBrand = selectedBrand === "All" || p.brand.toLowerCase().includes(selectedBrand.toLowerCase());

        return matchesSearch && matchesCategory && matchesBrand;
      })
      .sort((a, b) => {
        if (selectedSort === "priority") {
          return (b.priority || 0) - (a.priority || 0);
        }
        if (selectedSort === "a-z") {
          return a.title.localeCompare(b.title);
        }
        if (selectedSort === "z-a") {
          return b.title.localeCompare(a.title);
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, selectedBrand, selectedSort]);

  const activeProduct = useMemo(() => {
    if (!activeSlug) return null;
    return productsData.find(p => p.slug === activeSlug) || null;
  }, [activeSlug]);

  const recommendedProducts = useMemo(() => {
    if (!activeProduct) return [];
    
    // Explicit recommended matches
    if (activeProduct.relatedItems && activeProduct.relatedItems.length > 0) {
      return productsData
        .filter(p => p.id !== activeProduct.id && activeProduct.relatedItems!.includes(p.slug))
        .slice(0, 3);
    }
    
    // Smart Defaults
    const primary = productsData.filter(p => 
      p.id !== activeProduct.id && 
      (p.category === activeProduct.category || p.brand === activeProduct.brand)
    );
    const ids = new Set(primary.map(p => p.id));
    const backup = productsData.filter(p => p.id !== activeProduct.id && !ids.has(p.id));
    return [...primary, ...backup].slice(0, 3);
  }, [activeProduct]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedSort("priority");
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />

      <main className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeProduct ? (
            /* PRODUCTS CATALOG LISTING */
            <motion.div
              key="catalog"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* HERO */}
              <section className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider mb-6 text-[#D4AF37]">
                  <Sparkles className="w-3.5 h-3.5" /> Hardware marketplace
                </div>
                <h1 className="text-[clamp(2.25rem,6vw+1rem,4rem)] font-extrabold tracking-tighter leading-none mb-6">
                  Computing <span className="text-white/40">Products</span>
                </h1>
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                  Premium physical computing infrastructure built by the world's most reliable brands. Procure and configure business servers, workstations, scanners, and high-volume billing printers.
                </p>
              </section>

              {/* SEARCH & FILTERS */}
              <section className="glass-card p-6 mb-10 z-30 relative shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Search Bar */}
                  <div className="lg:col-span-6 relative">
                    <div className="glass-search-container relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-60 z-10" />
                      <input
                        type="text"
                        placeholder="Search models, brands, specs, or tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-search-input pl-12 pr-4 py-3.5"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none glass-select px-4 py-3.5 pr-10 text-sm"
                      >
                        <option value="All" className="bg-[#0A1931] text-white">All Categories</option>
                        {categories.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat} className="bg-[#0A1931] text-white">{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-60 pointer-events-none" />
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div className="lg:col-span-3">
                    <div className="relative">
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full appearance-none glass-select px-4 py-3.5 pr-10 text-sm"
                      >
                        <option value="All" className="bg-[#0A1931] text-white">All Brands</option>
                        {brands.filter(b => b !== "All").map(brd => (
                          <option key={brd} value={brd} className="bg-[#0A1931] text-white">{brd}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-60 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-4" />

                <div className="flex flex-row justify-between items-center">
                  <div className="text-xs text-text-secondary font-semibold">
                    Showing {filteredProducts.length} hardware products
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative w-44">
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="w-full appearance-none glass-select px-3.5 py-2.5 pr-10 text-xs"
                      >
                        <option value="priority" className="bg-[#0A1931] text-white">Sort: Priority</option>
                        <option value="a-z" className="bg-[#0A1931] text-white">Sort: A-Z</option>
                        <option value="z-a" className="bg-[#0A1931] text-white">Sort: Z-A</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary opacity-60 pointer-events-none" />
                    </div>
                    {(searchQuery || selectedCategory !== "All" || selectedBrand !== "All") && (
                      <button
                        onClick={resetFilters}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all cursor-pointer"
                        title="Clear Filters"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* PRODUCTS GRID */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((prod) => (
                    <motion.div
                      id={prod.slug}
                      key={prod.id}
                      whileHover={{ y: -8, scale: 1.04, boxShadow: "var(--glass-shadow-hover), 0 0 25px rgba(212, 175, 55, 0.15)" }}
                      style={{
                        transition: "border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        backgroundImage: prod.hasCustomImage ? `linear-gradient(to bottom, rgba(5, 12, 28, 0.4) 0%, rgba(5, 12, 28, 0.95) 90%), url(${prod.image})` : undefined,
                        backgroundSize: prod.hasCustomImage ? 'cover' : undefined,
                        backgroundPosition: prod.hasCustomImage ? 'center' : undefined,
                      }}
                      className="glass-card p-8 flex flex-col justify-between group h-full cursor-pointer relative overflow-hidden"
                      onClick={() => navigateToProduct(prod.slug)}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                            {getProductIcon(prod.category)}
                          </div>
                          <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 uppercase">
                            {prod.brand}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-text-primary group-hover:text-[#D4AF37] transition-colors leading-tight mb-3">
                          {prod.title}
                        </h3>

                        <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                          {prod.description}
                        </p>

                        <div className="mb-6">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/50 mb-2">Specifications Preview</div>
                          <ul className="space-y-1.5">
                            {prod.specifications.slice(0, 2).map((spec, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-text-primary/90 leading-tight">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto border-t border-white/5 pt-4">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-text-secondary/40 font-bold">Estimated Cost</div>
                          <div className="text-lg font-black text-text-primary">{prod.price || 'Contact for Quote'}</div>
                        </div>

                        <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                          Specs & Quote <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* EMPTY STATE */
                <div className="glass-card p-12 text-center max-w-xl mx-auto my-12">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-text-secondary">
                    <Info className="w-8 h-8 opacity-60" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">No Products Found</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    No models matched your search query. Adjust category filters or reset queries.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-all cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* PRODUCT DETAIL VIEW */
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 text-xs font-bold mb-8 text-text-secondary bg-white/5 border border-white/5 rounded-full px-4 py-2.5 w-fit">
                <a href="/" className="hover:text-text-primary transition-colors">Home</a>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <button onClick={() => navigateToProduct(null)} className="hover:text-text-primary transition-colors cursor-pointer">Products</button>
                <ChevronRight className="w-3 h-3 opacity-60" />
                <span className="text-[#D4AF37] max-w-[200px] truncate">{activeProduct.title}</span>
              </nav>

              <button
                onClick={() => navigateToProduct(null)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-text-primary mb-8 group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Products Catalog
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT DETAIL COLUMN */}
                <div className="lg:col-span-8 space-y-10">
                  {/* HEADER PANEL */}
                  <div className="glass-card p-6 sm:p-10 relative overflow-hidden shadow-xl">
                    <div className="flex flex-wrap gap-2 items-center mb-6">
                      <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded border border-[#D4AF37]/20 uppercase">
                        {activeProduct.brand} Partner
                      </span>
                      <span className="text-xs font-bold text-text-secondary bg-white/5 px-2.5 py-1 rounded">
                        {activeProduct.category} Category
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight mb-4">
                      {activeProduct.title}
                    </h1>

                    <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                      {activeProduct.description}
                    </p>
                  </div>

                  {/* SPECIFICATIONS */}
                  <div className="glass-card p-6 sm:p-10 shadow-lg">
                    <h2 className="text-xl sm:text-2xl font-bold mb-6 text-text-primary flex items-center gap-2">
                      <Info className="w-5 h-5 text-[#D4AF37]" /> Technical Specifications
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activeProduct.specifications.map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="text-sm text-text-primary font-medium">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (ACTIONS/CTA) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
                  <div className="glass-card p-6 sm:p-8 border-[#D4AF37]/30 shadow-2xl relative overflow-hidden text-center flex flex-col justify-center items-center">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"></div>
                    
                    <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-2">Estimated Cost</span>
                    <div className="text-3xl sm:text-4xl font-black text-text-primary mb-6">{activeProduct.price || 'Get Quote'}</div>
                    
                    <div className="h-px bg-white/10 w-full mb-6" />

                    <div className="space-y-3.5 w-full">
                      <a
                        href={`https://wa.me/917558604483?text=${encodeURIComponent(`Hi, I am interested in details and quote for: ${activeProduct.brand} ${activeProduct.title}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-auth-gated="true"
                        data-auth-action="whatsapp"
                        data-service-name={`${activeProduct.brand} ${activeProduct.title}`}
                        data-message={`Hi, I am interested in details and quote for: ${activeProduct.brand} ${activeProduct.title}`}
                        className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black text-base hover:brightness-110 shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Request Quote on WhatsApp
                      </a>

                      <a
                        href="tel:+917558604483"
                        className="w-full py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-text-primary font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Phone className="w-4 h-4" /> Call Representative
                      </a>

                      {activeProduct.documentUrl && (
                        <a
                          href={activeProduct.documentUrl}
                          download
                          className="w-full py-4 rounded-full bg-white/10 border border-white/20 hover:border-white/30 text-text-primary font-bold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <FileDown className="w-4 h-4" /> Download Datasheet
                        </a>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 text-left w-full text-xs text-text-secondary">
                      <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-accent-blue" /> Partner brand certified hardware</div>
                      <div className="flex items-center gap-2"><RefreshCw className="w-4 h-4 text-accent-blue" /> Full replacement warranties</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-blue" /> Professional workstation setup</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECOMMENDED PRODUCTS */}
              {recommendedProducts.length > 0 && (
                <section className="mt-20">
                  <div className="h-px bg-white/10 mb-12" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-8 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
                    <Sparkles className="w-6 h-6 text-[#D4AF37]" /> Recommended Models
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedProducts.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => navigateToProduct(rec.slug)}
                        className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex gap-2 items-center mb-3">
                            <span className="text-[9px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">{rec.brand}</span>
                            <span className="text-[9px] font-bold text-text-secondary bg-white/5 px-2 py-0.5 rounded">{rec.category}</span>
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
                            <div className="text-[9px] uppercase tracking-wider text-text-secondary/40 font-bold">Estimated Cost</div>
                            <div className="text-sm font-black text-text-primary">{rec.price || 'Contact for price'}</div>
                          </div>
                          <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1.5 transition-transform flex items-center gap-1">
                            Specs <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
