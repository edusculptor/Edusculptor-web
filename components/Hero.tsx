
import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

interface HeroProps {
  setView: (view: any) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  return (
    <section className="relative pt-20 pb-12 lg:pt-48 lg:pb-32 bg-primary overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] sm:w-[800px] h-[300px] sm:h-[800px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[200px] sm:w-[600px] h-[200px] sm:h-[600px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-white text-center lg:text-left">
            <span className="inline-block py-1 px-3 sm:py-1.5 sm:px-4 rounded-full bg-white/20 text-[9px] sm:text-xs font-bold uppercase tracking-widest mb-4 sm:mb-6">
              Pioneering Digital Agency
            </span>
            <h1 className="text-2xl sm:text-5xl lg:text-7xl font-extrabold leading-tight sm:leading-[1.1] mb-4 sm:mb-8">
              Sculpting the Future of <span className="text-blue-200">Digital Excellence.</span>
            </h1>
            <p className="text-sm sm:text-xl text-blue-50/80 mb-6 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Premium digital solutions, software engineering, and strategic technology consulting tailored for modern enterprises and innovators.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-5 mb-8 sm:mb-12">
              <button 
                onClick={() => setView('services')}
                className="bg-white text-primary hover:bg-blue-50 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-xl text-sm sm:text-base active:scale-95"
              >
                Explore Services
              </button>
              <button 
                onClick={() => setView('about')}
                className="border-2 border-white/40 text-white hover:bg-white/10 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-bold transition-all shadow-xl text-sm sm:text-base active:scale-95"
              >
                About EduSculptor
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2 sm:-space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i} 
                    src={`https://picsum.photos/seed/${i + 10}/100/100`} 
                    className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-primary object-cover" 
                    alt="User"
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-200" />
                <p className="text-[9px] sm:text-sm font-medium text-blue-100">Trusted by 200+ businesses and innovators</p>
              </div>
            </div>
          </div>

          <div className="relative group mt-6 lg:mt-0">
            <div className="relative rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl transform rotate-1 sm:rotate-2 group-hover:rotate-0 transition-transform duration-700">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                alt="Digital Excellence" 
                className="w-full h-[250px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>

            {/* Success Badge */}
            <div className="absolute -bottom-2 -left-2 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-6 rounded-lg sm:rounded-2xl shadow-2xl flex items-center gap-2 sm:gap-5 max-w-[150px] sm:max-w-xs animate-bounce-slow">
              <div className="w-8 h-8 sm:w-14 sm:h-14 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600 w-5 h-5 sm:w-8 sm:h-8" />
              </div>
              <div>
                <p className="text-lg sm:text-3xl font-black text-slate-900">99%</p>
                <p className="text-[7px] sm:text-xs text-slate-500 uppercase font-bold tracking-widest leading-tight">Project Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
