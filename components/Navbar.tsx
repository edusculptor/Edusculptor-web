
import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, UserPlus, ShieldCheck, UserCircle, ChevronRight } from 'lucide-react';
import { type User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface NavbarProps {
  user: User | null;
  userRole?: string;
  setView: (view: any) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, userRole, setView, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setView('home');
  };

  const navItems = [
    { name: 'Home', view: 'home' },
    { name: 'About Us', view: 'about' },
    { name: 'Services', view: 'services' },
    { name: 'Blog', view: 'blog' },
    { name: 'Contact', view: 'contact' },
  ];

  const isSolid = scrolled || currentView !== 'home';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isSolid ? 'bg-white shadow-xl py-2 sm:py-3' : 'bg-transparent py-4 sm:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
            onClick={() => setView('home')}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isSolid ? 'bg-primary shadow-primary/30' : 'bg-white shadow-white/20'}`}>
              <span className={`${isSolid ? 'text-white' : 'text-primary'} text-lg sm:text-xl font-black italic`}>E</span>
            </div>
            <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${isSolid ? 'text-slate-900' : 'text-white'}`}>
              EduSculptor
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button 
                key={item.name}
                onClick={() => setView(item.view)}
                className={`text-sm font-bold hover:text-primary transition-colors relative group/link ${
                  item.view === currentView 
                    ? 'text-primary' 
                    : (isSolid ? 'text-slate-600' : 'text-white/90')
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full ${item.view === currentView ? 'w-full' : ''}`} />
              </button>
            ))}
            
            <div className={`h-6 w-px ${isSolid ? 'bg-slate-200' : 'bg-white/20'}`} />

            {user ? (
              <div className="flex items-center gap-4">
                {userRole === 'admin' && (
                  <button 
                    onClick={() => setView('admin')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-slate-800 transition-all"
                  >
                    <ShieldCheck size={14} /> Admin
                  </button>
                )}
                
                <button 
                  onClick={() => setView('profile')}
                  className={`flex items-center gap-2 rounded-full pr-4 pl-1 py-1 border transition-all hover:scale-105 ${isSolid ? 'bg-slate-100 border-slate-200' : 'bg-white/10 border-white/20'}`}
                >
                  <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=random`} className="w-7 h-7 rounded-full" alt="User" />
                  <span className={`text-xs font-black ${isSolid ? 'text-slate-700' : 'text-white'}`}>Profile</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className={`p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors ${isSolid ? 'text-slate-400' : 'text-white/60'}`}
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('auth')} 
                className={`px-6 py-2.5 rounded-xl font-black transition-all shadow-lg flex items-center gap-2 active:scale-95 ${isSolid ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/25' : 'bg-white text-primary hover:bg-blue-50 shadow-white/10'}`}
              >
                <UserPlus className="w-4 h-4" /> Login / Join
              </button>
            )}
          </div>

          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={isSolid ? 'text-slate-900' : 'text-white'}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div 
          className={`absolute top-0 right-0 w-[280px] h-full bg-white shadow-2xl transition-transform duration-500 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-base font-black italic">E</span>
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">EduSculptor</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => { setView(item.view); setIsOpen(false); }} 
                    className={`w-full text-left font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-between group ${
                      item.view === currentView 
                        ? 'bg-primary/5 text-primary' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                    <ChevronRight size={14} className={`transition-transform ${item.view === currentView ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
              </div>

              <div className="my-6 h-px bg-slate-100" />

              {user ? (
                <div className="space-y-1">
                  <button 
                    onClick={() => { setView('profile'); setIsOpen(false); }} 
                    className={`w-full text-left font-black py-3.5 px-4 rounded-xl flex items-center gap-3 transition-all ${
                      currentView === 'profile' ? 'bg-primary/5 text-primary' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <UserCircle size={20} className={currentView === 'profile' ? 'text-primary' : 'text-slate-400'} /> 
                    My Profile
                  </button>
                  {userRole === 'admin' && (
                    <button 
                      onClick={() => { setView('admin'); setIsOpen(false); }} 
                      className={`w-full text-left font-black py-3.5 px-4 rounded-xl flex items-center gap-3 transition-all ${
                        currentView === 'admin' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldCheck size={20} className={currentView === 'admin' ? 'text-white' : 'text-slate-400'} /> 
                      Admin Panel
                    </button>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => { setView('auth'); setIsOpen(false); }} 
                  className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <UserPlus size={18} /> Login / Sign Up
                </button>
              )}
            </div>

            {user && (
              <div className="mt-auto pt-6 border-t border-slate-100">
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false); }} 
                  className="w-full text-red-600 font-black flex items-center gap-3 py-4 px-4 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={20} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
