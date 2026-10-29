
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import metadata from '../metadata.json';

const Trust: React.FC = () => {
  const points = [
    { 
      title: "Custom CRM & Software Architecture", 
      desc: "Tailored enterprise CRM solutions, custom digital setups, and robust software architectures that streamline operations and drive business scale." 
    },
    { 
      title: "UI/UX, Cloud & AI Engineering", 
      desc: "High-conversion design systems, resilient cloud infrastructure, and intelligent AI automation built by senior engineering veterans." 
    },
    { 
      title: "Seamless Onboarding & Dedicated Support", 
      desc: "White-glove client onboarding, transparent milestone delivery, and ongoing technical support that guarantee measurable business ROI." 
    }
  ];

  const logos = (metadata as any).clientLogos || [];

  return (
    <section className="py-12 sm:py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            
            {/* Logo Carousel Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl relative z-10 p-6 sm:p-12 border border-slate-100 overflow-hidden">
              <div className="mb-4 sm:mb-8 text-center">
                <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary/60">Trusted By</span>
              </div>
              
              <div className="relative h-32 sm:h-64 flex items-center">
                <motion.div 
                  className="flex gap-8 sm:gap-12 items-center"
                  animate={{
                    x: [0, -1032], // Adjust based on content width
                  }}
                  transition={{
                    x: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 20,
                      ease: "linear",
                    },
                  }}
                >
                  {/* Duplicate logos for seamless loop */}
                  {[...logos, ...logos, ...logos].map((logo, i) => (
                    <div key={i} className="flex-shrink-0 group">
                      <img 
                        src={logo.url} 
                        alt={logo.name} 
                        className="h-8 sm:h-12 w-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </motion.div>
                
                {/* Gradient Masks for smooth edges */}
                <div className="absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-white to-transparent z-20" />
                <div className="absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-white to-transparent z-20" />
              </div>

              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white">
                    +500
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                    ))}
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 w-48 h-48 sm:w-64 sm:h-64 bg-primary/5 rounded-3xl -z-0" />
          </div>

          <div className="text-center lg:text-left mt-8 lg:mt-0">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold mb-6 sm:mb-10 text-slate-900 leading-tight">
              Why Growing Businesses & Industry Leaders Trust EduSculptor
            </h3>
            
            <div className="space-y-6 sm:space-y-10 text-left">
              {points.map((p, i) => (
                <div key={i} className="flex gap-4 sm:gap-6 group">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="text-white w-3.5 h-3.5 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-xl mb-1 sm:mb-2 text-slate-900">{p.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-lg">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trust;
