
import React from 'react';
import { Facebook, Instagram, Github, Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

interface FooterProps {
  setView: (view: any) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-white pt-12 sm:pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-16 mb-12 sm:mb-20">
          {/* Brand Col */}
          <div className="col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 sm:mb-8 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl font-black italic">E</span>
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight">EduSculptor</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 sm:mb-8 font-medium text-xs sm:text-base">
              Empowering modern businesses through bespoke digital solutions, custom CRM software, and cloud architecture.
            </p>
            <div className="flex justify-center sm:justify-start gap-3 sm:gap-4">
              {[Facebook, Instagram, Github, Globe].map((Icon, i) => (
                <a key={i} href='' className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */} 
          <div className="text-center sm:text-left">
            <h5 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-6 sm:mb-8">Quick Links</h5>
            <ul className="space-y-3 sm:space-y-4 text-slate-300 font-bold text-sm">
              <li><button onClick={() => setView('home')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Home</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">About Us</button></li>
              <li><button onClick={() => setView('services')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Services</button></li>
              <li><button onClick={() => setView('blog')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Blog & Insights</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Contact</button></li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center sm:text-left">
            <h5 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-6 sm:mb-8">Company & Legal</h5>
            <ul className="space-y-3 sm:space-y-4 text-slate-300 font-bold text-sm">
              <li><button onClick={() => setView('about')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Our Story</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Get in Touch</button></li>
              <li><button onClick={() => setView('terms')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Terms of Service</button></li>
              <li><button onClick={() => setView('privacy')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Privacy Policy</button></li>
              <li><button onClick={() => setView('cancellation')} className="hover:text-primary transition-colors text-center sm:text-left w-full sm:w-auto">Refund Policy</button></li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="text-center sm:text-left">
            <h5 className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-widest mb-6 sm:mb-8">Stay Updated</h5>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium">Join 1,000+ business leaders receiving our digital strategy & tech insights.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest text-center md:text-left">
          <p>© 2025 EduSculptor Agency. Proudly engineered for growing businesses.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <button onClick={() => setView('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
            <button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => setView('cancellation')} className="hover:text-white transition-colors">Refund Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
