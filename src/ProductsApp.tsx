import { motion } from "motion/react";
import { useEffect } from "react";
import { Background, Navbar, Footer } from "./Shared";
import { CheckCircle2, Server, Monitor, Printer, Scan, ArrowRight } from "lucide-react";

export default function ProductsApp() {
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

  const products = [
    {
      id: "servers",
      title: "Enterprise Servers",
      desc: "Reliable and high-performance servers designed for non-stop business operations and data redundancy.",
      icon: <Server className="w-12 h-12 mb-6 text-[#D4AF37]" />,
      useCases: ["Database Hosting", "Web Applications", "File Systems", "Virtualization"],
      brands: "HP / Dell / Lenovo",
      cta: "Request Quote"
    },
    {
      id: "workstations",
      title: "Professional Workstations",
      desc: "Powerful desktop systems designed for heavy professional workloads, industrial use, and secure workflows.",
      icon: <Monitor className="w-12 h-12 mb-6 text-[#D4AF37]" />,
      useCases: ["Heavy Data Parsing", "Tally ERP Native", "Software Dev", "Engineering"],
      brands: "HP / Dell / Custom Builds",
      cta: "View Models"
    },
    {
      id: "printers",
      title: "Commercial Printers",
      desc: "Efficient high-volume printing solutions tailored for daily business accounting and invoicing needs.",
      icon: <Printer className="w-12 h-12 mb-6 text-[#D4AF37]" />,
      useCases: ["Invoice Printing", "Bulk Documents", "Color Marketing", "Network Sharing"],
      brands: "Epson / HP / Canon",
      cta: "Compare Specs"
    },
    {
      id: "scanners",
      title: "High-Speed Scanners",
      desc: "Fast document scanning solutions for achieving an organized, paperless workflow safely.",
      icon: <Scan className="w-12 h-12 mb-6 text-[#D4AF37]" />,
      useCases: ["Archival Digitization", "Receipt Tracking", "Document ID", "Workflow Automation"],
      brands: "Fujitsu / Canon",
      cta: "Browse Catalog"
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
            Hardware <span className="text-white/40">Products</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg md:text-xl text-white/60 mx-auto"
          >
            Premium physical computing infrastructure built by the world's most reliable brands.
          </motion.p>
        </section>

        <div className="flex flex-col gap-24 px-6 lg:px-20 max-w-7xl mx-auto">
          {products.map((prod, i) => (
            <motion.section 
              key={prod.id} id={prod.id}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
              className={`flex flex-col gap-8 md:gap-16 items-center glass-card p-10 lg:p-16 scroll-mt-32 relative ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
            >
              <div className="flex-1 w-full">
                {prod.icon}
                <h2 className="text-4xl font-bold mb-4">{prod.title}</h2>
                <p className="text-xl text-white/60 mb-8">{prod.desc}</p>
                <h4 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Primary Use Cases</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 md:mb-0">
                  {prod.useCases.map((uc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-white/30" /> {uc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full md:w-[400px] shrink-0 glass-card p-10 text-center flex flex-col justify-center items-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <h3 className="text-white/40 font-bold tracking-widest uppercase mb-4 text-sm z-10">Partner Brands</h3>
                <div className="text-3xl font-black mb-8 z-10 leading-tight">{prod.brands}</div>
                <a href={`https://wa.me/917558604483?text=Hi, I want a quote for ${prod.title}`} data-auth-gated="true" data-service-name={prod.title} target="_blank" className="w-full py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 z-10">
                  {prod.cta} <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
