import { ChevronDown, Cpu, Mail, Phone, MapPin, Github, Twitter, Linkedin, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./Auth";

export const Logo = ({
  className = "flex items-center gap-3",
  imgClassName = "h-[45px] w-auto",
  withText = true,
  textClassName = "text-[18px] md:text-[22px] font-bold tracking-tight leading-tight",
  twoLineOnMobile = false,
  alwaysTwoLine = false,
}: {
  className?: string;
  imgClassName?: string;
  withText?: boolean;
  textClassName?: string;
  twoLineOnMobile?: boolean;
  alwaysTwoLine?: boolean;
}) => (
  <div className={className}>
    <img 
      src="/assets/logo.png" 
      alt="Harsh Infotech Logo" 
      className={`object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.2)] transition-all duration-300 shrink-0 ${imgClassName}`}
      referrerPolicy="no-referrer"
    />
    {withText && (
      <div className={`${textClassName} flex flex-col justify-center`}>
        {alwaysTwoLine ? (
          <>
            <span className="block">Harsh Infotech</span>
            <span className="block">Consultancy Services</span>
          </>
        ) : twoLineOnMobile ? (
          <>
            <span className="xl:hidden flex flex-col">
              <span>Harsh Infotech</span>
              <span>Consultancy Services</span>
            </span>
            <span className="hidden xl:block whitespace-nowrap">
              Harsh Infotech Consultancy Services
            </span>
          </>
        ) : (
          <span>Harsh Infotech Consultancy Services</span>
        )}
      </div>
    )}
  </div>
);

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg-primary transition-colors duration-500">
      {/* Light mode gradient image background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 opacity-100 dark:opacity-0"
        style={{ backgroundImage: "url('/light-bg.png')" }}
      />

      {/* Dark mode gradient image background (supplied image) */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 opacity-0 dark:opacity-100"
        style={{ backgroundImage: "url('/dark-bg.png')" }}
      />
      
      {/* Very light dark overlay for readability in dark mode */}
      <div className="hidden dark:block absolute inset-0 bg-[#0A1428]/15 pointer-events-none" />
    </div>
  );
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(newTheme);
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <div className="sky-toggle-wrapper flex items-center shrink-0">
      <label className="theme-switch inline-block relative cursor-pointer">
        <input 
          type="checkbox" 
          className="theme-switch__checkbox" 
          checked={theme === "dark"} 
          onChange={toggleTheme} 
        />
        <div className="theme-switch__container">
          <div className="theme-switch__clouds" />
          <div className="theme-switch__stars-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.0069 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor" />
            </svg>
          </div>
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export const Navbar = () => {
  const { openAuthGate } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const pathname = window.location.pathname;
  
  useEffect(() => {
    if (pathname !== "/" && pathname !== "/index.html") return;

    const sections = ["home", "services", "products", "about"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { threshold: 0.3 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  let topCtaText = "About Us";
  let topCtaLink = "/about.html";
  
  if (pathname === "/" || pathname === "/index.html") {
    switch (activeSection) {
      case "home":
        topCtaText = "Our Services";
        topCtaLink = "#services";
        break;
      case "services":
        topCtaText = "Our Products";
        topCtaLink = "#products";
        break;
      case "products":
        topCtaText = "About";
        topCtaLink = "#about";
        break;
      case "about":
        topCtaText = "Contact";
        topCtaLink = "#contact";
        break;
      default:
        topCtaText = "Our Services";
        topCtaLink = "#services";
    }
  } else if (pathname.includes("services.html")) {
    topCtaText = "More Services";
    topCtaLink = "/more-services.html";
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-12 lg:py-4 xl:px-20 xl:py-5 z-50 transition-transform duration-300 ease-in-out bg-glass border-b border-[var(--glass-border)] shadow-[var(--glass-shadow)] ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-4">
          <a href="/" className="hover:opacity-90 transition-opacity">
            <Logo 
              className="flex items-center gap-4 md:gap-5"
              imgClassName="h-[50px] sm:h-[60px] lg:h-[65px] xl:h-[75px] w-auto" 
              textClassName="text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[20px] font-bold tracking-tight leading-tight text-left" 
              twoLineOnMobile={true}
            />
          </a>
        </div>

        <div className="hidden xl:flex items-center gap-5 xl:gap-8 z-[120] ml-16 xl:ml-24">
          <a href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</a>
          
          <div className="group relative">
            <a href="/services.html" className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-4">
              Services <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute top-[85%] left-0 w-60 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 overflow-hidden z-[150]">
              <div className="flex flex-col py-2">
                <a href="/services.html#tally-license" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally Prime</a>
                <a href="/services.html#tally-cloud" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally on Cloud</a>
                <a href="/services.html#tally-customization" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally Customization</a>
                <a href="/more-services.html#amc" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">AMC & Support</a>
                <a href="/customizations.html" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Customizations</a>
                
                <div className="h-px bg-white/10 my-2 mx-4" />
                
                <a href="/more-services.html#vps" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">VPS</a>
                <a href="/more-services.html#excel" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Excel to Tally</a>
                <a href="/more-services.html#data" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Data Migration</a>
                <a href="/more-services.html#hardware" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Hardware Support</a>
              </div>
            </div>
          </div>
          <div className="group relative">
            <a href="/products.html" className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-4">
              Products <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute top-[85%] left-0 w-48 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 overflow-hidden z-[150]">
              <div className="flex flex-col py-2">
                <a href="/products.html#servers" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Servers</a>
                <a href="/products.html#workstations" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Workstations</a>
                <a href="/products.html#printers" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Printers</a>
                <a href="/products.html#scanners" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Scanners</a>
              </div>
            </div>
          </div>

          <a href="/about.html" className="text-sm font-medium text-white/70 hover:text-white transition-colors">About</a>
          <a href="#contact" data-auth-gated="true" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 xl:pl-8 xl:border-l xl:border-[var(--glass-border)] xl:ml-8">
          <ThemeToggle />
          
          <a href={topCtaLink} data-auth-gated="true" className="hidden xl:block px-4 py-2 xl:px-6 xl:py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-xs xl:text-sm font-semibold shrink-0">
            {topCtaText}
          </a>
          <button
            type="button"
            onClick={() => openAuthGate()}
            className="hidden xl:block px-4 py-2 xl:px-6 xl:py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-xs xl:text-sm font-semibold shrink-0 cursor-pointer"
          >
            Sign Up
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            className="xl:hidden p-2 text-white/80 hover:text-white transition-colors z-[110]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8 relative z-[110]" /> : <Menu className="w-8 h-8 relative z-[110]" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[85%] max-w-sm h-full bg-[#050505] shadow-2xl shadow-black border-l border-white/10 p-10 flex flex-col justify-center"
            >
              <nav className="flex flex-col gap-6 text-center text-xl font-bold">
                <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1">Home</a>
                <a href="/services.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1">Services</a>
                <a href="/customizations.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1 text-[#D4AF37]">Customizations</a>
                <a href="/products.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1">Products</a>
                <a href="/about.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1">About</a>
                <a href="#contact" data-auth-gated="true" onClick={() => { setIsMobileMenuOpen(false); }} className="hover:text-[#D4AF37] transition-colors py-1">Contact</a>
                
                <div className="h-px bg-white/10 my-4" />
                
                <a 
                  href={topCtaLink} 
                  data-auth-gated="true" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black text-base font-semibold text-center transition-all"
                >
                  {topCtaText}
                </a>
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); openAuthGate(); }}
                  className="px-6 py-3 rounded-full bg-gradient-to-b from-[#fff5dd] to-[#f5e8c0] text-black text-base font-bold text-center transition-all cursor-pointer"
                >
                  Sign Up
                </button>

                <div className="h-px bg-white/10 my-4" />

                <div className="flex gap-4 justify-center items-center mt-2">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] transition-all group border border-white/5 hover:border-[#D4AF37]/50">
                    <img src="/Facebook.png" alt="Facebook" className="w-5 h-5 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] transition-all group border border-white/5 hover:border-[#D4AF37]/50">
                    <img src="/Instagram.png" alt="Instagram" className="w-5 h-5 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Linkedin className="w-5 h-5" /></a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible placeholder height equal to fixed header to prevent layout jump */}
      <div className="h-[75px] sm:h-[82px] xl:h-[116px] w-full invisible pointer-events-none"></div>
    </>
  );
};

export const Footer = () => {
  return (
    <footer id="contact" className="pt-32 pb-10 px-6 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 lg:col-span-1">
          <div className="mb-6">
            <Logo 
              className="flex items-center gap-4 lg:gap-5"
              imgClassName="h-[64px] md:h-[72px] lg:h-[80px] w-auto object-contain" 
              textClassName="text-[20px] md:text-[22px] font-bold leading-tight text-left" 
              alwaysTwoLine={true}
            />
          </div>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            Building the future of digital infrastructure. Premium solutions for ambitious companies.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] transition-all group border border-white/5 hover:border-[#D4AF37]/50">
              <img src="/Facebook.png" alt="Facebook" className="w-5 h-5 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D4AF37] transition-all group border border-white/5 hover:border-[#D4AF37]/50">
              <img src="/Instagram.png" alt="Instagram" className="w-5 h-5 object-contain filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Github className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/services.html" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="/about.html" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li>
              <a href="#" data-auth-gated="true" data-auth-action="email" data-email="harshinfotech2005@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer w-full text-white/40">
                <Mail className="w-4 h-4 shrink-0 transition-colors group-hover:text-white" />
                <span className="transition-colors group-hover:text-white">harshinfotech2005@gmail.com</span>
              </a>
            </li>
            <li className="flex flex-col gap-4">
              <a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="917558604483" className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer w-full text-white/40">
                <img src="/Whatsapp.png" alt="WhatsApp" className="w-4.5 h-4.5 shrink-0 object-contain filter brightness-75 group-hover:brightness-100 transition-all" />
                <span className="transition-colors group-hover:text-white">7558604483</span>
              </a>
              <a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="918828275219" className="flex items-center gap-3 hover:text-white transition-colors group cursor-pointer w-full text-white/40">
                <img src="/Whatsapp.png" alt="WhatsApp" className="w-4.5 h-4.5 shrink-0 object-contain opacity-0" />
                <span className="transition-colors group-hover:text-white">8828275219</span>
              </a>
            </li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 shrink-0" /> Mumbai, India</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Newsletter</h4>
          <p className="text-sm text-white/40 mb-4">Subscribe to our latest updates.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white/30 flex-1"
            />
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">Join</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 text-center text-xs text-white/20">
        © {new Date().getFullYear()} Harsh Infotech. All rights reserved.
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/917558604483"
        data-auth-gated="true"
        data-auth-action="whatsapp"
        data-phone="917558604483"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-[64px] h-[64px] md:w-[72px] md:h-[72px] lg:w-[80px] lg:h-[80px] rounded-full bg-[#0a0a0af0] backdrop-blur-md border-2 border-[#D4AF37]/60 text-[#D4AF37] hover:text-white hover:border-[#D4AF37] shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_35px_rgba(212,175,55,0.65)] transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer p-[1px] sm:p-[2px] md:p-[3px]"
      >
        <img 
          src="/Whatsapp.png" 
          alt="WhatsApp" 
          className="w-full h-full object-contain animate-pulse" 
        />
      </a>
    </footer>
  );
};
