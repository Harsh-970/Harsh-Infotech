import { motion } from "motion/react";
import { CheckCircle2, Mail, Phone, MapPin } from "lucide-react";
import { Background, Navbar, Footer } from "./Shared";

export default function AboutApp() {
  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      <Background />
      <Navbar />
      <main>
        {/* SECTION 1 - HERO */}
        <section className="relative min-h-[60vh] flex flex-col justify-center px-6 lg:px-20 max-w-7xl mx-auto py-20">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-4"
              >
                About
              </motion.h1>
              <motion.h2
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                className="text-2xl md:text-4xl font-bold text-[#D4AF37] tracking-tight mb-8"
              >
                Harsh Infotech Consultancy Services
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-white/60 max-w-xl mx-auto lg:mx-0 mb-10"
              >
                We provide complete Tally solutions, cloud services, and process automation within Tally using customization to help companies streamline operations and scale efficiently.
              </motion.p>
              <motion.a 
                href="#contact"
                data-auth-gated="true"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="inline-block px-10 py-5 bg-white text-black rounded-full font-bold text-lg shadow-2xl shadow-white/10 hover:bg-white/90 transition-colors"
              >
                Contact Us
              </motion.a>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
              className="flex-1 w-full"
            >
              <img src="/hero-about.jpg" alt="Hero About" className="w-full h-auto rounded-3xl object-cover border border-white/10 shadow-2xl" />
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 - ABOUT COMPANY */}
        <section className="py-20 lg:py-32 px-6 lg:px-20 max-w-7xl mx-auto relative">
          <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">
            <div className="flex-1 w-full">
              <img src="/about-company.jpg" alt="About Company" className="w-full h-auto rounded-3xl object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
              <div className="text-lg text-white/60 leading-relaxed space-y-6">
                <p>
                  Harsh Infotech Consultancy Services helps businesses simplify accounting, automate workflows, and improve efficiency using Tally and IT solutions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 - WHAT WE DO */}
        <section className="py-20 bg-white/5 border-y border-white/5">
          <div className="px-6 lg:px-20 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {['Tally Solutions', 'Cloud & VPS Services', 'Tally Customization', 'Hardware & IT Support'].map((item, i) => (
                <div key={i} className="p-8 glass-card flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 mb-4 text-white/80" />
                  <h3 className="text-xl font-bold">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 - TEAM SECTION */}
        <section className="py-20 lg:py-32 px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Sales Team", desc: "Helping clients choose the right solutions.", img: "/team-sales.jpg" },
              { title: "Marketing Team", desc: "Ensuring services reach the right audience.", img: "/team-marketing.jpg" },
              { title: "Support Team", desc: "Providing fast and reliable assistance.", img: "/team-support.jpg" }
            ].map((team, i) => (
              <div key={i} className="glass-card overflow-hidden group">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={team.img} alt={team.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{team.title}</h3>
                  <p className="text-white/60 leading-relaxed">{team.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 - CONTACT SECTION EXPLICIT */}
        <section className="py-20 px-6 lg:px-20 max-w-5xl mx-auto mb-20">
          <div className="p-10 lg:p-14 glass-card text-center">
             <h2 className="text-4xl md:text-5xl font-bold mb-10">Reach Out</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6">
                   <Mail className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-2">Email</h4>
                 <a href="#" data-auth-gated="true" data-auth-action="email" data-email="harshinfotech2005@gmail.com" className="text-white/60 hover:text-white transition-colors">
                   harshinfotech2005@gmail.com
                 </a>
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6">
                   <Phone className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-2">Phone</h4>
                 <div className="text-white/60 text-center">
                   <a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="917558604483" className="hover:text-white transition-colors">7558604483</a><br/>
                   <a href="#" data-auth-gated="true" data-auth-action="whatsapp" data-phone="918828275219" className="hover:text-white transition-colors">8828275219</a>
                 </div>
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6">
                   <MapPin className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-2">Location</h4>
                 <p className="text-white/60">Mumbai, India</p>
               </div>
             </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
