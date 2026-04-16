import { ChevronDown, Cpu, Mail, Phone, MapPin, Github, Twitter, Linkedin, Menu, X } from "lucide-react";
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
            <span className="lg:hidden flex flex-col">
              <span>Harsh Infotech</span>
              <span>Consultancy Services</span>
            </span>
            <span className="hidden lg:block whitespace-nowrap">
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
  const [isVideoError, setIsVideoError] = useState(false);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Video Background */}
      {!isVideoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          onError={() => setIsVideoError(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      )}

      {/* Image Background (Fallback or Primary) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000"
        style={{ 
          backgroundImage: "url('/background.jpg')",
          display: isVideoError ? 'block' : 'none' 
        }}
      />

      {/* Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-[#050505]/60 to-[#050505]" />
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
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-5 md:px-12 lg:px-20 z-50 transition-transform duration-300 ease-in-out bg-[#050505]/95 backdrop-blur-md border-b border-white/5 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-4">
          <a href="/" className="hover:opacity-90 transition-opacity">
            <Logo 
              className="flex items-center gap-4 md:gap-5"
              imgClassName="h-[90px] md:h-[110px] lg:h-[100px] w-auto" 
              textClassName="text-[18px] md:text-[22px] font-bold tracking-tight leading-tight text-left" 
              twoLineOnMobile={true}
            />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-10 z-[120]">
          <a href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</a>
          
          <div className="group relative">
            <a href="/services.html" className="flex items-center gap-1 text-sm font-medium text-white/70 hover:text-white transition-colors py-4">
              Services <ChevronDown className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
            <div className="absolute top-[85%] left-0 w-60 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 overflow-hidden z-[150]">
              <div className="flex flex-col py-2">
                <a href="/services.html#tally-license" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally Prime License</a>
                <a href="/services.html#tally-cloud" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally on Cloud</a>
                <a href="/services.html#tally-customization" className="px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally Customization</a>
                
                <div className="h-px bg-white/10 my-2 mx-4" />
                
                <a href="/more-services.html#vps" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">VPS</a>
                <a href="/more-services.html#amc" className="px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">Tally AMC & Support</a>
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

        <div className="flex items-center gap-4">
          <a href={topCtaLink} data-auth-gated="true" className="hidden md:block px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-sm font-semibold shrink-0">
            {topCtaText}
          </a>
          <button
            type="button"
            onClick={() => openAuthGate()}
            className="hidden md:block px-6 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all text-sm font-semibold shrink-0 cursor-pointer"
          >
            Sign Up
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors z-[110]"
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
            className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-[85%] max-w-sm h-full bg-[#050505] shadow-2xl shadow-black border-l border-white/10 p-10 flex flex-col justify-center"
            >
              <nav className="flex flex-col gap-8 text-center text-2xl font-bold">
                <a href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Home</a>
                <a href="/services.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Services</a>
                <a href="/products.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">Products</a>
                <a href="/about.html" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors">About</a>
                <a href="#contact" data-auth-gated="true" onClick={() => { setIsMobileMenuOpen(false); }} className="hover:text-[#D4AF37] transition-colors">Contact</a>
                <button
                  type="button"
                  onClick={() => { setIsMobileMenuOpen(false); openAuthGate(); }}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Sign Up
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible placeholder height equal to fixed header to prevent layout jump */}
      <div className="h-[110px] md:h-[130px] w-full invisible pointer-events-none"></div>
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
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Github className="w-5 h-5" /></a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="/" className="hover:text-white transition-colors">Services</a></li>
            <li><a href="/about.html" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-white/40">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 shrink-0" />
              <a href="#" data-auth-gated="true" data-auth-action="email" data-email="harshinfotech2005@gmail.com" className="hover:text-white transition-colors">
                harshinfotech2005@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 shrink-0 mt-1" />
              <div>
                <div><a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="917558604483" className="hover:text-white transition-colors">7558604483</a></div>
                <div><a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="918828275219" className="hover:text-white transition-colors">8828275219</a></div>
              </div>
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
    </footer>
  );
};
