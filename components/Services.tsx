
import React from 'react';
import { Lightbulb, BrainCircuit, Brush, Code, Cloud, Zap, ArrowRight } from 'lucide-react';

interface ServicesProps {
  setView?: (view: any) => void;
}

const services = [
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
    title: "Digital Strategy",
    desc: "Tailored roadmaps designed to scale your business using cutting-edge market insights."
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: "CRM Softwares & Systems",
    desc: "Custom CRM software setups, customer lifecycle tracking, and workflow automation built to help businesses scale operations smoothly."
  },
  {
    icon: <Brush className="w-8 h-8 text-primary" />,
    title: "Custom UI/UX Designs",
    desc: "Custom design setups, responsive digital interfaces, and user journeys that drive conversions and engagement."
  },
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Full-stack Dev",
    desc: "Scalable web applications and custom software portals built with robust modern frameworks and clean architecture."
  },
  {
    icon: <Cloud className="w-8 h-8 text-primary" />,
    title: "Cloud Solutions",
    desc: "Modernize your infrastructure with secure cloud deployments, cost optimization, and automated DevOps."
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "AI Generation & Automation",
    desc: "Custom setups for generative AI models, intelligent workflow automation, and data-driven business insights."
  }
];

const Services: React.FC<ServicesProps> = ({ setView }) => {
  return (
    <section id="services" className="py-12 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-20">
          <h2 className="text-primary font-extrabold uppercase tracking-[0.2em] text-[9px] sm:text-sm mb-2 sm:mb-4">Our Expertise</h2>
          <h3 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">Digital Strategy</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {services.map((s, idx) => (
            <div 
              key={idx}
              className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white rounded-lg sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-8 shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-transform">
                  <div className="scale-75 sm:scale-100">{s.icon}</div>
                </div>
                <h4 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4 text-slate-900">{s.title}</h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-base">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {setView && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('services')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95 cursor-pointer"
            >
              <span>Explore Services & Request Proposals</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setView('contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 hover:border-slate-900 hover:text-slate-900 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
            >
              <span>Connect With Us</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
