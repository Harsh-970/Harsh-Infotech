import React from "react";
import { motion } from "motion/react";

import testimonialsDataRaw from "./data/testimonials.json";

export interface Testimonial {
  id: string;
  featured: boolean;
  name: string;
  role: string;
  initials: string;
  text: string;
}

const testimonials = testimonialsDataRaw as Testimonial[];

const TestimonialsColumn = ({
  className = "",
  testimonialsList,
  duration = 15,
}: {
  className?: string;
  testimonialsList: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={`overflow-hidden flex-shrink-0 ${className}`} style={{ height: "520px" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonialsList.map(({ text, name, role, initials }, i) => (
              <div key={i} className="glass-card p-7 w-72">
                <p className="text-white/70 leading-relaxed text-sm mb-6">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-white/5 border border-white/20 flex items-center justify-center text-sm font-bold text-[#D4AF37] shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-5">{name}</div>
                    <div className="text-white/40 text-xs leading-5">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  const count = testimonials.length;
  const colSize = Math.max(2, Math.ceil(count / 3));
  const firstColumn = testimonials.slice(0, colSize);
  const secondColumn = testimonials.slice(colSize, colSize * 2);
  const thirdColumn = testimonials.slice(Math.max(0, colSize - 1), Math.max(colSize, colSize * 2 - 1));

  return (
    <section className="py-16 px-4 sm:px-6 md:py-24 lg:py-32 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Clients Say</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Trusted by 100+ businesses across India for Tally solutions, cloud services, and IT support.
          </p>
        </div>

        <div
          className="flex gap-6 justify-center"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        >
          {/* Column 1 — always visible */}
          <TestimonialsColumn testimonialsList={firstColumn} duration={18} />

          {/* Column 2 — tablet + desktop */}
          <TestimonialsColumn
            testimonialsList={secondColumn}
            duration={22}
            className="hidden md:block"
          />

          {/* Column 3 — desktop only */}
          <TestimonialsColumn
            testimonialsList={thirdColumn}
            duration={15}
            className="hidden lg:block"
          />
        </div>
      </div>
    </section>
  );
};
