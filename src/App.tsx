import { motion } from "motion/react";
import { ChevronDown, Cpu, Globe, Zap, Users, Mail, Phone, MapPin, Github, Twitter, Linkedin, Server, Monitor, Printer, Scan, Database, Shield } from "lucide-react";
import { useState, useEffect } from "react";

import { Background, Navbar, Footer, Logo } from "./Shared";
import { Testimonials } from "./Testimonials";
import { useAuth } from "./Auth";

const Hero = () => {
  const { isAuthenticated, openAuthGate } = useAuth();
  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 text-center lg:flex-row lg:text-left lg:px-20 max-w-7xl mx-auto gap-12 lg:gap-16">
      <div className="flex-1 z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tighter leading-tight break-words mb-8"
        >
          <span className="block whitespace-nowrap">Reliably Great</span>
          <span className="block text-white/40 whitespace-nowrap">Efficiently Fast</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-xl mb-10 mx-auto lg:mx-0"
        >
          <strong className="block text-white mb-4">Complete Tally Solutions for Modern Businesses</strong>
          We help businesses simplify accounting, automate workflows, and scale operations with powerful Tally solutions.
        </motion.p>

        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isAuthenticated) {
              document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
            } else {
              openAuthGate(() => {
                document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
              });
            }
          }}
          className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_24px_rgba(255,255,255,0.15)] hover:shadow-[0_0_32px_rgba(255,255,255,0.25)] hover:bg-white/90 transition-all duration-200"
        >
          Get Started
        </motion.button>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 text-sm font-medium text-white/40"
        >
          Trusted by 100+ businesses across India
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex-1 flex justify-center lg:justify-center mt-8 lg:mt-0"
      >
        <div className="relative flex items-center justify-center w-[240px] md:w-[360px] lg:w-[460px] xl:w-[520px]">
          {/* Soft gold glow behind logo */}
          <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-[60px] animate-pulse scale-110" />
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl scale-90" />
          <Logo 
            className="relative z-10 w-full" 
            imgClassName="w-full h-auto object-contain filter drop-shadow-[0_0_48px_rgba(212,175,55,0.35)]" 
            withText={false} 
          />
        </div>
      </motion.div>
    </section>
  );
};

const Services = () => {
  const { openAuthGate, isAuthenticated } = useAuth();

  const services = [
    { icon: <Zap />, title: "Tally Prime License", desc: "Get genuine Tally licenses (Single & Multi User) with complete setup and guidance.", link: "/services.html#tally-license" },
    { icon: <Globe />, title: "Tally on Cloud", desc: "Access your business data anytime, anywhere with secure and reliable cloud solutions.", link: "/services.html#tally-cloud", hasCTA: true },
    { icon: <Cpu />, title: "Tally Customization", desc: "Customize Tally according to your business workflow using advanced TDL solutions.", link: "/services.html#tally-customization" },
  ];

  return (
    <section id="services" className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
        <p className="text-white/50 max-w-2xl mx-auto">We provide complete Tally solutions to help businesses streamline operations and improve efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <motion.a 
            href={s.link}
            data-auth-gated="true"
            data-service-name={s.title}
            key={i}
            whileHover={{ y: -10 }}
            className="block p-10 glass-card group flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-colors">
              {s.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
            <p className="text-white/50 leading-relaxed max-w-sm">{s.desc}</p>
            
            {s.hasCTA && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isAuthenticated) {
                    window.location.hash = "contact";
                    return;
                  }
                  openAuthGate(() => {
                    window.location.hash = "contact";
                  });
                }}
                className="mt-6 inline-flex h-10 w-full md:w-auto items-center justify-center rounded-xl border border-white/20 bg-gradient-to-b from-white/10 to-transparent px-8 text-sm font-medium text-white shadow-[0_4px_14px_0_rgb(255,255,255,10%)] hover:from-white/20 hover:to-white/5 transition-all relative group/btn overflow-hidden z-[20]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-[200%] transition-transform duration-1000 ease-out z-[10]"></div>
                <span className="relative z-10 text-[#D4AF37]">Start Free Trial</span>
              </div>
            )}
            
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const MoreSolutions = () => {
  const solutions = [
    { icon: <Globe />, title: "VPS (Virtual Private Server)", id: "vps", desc: "High-performance cloud servers for running business applications securely and efficiently." },
    { icon: <Cpu />, title: "Tally AMC & Support", id: "amc", desc: "Reliable annual maintenance and support for smooth business operations." },
    { icon: <Zap />, title: "Excel to Tally Integration", id: "excel", desc: "Seamlessly import and manage your Excel data into Tally." },
    { icon: <Users />, title: "Data Migration & Setup", id: "data", desc: "Secure transfer and setup of your existing business data." },
    { icon: <Phone />, title: "Hardware & System Support", id: "hardware", desc: "Complete assistance for business systems and IT infrastructure." },
  ];

  return (
    <section className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">More Solutions</h2>
        <p className="text-white/50 max-w-2xl mx-auto">Explore our extended range of professional services and infrastructure support.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
        {solutions.map((s, i) => (
          <motion.a 
            href={`/more-services.html#${s.id}`}
            data-auth-gated="true"
            data-service-name={s.title}
            key={i}
            whileHover={{ y: -10 }}
            className="block w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(33.333%-1.333rem)] p-6 lg:p-10 glass-card group"
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 lg:mb-8 group-hover:bg-white group-hover:text-black transition-colors">
              {s.icon}
            </div>
            <h3 className="text-lg lg:text-2xl font-bold mb-3 lg:mb-4 leading-tight">{s.title}</h3>
            <p className="text-sm lg:text-base text-white/50 leading-relaxed">{s.desc}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const OurProducts = () => {
  const products = [
    { icon: <Server />, title: "Servers", id: "servers", desc: "Reliable and high-performance servers for business operations." },
    { icon: <Monitor />, title: "Workstations", id: "workstations", desc: "Powerful systems designed for professional and industrial use." },
    { icon: <Printer />, title: "Printers", id: "printers", desc: "Efficient printing solutions for daily business needs." },
    { icon: <Scan />, title: "Scanners", id: "scanners", desc: "High-speed document scanning for organized workflow." },
  ];

  return (
    <section id="products" className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h2>
        <p className="text-white/50 max-w-2xl mx-auto">From HP and Dell, we provide all essential hardware solutions required for modern workplaces.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
        {products.map((p, i) => (
          <motion.a 
            href={`/products.html#${p.id}`}
            data-auth-gated="true"
            data-service-name={p.title}
            key={i}
            whileHover={{ y: -10 }}
            className="block w-[calc(50%-0.5rem)] md:w-[calc(50%-0.75rem)] lg:w-[calc(50%-1rem)] p-6 lg:p-10 glass-card group flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 lg:mb-8 group-hover:bg-white group-hover:text-black transition-colors">
              {p.icon}
            </div>
            <h3 className="text-lg lg:text-2xl font-bold mb-3 lg:mb-4 leading-tight">{p.title}</h3>
            <p className="text-sm lg:text-base text-white/50 leading-relaxed">{p.desc}</p>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

const About = () => {
  const features = [
    {
      icon: <Database className="w-5 h-5 text-[#D4AF37]" />,
      title: "Tally Expertise",
      desc: "Complete support for Tally Prime, customization, and integrations tailored to your business workflow.",
    },
    {
      icon: <Zap className="w-5 h-5 text-[#D4AF37]" />,
      title: "Fast Implementation",
      desc: "Quick setup and deployment with minimal downtime so your business runs smoothly.",
    },
    {
      icon: <Shield className="w-5 h-5 text-[#D4AF37]" />,
      title: "Reliable Support",
      desc: "Ongoing AMC support with quick issue resolution and expert guidance.",
    },
  ];

  return (
    <section id="about" className="py-32 px-6 lg:px-20 bg-white/5 relative overflow-visible">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

        {/* Left: Text content */}
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Why Businesses Choose{" "}
            <span className="text-[#D4AF37]">Harsh Infotech</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-xl">
            We deliver reliable Tally solutions designed to simplify operations, improve accuracy, and scale your business efficiently.
          </p>
          <div className="space-y-7">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-5">
                <div
                  className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shrink-0"
                  style={{ boxShadow: "0 0 18px rgba(212,175,55,0.14)" }}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{f.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image + floating stat card */}
        <div className="relative pb-10 md:pb-0">
          <div
            className="aspect-square rounded-3xl overflow-hidden border border-[#D4AF37]/15 relative"
            style={{ boxShadow: "0 0 60px rgba(212,175,55,0.06), 0 0 0 1px rgba(212,175,55,0.05)" }}
          >
            <img
              src="/about-workspace.png"
              alt="Professional Office Workspace"
              className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Subtle gold tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/8 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Floating stat card — desktop: overlaps bottom-right of image */}
          <div className="absolute -bottom-6 -right-4 glass-card px-7 py-5 hidden md:block" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(212,175,55,0.08)" }}>
            <p className="text-4xl font-black text-[#D4AF37]">100+</p>
            <p className="text-sm font-bold text-white/60 uppercase tracking-widest mt-1">Businesses Served</p>
          </div>

          {/* Floating stat card — mobile: centered below image */}
          <div className="mt-6 w-fit mx-auto glass-card px-7 py-5 text-center md:hidden">
            <p className="text-4xl font-black text-[#D4AF37]">100+</p>
            <p className="text-sm font-bold text-white/60 uppercase tracking-widest mt-1">Businesses Served</p>
          </div>
        </div>

      </div>
    </section>
  );
};


export default function App() {
  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <MoreSolutions />
        <OurProducts />
        <About />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
