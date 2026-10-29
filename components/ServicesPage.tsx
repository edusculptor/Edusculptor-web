import React, { useState, useEffect } from 'react';
import { 
  Globe, Smartphone, Database, Megaphone, Palette, ArrowRight, 
  CheckCircle2, Zap, Users, X, Phone, Mail, 
  User as UserIcon, Loader2, Target, BarChart, ShieldCheck,
  Download, FileText, Clock, Sparkles, MessageSquare, Check, HelpCircle
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateServiceBrochure } from '../lib/generateServiceBrochure';

interface ServicesPageProps {
  setView: (view: any) => void;
  user: any;
  setSelectedServiceId: (id: string) => void;
}

const defaultServiceOfferings = [
  {
    id: "web-dev",
    icon: <Globe className="w-6 h-6 text-primary" />,
    title: "Web Development",
    desc: "Custom-built, high-speed web ecosystems and client portals engineered for scale, SEO performance, and maximum conversion.",
    features: ["Next.js & React Applications", "Custom Portals & Admin Dashboards", "Tailored API & Database Architecture", "Enterprise Security & Performance Audits"]
  },
  {
    id: "app-dev",
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    title: "App Development",
    desc: "Intuitive, high-performance iOS and Android mobile experiences crafted for effortless user engagement and continuous retention.",
    features: ["Cross-Platform React Native & Flutter", "Native iOS & Android Performance", "Seamless Cloud Sync & Push Notifications", "App Store Optimization & Submissions"]
  },
  {
    id: "cloud-crm",
    icon: <Database className="w-6 h-6 text-primary" />,
    title: "Cloud & CRM Systems",
    desc: "Bespoke CRM software setups, lead management pipelines, and resilient cloud architectures tailored to eliminate business bottlenecks.",
    features: ["Custom CRM Workflow Engineering", "Lead Lifecycle & Pipeline Automation", "AWS & GCP Cloud Architecture", "Legacy System Migration & Integrations"]
  },
  {
    id: "ui-ux",
    icon: <Palette className="w-6 h-6 text-primary" />,
    title: "UI/UX Design",
    desc: "Human-centered user experiences and cohesive design systems that elevate brand trust, simplify complex workflows, and boost conversions.",
    features: ["User Journey & Persona Research", "Interactive Figma Prototypes", "Scalable Enterprise Design Systems", "Conversion Rate Optimization (CRO)"]
  },
  {
    id: "digital-strategy",
    icon: <Megaphone className="w-6 h-6 text-primary" />,
    title: "Digital Strategy",
    desc: "Data-driven commercial roadmaps, digital process onboarding, and high-impact acquisition funnels that drive measurable ROI.",
    features: ["Comprehensive Digital Onboarding", "Search & Performance Strategy", "Multi-Channel Growth Roadmaps", "Competitive Market Intelligence"]
  },
  {
    id: "ai-automation",
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "AI Generation & Automation",
    desc: "Custom generative AI integrations, intelligent automated workflows, and data-driven predictive tools designed to supercharge productivity.",
    features: ["Custom Generative AI Setups", "Automated Business Workflows", "Intelligent Customer Chat Assistants", "Predictive Analytics & Data Insights"]
  }
];

const ServicesPage: React.FC<ServicesPageProps> = ({ setView, user }) => {
  const [serviceOfferings, setServiceOfferings] = useState<any[]>(defaultServiceOfferings);
  
  // Lead Request Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalService, setModalService] = useState('Web Development');
  const [modalMethod, setModalMethod] = useState<'call' | 'mail'>('call');
  
  // Form State
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    service: 'Web Development',
    contactMethod: 'call' as 'call' | 'mail',
    requirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Brochure download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setServiceOfferings(fetched);
        }
      } catch (err) {
        console.error("Error fetching services from Firestore:", err);
      }
    };
    fetchServices();
  }, []);

  // Open modal with specific service and contact method
  const handleOpenLeadModal = (serviceTitle: string, method: 'call' | 'mail') => {
    setModalService(serviceTitle);
    setModalMethod(method);
    setForm(prev => ({
      ...prev,
      service: serviceTitle,
      contactMethod: method
    }));
    setErrorMessage(null);
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSuccess(false);
      setErrorMessage(null);
    }, 300);
  };

  const handleDownloadBrochure = async (service: any) => {
    const serviceKey = service.id || service.title;
    try {
      setDownloadingId(serviceKey);
      await new Promise(res => setTimeout(res, 300));
      generateServiceBrochure(service);
      setDownloadSuccessMessage(`${service.title} brochure downloaded successfully.`);
      setTimeout(() => {
        setDownloadSuccessMessage(null);
      }, 4000);
    } catch (err) {
      console.error("Failed to generate PDF brochure:", err);
      alert("Failed to generate PDF brochure. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate mandatory fields
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setErrorMessage("Please enter both First Name and Last Name.");
      return;
    }
    if (!form.phone.trim()) {
      setErrorMessage("Contact Number is mandatory.");
      return;
    }
    if (!form.email.trim()) {
      setErrorMessage("Email address is mandatory.");
      return;
    }
    if (!form.requirements.trim()) {
      setErrorMessage("Please tell us a brief summary of your requirements.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName,
        name: fullName,
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        service: form.service || modalService,
        contactMethod: form.contactMethod || modalMethod,
        requirements: form.requirements.trim(),
        message: form.requirements.trim(),
        type: form.contactMethod === 'call' ? 'Strategy Call Request' : 'Email Proposal Request',
        submittedAt: serverTimestamp(),
        source: 'services_lead_modal',
        status: 'new'
      };

      // 1. Save lead to Firestore collections for admin tracking
      try {
        await addDoc(collection(db, "proposals"), payload);
      } catch (fErr) {
        console.warn("Notice saving to proposals:", fErr);
      }

      try {
        await addDoc(collection(db, "service_requests"), payload);
      } catch (fErr) {
        console.warn("Notice saving to service_requests:", fErr);
      }

      // 2. Dispatch two emails via API (client confirmation + agency notification)
      try {
        await fetch('/api/send-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (emailErr) {
        console.warn("Email API invocation notice:", emailErr);
      }

      setSuccess(true);
      // Reset form
      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        service: modalService,
        contactMethod: modalMethod,
        requirements: ''
      });

    } catch (err: any) {
      console.error("Error submitting lead:", err);
      setErrorMessage(err?.message || "Submission failed. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light">
      {/* Hero Header */}
      <header className="relative bg-primary pt-36 sm:pt-44 md:pt-48 pb-28 sm:pb-36 overflow-hidden text-white">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[320px] sm:w-[750px] h-[320px] sm:h-[750px] bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[220px] sm:w-[550px] h-[220px] sm:h-[550px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Digital Engineering & Strategy Agency</span>
          </span>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
            Sculpting Your Digital <br className="hidden md:block" />
            <span className="text-blue-200">Excellence.</span>
          </h1>

          <p className="text-sm sm:text-xl md:text-2xl text-blue-50/90 max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            From bespoke CRM software and web platforms to cloud systems and AI automation, we provide precision-engineered digital services for growing businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button 
              onClick={() => handleOpenLeadModal('General Agency Consultation', 'call')} 
              className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-950/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Phone className="w-5 h-5" />
              Request a Call
            </button>
            <button 
              onClick={() => handleOpenLeadModal('General Agency Consultation', 'mail')} 
              className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              Request via Mail
            </button>
          </div>
        </div>
      </header>

      {/* Services Grid Section */}
      <section className="py-12 md:py-24 relative z-10 -mt-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {serviceOfferings.map((service, i) => (
              <div 
                key={i} 
                className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    {service.icon && typeof service.icon !== 'string' 
                      ? React.cloneElement(service.icon as any, { size: 24 }) 
                      : <Zap size={24} />}
                  </div>

                  {/* Title & Tag */}
                  <div className="mb-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  
                  {/* Deliverables / Capabilities */}
                  <div className="space-y-2 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      Key Capabilities:
                    </div>
                    {service.features.map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleOpenLeadModal(service.title, 'call')}
                      className="py-3 px-3 rounded-xl bg-primary text-white font-extrabold text-xs uppercase tracking-wider hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 active:scale-95 cursor-pointer"
                      title={`Request a phone call for ${service.title}`}
                    >
                      <Phone size={14} className="shrink-0" />
                      <span>Request Call</span>
                    </button>

                    <button 
                      onClick={() => handleOpenLeadModal(service.title, 'mail')}
                      className="py-3 px-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer"
                      title={`Request detailed email proposal for ${service.title}`}
                    >
                      <Mail size={14} className="shrink-0" />
                      <span>Request Mail</span>
                    </button>
                  </div>

                  {/* Brochure Download Action */}
                  <button 
                    onClick={() => handleDownloadBrochure(service)} 
                    disabled={downloadingId === (service.id || service.title)}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-60"
                    title={`Download ${service.title} Overview Brochure PDF`}
                  >
                    {downloadingId === (service.id || service.title) ? (
                      <>
                        <Loader2 size={13} className="animate-spin text-primary" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={13} className="text-primary" />
                        <span>Download PDF Brochure</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEDICATED "CONNECT WITH US" SECTION */}
      <section id="connect-with-us" className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 md:p-16 text-white shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Direct Agency Connect Info */}
              <div className="lg:col-span-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-primary/30">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Direct Consultation
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Connect With Us
                </h2>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
                  Have an ambitious project or want to modernize your company's workflows? Our core engineering and strategy team is here to partner with you every step of the way.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-md">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Hotline</p>
                      <a href="tel:+919322964324" className="text-base sm:text-lg font-bold text-white hover:text-blue-300 transition-colors">
                        +91 93229 64324
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Agency Email</p>
                      <a href="mailto:edusculptor@gmail.com" className="text-base sm:text-lg font-bold text-white hover:text-blue-300 transition-colors">
                        edusculptor@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 shadow-md">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Response Window</p>
                      <p className="text-sm font-semibold text-white">
                        Guaranteed response within 2-4 business hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Quick Action Card */}
              <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900">
                    Request an Instant Call or Proposal
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">
                    Fill out your details below and we will automatically dispatch a confirmation to your email and alert our team immediately.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => handleOpenLeadModal('General Digital Strategy', 'call')}
                    className="p-4 rounded-2xl border-2 border-primary bg-primary/5 hover:bg-primary hover:text-white transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Phone className="w-5 h-5 text-primary group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-primary text-white group-hover:bg-white group-hover:text-primary">Fast Track</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-white">Request a Phone Call</p>
                    <p className="text-xs text-slate-500 group-hover:text-blue-100 mt-1">Direct conversation with our founders</p>
                  </button>

                  <button
                    onClick={() => handleOpenLeadModal('General Digital Strategy', 'mail')}
                    className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Mail className="w-5 h-5 text-slate-700 group-hover:text-white" />
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 group-hover:bg-white group-hover:text-slate-900">Detailed</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-white">Request via Mail</p>
                    <p className="text-xs text-slate-500 group-hover:text-slate-300 mt-1">Written proposal & service breakdown</p>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Zero spam guarantee
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    Instant dual-email notification
                  </span>
                  <button 
                    onClick={() => handleOpenLeadModal('Full Digital Suite', 'call')}
                    className="text-primary font-bold hover:underline"
                  >
                    Open Lead Form →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agency Approach */}
      <section className="py-20 sm:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-primary font-black uppercase text-xs tracking-[0.3em] mb-4 block">Our Methodology</span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                Data-Driven, <br />Human-Focused Execution.
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {[
                  { icon: <Target className="text-orange-500" />, title: "Precision Discovery", desc: "We analyze your business metrics, operations, and customer bottlenecks before designing solutions." },
                  { icon: <BarChart className="text-indigo-500" />, title: "Agile Development", desc: "Transparent sprint milestones that ensure rapid time-to-market, clear communication, and iterative improvements." },
                  { icon: <ShieldCheck className="text-green-500" />, title: "Scalable Results", desc: "We engineer systems built for long-term growth, ensuring your tech assets scale seamlessly as your business expands." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 sm:gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm">
                      {React.cloneElement(item.icon as any, { size: 24 })}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-slate-100 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800" 
                  alt="Agency Team Collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xs border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">500+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Solutions Deployed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIVE POP-UP LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain animate-fade-in">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="relative bg-white w-full max-w-xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden z-10 my-auto border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative">
              <button 
                onClick={handleCloseModal} 
                className="absolute top-6 right-6 text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
                {form.contactMethod === 'call' ? <Phone size={13} /> : <Mail size={13} />}
                <span>{form.contactMethod === 'call' ? 'Request a Phone Call' : 'Request via Mail'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {modalService}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Tell us about your requirements and we will contact you directly.
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
              {success ? (
                /* Success Screen */
                <div className="text-center py-8 sm:py-10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  
                  <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                    Thank You for Your Request!
                  </h4>
                  
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
                    Our team will contact you soon. A confirmation mail has been dispatched to your email, and our agency has received your full project brief.
                  </p>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left max-w-md mx-auto mb-6 text-xs text-slate-600 space-y-1">
                    <p><strong>Service:</strong> {modalService}</p>
                    <p><strong>Preferred Contact:</strong> {form.contactMethod === 'call' ? 'Phone Call' : 'Email Response'}</p>
                    <p className="text-emerald-700 font-semibold mt-2">✓ Two automated confirmation & alert emails sent.</p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="bg-primary hover:bg-primary-dark text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-primary/25 transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmitLead} className="space-y-4 sm:space-y-5">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
                      <HelpCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name Fields: First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        placeholder="e.g. Rahul"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        placeholder="e.g. Sharma"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Contact Number (Mandatory) & Email (Mandatory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Contact Number <span className="text-red-500">* (Mandatory)</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="tel"
                          required
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Email Address <span className="text-red-500">* (Mandatory)</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          placeholder="client@company.com"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Service & Preferred Contact Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Selected Service
                      </label>
                      <select
                        value={form.service}
                        onChange={e => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Cloud & CRM Systems">Cloud & CRM Systems</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Digital Strategy">Digital Strategy</option>
                        <option value="AI Generation & Automation">AI Generation & Automation</option>
                        <option value="General Agency Consultation">General Agency Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                        Preferred Contact Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, contactMethod: 'call' })}
                          className={`py-3 px-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1.5 border transition-all ${
                            form.contactMethod === 'call'
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Phone size={13} />
                          <span>Phone Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, contactMethod: 'mail' })}
                          className={`py-3 px-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-1.5 border transition-all ${
                            form.contactMethod === 'mail'
                              ? 'bg-primary text-white border-primary shadow-sm'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Mail size={13} />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Textarea */}
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-1.5">
                      Your Project Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      required
                      rows={3}
                      value={form.requirements}
                      onChange={e => setForm({ ...form, requirements: e.target.value })}
                      placeholder="Share your goals, current challenges, expected deliverables, or preferred timeline..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    />
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Two automated emails will be dispatched immediately upon submission.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Download Success Toast */}
      {downloadSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-[130] bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <span className="text-xs font-bold text-slate-200">{downloadSuccessMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
