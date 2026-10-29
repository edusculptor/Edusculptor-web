
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Trust from './components/Trust';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import About from './components/About';
import ServicesPage from './components/ServicesPage';
import PortfolioPage from './components/PortfolioPage';
import ContactPage from './components/ContactPage';
import CareersPage from './components/CareersPage';
import BlogsPage from './components/BlogsPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import AdminPanel from './components/Admin/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import CancellationPolicy from './components/CancellationPolicy';
import TermsConditions from './components/TermsConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import RazorpayPlatform from './components/RazorpayPlatform';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>('student');
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState<'home' | 'about' | 'services' | 'blog' | 'contact' | 'portfolio' | 'careers' | 'auth' | 'admin' | 'profile' | 'cancellation' | 'terms' | 'privacy' | 'checkout' | 'razorpay-platform'>('home');
  const [redirectReason, setRedirectReason] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [razorpayPaymentData, setRazorpayPaymentData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          let role: 'admin' | 'student' = 'student';
          
          if (userDoc.exists()) {
            role = userDoc.data().role || 'student';
          }
          
          // Hardcoded admins for safety
          const admins = ['admin@edusculptor.com', 'edusculptor@gmail.com'];
          if (currentUser.email && admins.includes(currentUser.email.toLowerCase())) {
            role = 'admin';
          }
          
          setUserRole(role);
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUserRole('student');
        }
        
        if (view === 'auth') {
          setView('home');
          setRedirectReason(null);
        }
      } else {
        setUserRole('student');
      }
      setAuthLoading(false);
    });

    // Check for deep links on mount ONLY
    const params = new URLSearchParams(window.location.search);
    const urlView = params.get('view') as any;
    const jobId = params.get('jobId');

    if (urlView) {
      setView(urlView);
    } else if (jobId) {
      setView('careers');
    }

    return () => unsubscribe();
  }, []); // Only run on mount to handle initial deep link

  // Sync URL with View
  useEffect(() => {
    if (authLoading) return;
    
    const url = new URL(window.location.href);
    const currentParamView = url.searchParams.get('view');
    
    if (currentParamView !== view) {
      if (view === 'home') {
        url.searchParams.delete('view');
      } else {
        url.searchParams.set('view', view);
      }
      // Clean up deep link IDs after they are used or when moving away
      url.searchParams.delete('jobId');
      
      window.history.pushState({ view }, "", url.toString());
    }
  }, [view, authLoading]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const protectedViews = ['portfolio', 'profile'];
    const adminViews = ['admin'];
    
    if (!user && protectedViews.includes(view)) {
      setRedirectReason(`Please login to access our ${view}.`);
      setView('auth');
    }
    
    if (adminViews.includes(view) && userRole !== 'admin') {
      setView('home');
    }
  }, [view, user, userRole, authLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Initializing Session...</p>
      </div>
    );
  }

  if (view === 'admin' && userRole === 'admin') {
    return (
      <ErrorBoundary>
        <AdminPanel user={user} userRole={userRole} onLogout={() => auth.signOut()} setView={setView} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
      <Navbar user={user} userRole={userRole} setView={setView} currentView={view} />
      <main className="flex-grow">
        {view === 'home' && (
          <>
            <Hero setView={setView} />
            <Services setView={setView} />
            <Trust />
            <Testimonials user={user} />
          </>
        )}
        {view === 'about' && <About setView={setView} />}
        {view === 'services' && <ServicesPage setView={setView} user={user} setSelectedServiceId={setSelectedServiceId} />}
        {view === 'portfolio' && <PortfolioPage setView={setView} />}
        {view === 'contact' && <ContactPage setView={setView} />}
        {view === 'careers' && <CareersPage setView={setView} />}
        {view === 'blog' && <BlogsPage setView={setView} />}
        {view === 'auth' && <AuthPage setView={setView} redirectReason={redirectReason} />}
        {view === 'profile' && user && <ProfilePage user={user} setView={setView} />}
        {view === 'cancellation' && <CancellationPolicy />}
        {view === 'terms' && <TermsConditions />}
        {view === 'privacy' && <PrivacyPolicy />}
        {view === 'checkout' && <About setView={setView} />}
        {view === 'razorpay-platform' && (
          <RazorpayPlatform 
            paymentData={razorpayPaymentData} 
            setView={setView} 
          />
        )}
      </main>
      <Footer setView={setView} />
      {/* SEO Keywords Section (Hidden) */}
      <section className="sr-only" aria-hidden="true">
        <h2>EduSculptor SEO Keywords</h2>
        <p>
          Digital Transformation, Corporate Training, Custom Software Development, Tech Consulting, Professional Education, Career Accelerator, Skill Development, Industry Experts, Digital Learning, Strategy Consulting, Full Stack Development, UI/UX Design, Cloud Computing, AI & Machine Learning, Data Science, Digital Marketing, Business Strategy, Enterprise Solutions, Startup Consulting, Tech Education, Modern Learning Platform, Education center, Educational institution, Training centre, Training provider, School of computing, Computer training school, Business school, Business development service, Educational consultant, Software training institute, Career guidance service, Learning center, Adult education centre, Vocational school, Technical school, Institute of technology, Computer consultant, Software company, Business management consultant, Marketing agency, Marketing consultant, Advertising agency, Design agency, Design institute, Graphic designer, Web designer, Website designer, IT support and services, IT security service, E-commerce service, Media company, Media consultant, Video production service, Event management company, Conference center, Business center, Co-working space
        </p>
      </section>
    </div>
    </ErrorBoundary>
  );
};

export default App;
