
import React, { useState, useRef, useEffect } from 'react';
/* Added missing ArrowRight and Send icons to the imports */
import { Globe, TrendingUp, Heart, Code, Brush, Users, ChevronDown, CheckCircle2, MapPin, Briefcase, GraduationCap, Loader2, Link as LinkIcon, X, Search, ArrowRight, Send, Share2, User as UserIcon, Mail, Phone } from 'lucide-react';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface CareersPageProps {
  setView: (view: any) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ setView }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const [jobOpenings, setJobOpenings] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', portfolio: '', message: '', category: 'Engineering', resumeLink: '', experience: '', skills: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);

  useEffect(() => {
    setLoadingJobs(true);
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobOpenings(fetchedJobs);
      setLoadingJobs(false);

      // Check for jobId in URL to auto-expand
      const urlParams = new URLSearchParams(window.location.search);
      const jobId = urlParams.get('jobId');
      if (jobId) {
        setExpandedJob(jobId);
        // Scroll to the job card after a short delay to ensure it's rendered
        setTimeout(() => {
          const element = document.getElementById(`job-${jobId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }, (err) => {
      console.error("Error fetching jobs:", err.message);
      setLoadingJobs(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApplyNow = (jobTitle: string) => {
    setForm(prev => ({ ...prev, category: jobTitle }));
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?view=careers&jobId=${jobId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareTooltip(jobId);
      setTimeout(() => setShareTooltip(null), 2000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "applications"), {
        ...form,
        type: 'Job Application',
        position: form.category,
        submittedAt: serverTimestamp(),
        status: 'new'
      });
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', portfolio: '', message: '', category: 'Engineering', resumeLink: '', experience: '', skills: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Application Error:", err.message);
      alert("Application failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-bg-light min-h-screen">
      {/* Hero */}
      <header className="relative pt-24 sm:pt-48 pb-12 sm:pb-32 overflow-hidden text-center bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-block py-1 sm:py-1.5 px-3 sm:px-5 rounded-full bg-primary/10 text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-8">Careers @ EduSculptor</span>
          <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-slate-900 mb-4 sm:mb-8 tracking-tight leading-none">Sculpting <br/><span className="text-primary">Future Talent.</span></h1>
          <p className="text-sm sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            We are looking for bold innovators and creative problem solvers to help us build the next generation of digital excellence.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </header>

      {/* Benefits */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">
          {[
            { icon: <Globe />, title: "Remote-First", desc: "Work from anywhere in the world. We value outcomes over office hours." },
            { icon: <TrendingUp />, title: "Rapid Growth", desc: "Join an agency at the forefront of digital transformation and scale your skills." },
            { icon: <Heart />, title: "Holistic Wellness", desc: "Comprehensive benefits designed to support your physical and mental health." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6">
                {React.cloneElement(item.icon as any, { size: 24 })}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 sm:mb-4">{item.title}</h3>
              <p className="text-sm sm:text-base text-slate-500 font-bold leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Job Board */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Open Positions</h2>
              <p className="text-slate-400 font-bold mt-1 uppercase text-[9px] sm:text-[10px] tracking-widest">Find your perfect fit</p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
              <Search size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live Listings</span>
            </div>
          </div>

          {loadingJobs ? (
            <div className="py-16 sm:py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-primary w-8 h-8 sm:w-10 sm:h-10" />
              <p className="text-slate-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest">Loading latest vacancies...</p>
            </div>
          ) : jobOpenings.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] p-12 sm:p-20 text-center border border-slate-100 shadow-xl">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-slate-200 mx-auto mb-5 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">No vacancies currently.</h3>
              <p className="text-sm sm:text-base text-slate-500 font-bold mt-2">But we're always scouting! Send a general application below.</p>
            </div>
          ) : (
              <div className="space-y-4 sm:space-y-6">
                {jobOpenings.map(job => (
                  <div key={job.id} id={`job-${job.id}`} className={`rounded-[2rem] sm:rounded-[2.5rem] border ${
                    new URLSearchParams(window.location.search).get('jobId') === job.id 
                      ? 'ring-4 ring-primary/20 border-primary/50' 
                      : 'border-slate-100'
                  } bg-white shadow-xl hover:shadow-2xl transition-all overflow-hidden group`}>
                  <div 
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                    className="w-full px-6 sm:px-8 py-8 sm:py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left hover:bg-slate-50 transition-colors gap-4 sm:gap-6 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpandedJob(expandedJob === job.id ? null : job.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 sm:gap-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        {job.category === 'Engineering' ? <Code size={20} /> : job.category === 'Design' ? <Brush size={20} /> : <Users size={20} />}
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 sm:mt-2">
                          <span className="flex items-center gap-1.5 bg-slate-100 px-2 sm:px-3 py-1 rounded-lg"><MapPin size={10} /> {job.location}</span>
                          <span className="flex items-center gap-1.5 bg-blue-50 text-primary px-2 sm:px-3 py-1 rounded-lg"><Briefcase size={10} /> {job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto sm:ml-0">
                      <div className="relative">
                        <button 
                          onClick={(e) => handleShare(e, job.id)}
                          className="p-2 hover:bg-primary/10 rounded-lg text-slate-300 hover:text-primary transition-all"
                          title="Share Job"
                        >
                          <Share2 size={16} />
                        </button>
                        {shareTooltip === job.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                            Link Copied!
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-300 group-hover:text-primary transition-colors">{expandedJob === job.id ? 'Close' : 'View Details'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${expandedJob === job.id ? 'rotate-180 text-primary' : 'text-slate-300'}`} />
                    </div>
                  </div>
                  {expandedJob === job.id && (
                    <div className="px-6 sm:px-10 pb-8 sm:pb-10 pt-2 sm:pt-4 animate-in slide-in-from-top-6 duration-500">
                      <div className="h-px bg-slate-50 mb-6 sm:mb-10" />
                      <div 
                        className="text-sm sm:text-lg text-slate-600 mb-8 sm:mb-10 font-medium leading-relaxed whitespace-pre-wrap job-description-render"
                        dangerouslySetInnerHTML={{ __html: job.description }}
                      />
                      <button 
                        onClick={() => handleApplyNow(job.title)} 
                        className="w-full sm:w-fit bg-primary text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                      >
                        Apply for this Role <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 sm:py-32 bg-white" ref={formRef}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-bg-light p-8 sm:p-12 md:p-20 rounded-[3rem] sm:rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
            
            {success ? (
              <div className="text-center py-12 sm:py-20 animate-in zoom-in">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4">Application Received!</h3>
                <p className="text-sm sm:text-lg text-slate-500 font-bold">Thank you for sharing your journey. Our talent acquisition team will review your application and reach out if there's a match.</p>
                <button onClick={() => setSuccess(false)} className="mt-8 sm:mt-12 text-primary font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] hover:underline">Apply for another position</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Join the Pulse</h2>
                  <p className="text-sm sm:text-lg text-slate-500 font-bold">Tell us who you are and what you build.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                    <div className="relative group flex items-center">
                      <UserIcon className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="Alex Rivera" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Professional Email</label>
                    <div className="relative group flex items-center">
                      <Mail className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="alex@company.com" type="email" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Contact Number</label>
                    <div className="relative group flex items-center">
                      <Phone className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="+91 98765 43210" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Portfolio / LinkedIn</label>
                    <div className="relative group flex items-center">
                      <Globe className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input value={form.portfolio} onChange={e => setForm({...form, portfolio: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Years of Experience</label>
                    <div className="relative group flex items-center">
                      <TrendingUp className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="e.g. 2+ Years" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Key Skills</label>
                    <div className="relative group flex items-center">
                      <Code className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="React, Node.js, UI/UX" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Role / Interest</label>
                  <div className="relative group flex items-center">
                    <Briefcase className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <input required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="e.g. Full Stack Engineer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Resume / Cloud Storage Link</label>
                  <div className="relative group flex items-center">
                    <LinkIcon className="absolute left-6 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <input required value={form.resumeLink} onChange={e => setForm({...form, resumeLink: e.target.value})} className="w-full pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all text-sm sm:text-base leading-none" placeholder="https://drive.google.com/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Introduction / Cover Note</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-6 sm:px-8 py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] bg-white border-2 border-transparent focus:border-primary/20 outline-none font-bold text-slate-700 shadow-sm transition-all h-32 sm:h-40 resize-none text-sm sm:text-base" placeholder="What drives you to innovate?" />
                </div>

                <button disabled={loading} className="w-full bg-slate-900 text-white py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl hover:bg-primary transition-all shadow-2xl active:scale-95 disabled:opacity-50 flex justify-center items-center gap-3 sm:gap-4" type="submit">
                  {loading ? <Loader2 className="animate-spin" /> : <>Submit Application <Send size={20} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
