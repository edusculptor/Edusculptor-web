import React from 'react';
import { 
  Rocket, 
  Eye, 
  Lightbulb, 
  ShieldCheck, 
  Award, 
  Brain, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Code, 
  Layers, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  CheckCircle2,
  Mail,
  Zap,
  Check
} from 'lucide-react';

interface AboutProps {
  setView: (view: any) => void;
}

interface TeamMember {
  name: string;
  role: string;
  title: string;
  bio: string;
  img: string;
  skills: string[];
  badge: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Prateek Bhoyar",
    role: "Founder & Chief Executive Officer",
    title: "Executive Leadership & Strategy",
    bio: "Founded the agency in 2022 as a passionate college entrepreneur with a clear vision to build something transformative. Steers overall company direction, high-level client partnerships, and strategic digital expansion.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    skills: ["Agency Strategy", "Client Growth", "Bespoke Solutions", "Business Operations"],
    badge: "Founder & CEO"
  },
  {
    name: "Radhini Sagne",
    role: "Head of Human Resources & People Operations",
    title: "People & Workplace Culture",
    bio: "Orchestrates organizational culture, team talent management, internal communications, and operational harmony. Ensures our client accounts and internal workflows run with seamless efficiency.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    skills: ["People Operations", "Talent Acquisition", "Process Optimization", "Client Relations"],
    badge: "HR & Operations"
  },
  {
    name: "Meenal Movad",
    role: "Head of Technology & Business Sales",
    title: "Technical Architecture & Growth",
    bio: "Directs both core technical solutions and commercial client engagement. Drives scalable software architectures, CRM deployments, and tailored technology proposals that solve real-world business bottlenecks.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    skills: ["System Architecture", "Enterprise Sales", "CRM Solutions", "Full-Stack Strategy"],
    badge: "Tech & Sales Lead"
  }
];

const coreValues = [
  { 
    icon: Lightbulb, 
    title: "Innovate", 
    desc: "We engineer forward-thinking digital platforms and intelligent automations, keeping your business leagues ahead of market competition." 
  },
  { 
    icon: Layers, 
    title: "Integrate", 
    desc: "We seamlessly connect custom CRM tools, cloud infrastructures, and marketing funnels into your existing business ecosystem without friction." 
  },
  { 
    icon: ShieldCheck, 
    title: "Integrity", 
    desc: "Uncompromising honesty, transparent communication, and dedicated client-first commitments form the cornerstone of every partnership." 
  },
  { 
    icon: Award, 
    title: "Excellence", 
    desc: "Pixel-perfect UI/UX designs, rock-solid engineering, and relentless quality standards are baked into every line of code and strategy." 
  },
  { 
    icon: Brain, 
    title: "Empowerment", 
    desc: "We equip business leaders and internal teams with high-efficiency digital tools that unlock autonomous scale and sustained growth." 
  }
];

const milestones = [
  {
    year: "2022",
    title: "The Genesis & Freelance Roots",
    description: "Started during college by Prateek Bhoyar with a circle of ambitious friends. Operating as a nimble freelance agency, we assisted local and growing businesses in setting up digital marketing processes, brand websites, and technical workflows."
  },
  {
    year: "2023 - 2024",
    title: "Continuous Learning & Professional Evolution",
    description: "Embraced every technical challenge to elevate our processes. We transformed from a casual freelance group into a disciplined digital solutions provider, mastering modern web stacks, CRM integrations, and cloud infrastructure."
  },
  {
    year: "2025",
    title: "First Official Office & Clear Agency Focus",
    description: "Marked a major milestone by establishing our first dedicated corporate office. While we briefly explored technical training, we made the deliberate strategic decision to focus 100% on delivering tailor-made digital services and custom software for businesses."
  },
  {
    year: "Present & Beyond",
    title: "Empowering Enterprises to Scale",
    description: "Dedicated to engineering bespoke CRM softwares, modern UI/UX experiences, cloud architectures, and AI automations that produce measurable ROI and operational clarity for our clients."
  }
];

const About: React.FC<AboutProps> = ({ setView }) => {
  return (
    <div className="animate-in fade-in duration-500 bg-white">
      {/* Hero Section */}
      <header className="relative bg-primary pt-36 sm:pt-44 md:pt-48 pb-28 sm:pb-36 overflow-hidden text-white">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[320px] sm:w-[750px] h-[320px] sm:h-[750px] bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[220px] sm:w-[550px] h-[220px] sm:h-[550px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-extrabold tracking-wider uppercase mb-6 shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>Digital Engineering & Strategy Agency</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight text-white">
            Empowering Modern Businesses Through <br className="hidden md:block" />
            <span className="text-blue-200">
              Bespoke Digital Solutions
            </span>
          </h1>

          <p className="text-sm sm:text-xl md:text-2xl text-blue-50/90 max-w-3xl mx-auto font-medium leading-relaxed mb-10">
            We partner with businesses to build high-performance web platforms, custom CRM systems, intuitive UI/UX designs, and automated cloud workflows that catalyze real business growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => setView('contact')}
              className="w-full sm:w-auto bg-white text-primary hover:bg-blue-50 px-8 py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-950/20 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
            >
              Partner With Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setView('services')}
              className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white/10 px-8 py-4 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-20 -mt-10 sm:-mt-16 relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                To engineer tailor-made digital systems, custom CRM software, and automated workflows that empower ambitious businesses to eliminate bottlenecks, delight their customers, and scale sustainably in the digital age.
              </p>
            </div>

            <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                To be the most dependable and value-driven digital transformation partner for businesses worldwide—celebrated for transparent collaboration, modern architectural excellence, and measurable return on investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider rounded-full mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Our Authentic Journey</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                From a College Vision to a Purpose-Driven Digital Agency
              </h2>

              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p>
                  Established in <strong className="text-slate-900 font-bold">2022</strong>, EduSculptor was born when founder <strong className="text-slate-900 font-bold">Prateek Bhoyar</strong> decided to build something of his own while still a college student. Teaming up with a few close, driven friends, they started out as a lean freelancing agency aimed at helping businesses navigate the digital realm.
                </p>
                <p>
                  In those early days, we worked closely with businesses to manage their digital onboarding—handling everything from web development to digital marketing funnels and operational setups. While we were not fully seasoned at the start, our mindset was distinct: we committed to continuous daily learning, refining our craftsmanship, and adopting stricter professional standards with every single client deliverable.
                </p>
                <p>
                  By <strong className="text-slate-900 font-bold">2025</strong>, that relentless discipline culminated in a major milestone: opening our <strong className="text-slate-900 font-bold">first official corporate office</strong>. Along the way, we briefly explored technical training for supplemental revenue, but recognized that our true passion and greatest client impact lay elsewhere.
                </p>
                <p className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary text-slate-800 font-medium">
                  Today, we have stepped completely away from education to focus 100% on our primary craft: providing bespoke digital solutions, custom CRM software, cloud integrations, and UI/UX engineering that help growing businesses accelerate their success.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-primary">2022</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Established Year</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-primary">2025</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">First Corporate Office</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-primary">100%</p>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Client-Centric B2B Focus</p>
                </div>
              </div>
            </div>

            {/* Right Timeline Cards */}
            <div className="lg:col-span-5 space-y-4">
              {milestones.map((milestone, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-md bg-slate-900 text-white tracking-wider">
                      {milestone.year}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{milestone.title}</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4" />
              Foundational Principles
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
              Five guiding pillars that dictate how we architect systems, treat our client partners, and deliver long-term business value.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-slate-50 p-6 sm:p-7 rounded-2xl border border-slate-100 hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{val.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-primary">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section id="team" className="py-16 sm:py-28 bg-slate-50 border-t border-slate-200/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <Users className="w-4 h-4" />
              The Leadership Behind Your Growth
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Meet Our Core Team</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
              A close-knit, agile leadership team combining strategic vision, operational discipline, and technical execution.
            </p>
          </div>

          {/* 3 Core Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, i) => (
              <div 
                key={i} 
                className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group"
              >
                <div>
                  {/* Photo & Badge */}
                  <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 shadow-inner">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                      {member.badge}
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-primary font-bold text-xs uppercase tracking-wider mt-1 mb-1">
                    {member.role}
                  </p>
                  <p className="text-slate-400 text-xs font-medium mb-4">
                    {member.title}
                  </p>

                  {/* Bio */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>
                </div>

                {/* Skills & Badges */}
                <div className="pt-5 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Key Competencies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sub-note on growing extended team */}
          <div className="mt-12 max-w-3xl mx-auto text-center p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-slate-600 text-sm">
              <strong className="text-slate-900 font-semibold">Expanding Specialized Network:</strong> In addition to our core leadership, we collaborate with a network of vetted full-stack engineers, UI/UX researchers, and cloud DevOps specialists tailored to individual enterprise projects.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Fixed contrast with distinct dark obsidian card and luminous elements */}
      <section className="py-20 sm:py-28 bg-slate-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2.5rem] bg-slate-950 p-8 sm:p-14 md:p-20 text-center text-white shadow-2xl overflow-hidden border-2 border-slate-800">
            {/* Ambient Background Glows - subtle and non-bleeding */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs sm:text-sm font-semibold mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Ready to Transform Your Business?</span>
              </div>

              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                Ready to Accelerate Your Business Growth?
              </h2>

              <p className="text-base sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
                Partner directly with our core team to engineer custom CRM systems, scalable web applications, and automated digital workflows designed for sustainable commercial impact.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <button 
                  onClick={() => setView('contact')}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
                  Discuss Your Project
                </button>
                <button 
                  onClick={() => setView('services')}
                  className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-extrabold text-base sm:text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Customized Proposals
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Direct Founder Collaboration
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Agile Delivery & Transparent Pricing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
