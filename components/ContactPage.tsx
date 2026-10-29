
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Linkedin, Twitter, ArrowRight, Loader2, CheckCircle2, User as UserIcon, Zap } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ContactPageProps {
  setView: (view: any) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ setView }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: 'Digital Transformation', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "proposals"), {
        ...form,
        type: 'Proposal Request',
        submittedAt: serverTimestamp(),
        status: 'new'
      });

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', service: 'Digital Transformation', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-primary py-20 sm:py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-24 w-48 sm:w-64 h-48 sm:h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-2xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-8 tracking-tight leading-tight">
            Let's Build Something <br className="hidden md:block" /> Great Together
          </h1>
          <p className="text-sm sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Have a project in mind? Our team of digital experts is ready to help you scale through innovative technology and transformative training.
          </p>
        </div>
      </header>

      {/* Main Contact Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 lg:-mt-24 pb-16 sm:pb-32 relative z-20">
        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left Column: Form */}
          <div className="p-8 sm:p-10 lg:p-16 border-b lg:border-b-0 lg:border-r border-slate-50">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 sm:py-20 animate-in zoom-in duration-500">
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mb-6" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Proposal Requested!</h2>
                <p className="text-slate-500 font-bold max-w-xs mx-auto text-sm sm:text-base">Thank you for reaching out. An expert from our strategy team will contact you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="mt-8 text-primary font-black hover:underline text-sm sm:text-base">Send another request</button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4">
                  <Mail className="text-primary w-6 h-6 sm:w-8 sm:h-8" />
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group flex items-center">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <input 
                          required 
                          type="text" 
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                          placeholder="John Doe" 
                          className="w-full pl-12 pr-4 py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 text-sm sm:text-base shadow-sm leading-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group flex items-center">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <input 
                          required 
                          type="email" 
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          placeholder="john@company.com" 
                          className="w-full pl-12 pr-4 py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 text-sm sm:text-base shadow-sm leading-none" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative group flex items-center">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <input 
                          type="tel" 
                          value={form.phone}
                          onChange={e => setForm({...form, phone: e.target.value})}
                          placeholder="+91..." 
                          className="w-full pl-12 pr-4 py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 text-sm sm:text-base shadow-sm leading-none" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Service</label>
                      <div className="relative group flex items-center">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <select 
                          value={form.service}
                          onChange={e => setForm({...form, service: e.target.value})}
                          className="w-full pl-12 pr-10 py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer text-sm sm:text-base shadow-sm leading-none"
                        >
                          <option>Digital Transformation</option>
                          <option>Corporate Training</option>
                          <option>Custom Software</option>
                          <option>Tech Consulting</option>
                        </select>
                        <div className="absolute right-4 pointer-events-none text-slate-400">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Message</label>
                    <textarea 
                      required 
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="Tell us about your project or goals..." 
                      rows={5} 
                      className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-700 resize-none text-sm sm:text-base" 
                    />
                  </div>

                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full md:w-auto px-10 sm:px-12 py-4 sm:py-5 bg-primary text-white font-black rounded-xl sm:rounded-2xl hover:bg-primary-dark hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 text-base sm:text-lg"
                  >
                    {loading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : "Request Proposal"} <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right Column: Info & Map */}
          <div className="bg-primary/5 p-8 sm:p-10 lg:p-16 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 sm:mb-12">Contact Information</h3>
              <div className="space-y-8 sm:space-y-12">
                {[
                  { icon: <MapPin />, title: "Our Office", detail: "Floor No 2, Magh Apartment, Padole Hospital Square, Deendayal Nagar, Nagpur, Maharashtra 440022" },
                  { icon: <Phone />, title: "Direct Line", detail: "+91 8975434272" },
                  { icon: <Clock />, title: "Office Hours", detail: "Mon - Fri: 11:00 AM - 6:00 PM " }
                ].map((info, i) => (
                  <div key={i} className="flex items-start gap-4 sm:gap-6 group">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      {React.cloneElement(info.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-base sm:text-lg mb-0.5 sm:mb-1 uppercase tracking-tight">{info.title}</p>
                      <p className="text-slate-500 font-bold leading-relaxed text-sm sm:text-base">{info.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="mt-12 sm:mt-16">
      <a href="https://maps.app.goo.gl/cr2R3b8ApxbBfCHd8">
              <div className="rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden h-48 sm:h-64 w-full bg-slate-200 relative group shadow-xl border-4 border-white">
                <img 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchVhABbWTp7HPSIVxfT13PAmtziu_iWWbKxRrkPFghIMe_IuRUZUsZmDYBXj0Cm9pOvvOLEyuqaZFDNqA9MrXk0OeSJAsl5kMK56D04x99YVIKGe_RNR7ulQTYCJ7ifmoS-DbBb2RZJzbNwSuCrYu4y56dJDzKI29V9v2EOcQklHMwrdGnOyCLHbYM8OVTd_0ZxQ-qrF4rSFaDk6if1WlCApHh7q08Yy7VXzctomGJMArmAe1JDwKQurZGJAeBN8hB-IjFvbcRN0" 
                  alt="Office Location Map" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl ring-4 sm:ring-8 ring-white/50">
                   <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
       </a>
              {/* Social Connect */}
              <div className="mt-8 sm:mt-12">
                <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 sm:mb-6">Connect with us</p>
                <div className="flex gap-3 sm:gap-4">
                  {[Linkedin, Facebook, Instagram].map((Icon, i) => (
                    <a 
                      key={i} 
                      href="#" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary hover:scale-110 border border-transparent shadow-lg transition-all"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
