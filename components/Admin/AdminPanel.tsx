
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, Briefcase, Settings, LogOut, Search, Filter, 
  MoreVertical, Eye, CheckCircle, XCircle, Clock, TrendingUp, Mail, Phone, Calendar, 
  ChevronRight, Plus, FileText, Bold, Italic, Underline, List, Link as LinkIcon, 
  Image as ImageIcon, Quote, Code as CodeIcon, Type, Trash2, Save, Globe, 
  HelpCircle, Upload, BarChart3, ExternalLink, ShieldAlert, PenTool, PlusCircle,
  Copy, AlertTriangle, Terminal, Info, UserCheck, UserMinus, UserPlus, PieChart, Activity,
  X, Share2, Layers, Zap, ShieldCheck, FileDown, User as UserIcon, Camera, Code, Tag, Wallet, Award, Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  collection, query, orderBy, onSnapshot, updateDoc, 
  doc, deleteDoc, addDoc, serverTimestamp, setDoc,
  arrayUnion, arrayRemove, getDoc, getDocs
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { programsList as initialPrograms } from '../../src/constants';

interface AdminPanelProps {
  onLogout?: () => void;
  user: any;
  userRole?: string;
  setView: (view: any) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, user, userRole, setView }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'programs' | 'careers' | 'blog' | 'users' | 'enrollments' | 'applications' | 'transactions' | 'portfolio' | 'services' | 'policies' | 'events' | 'certificates'>('dashboard');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Data States
  const [leads, setLeads] = useState<any[]>([]); 
  const [calls, setCalls] = useState<any[]>([]); 
  const [applications, setApplications] = useState<any[]>([]); 
  const [jobs, setJobs] = useState<any[]>([]); 
  const [blogs, setBlogs] = useState<any[]>([]); 
  const [platformUsers, setPlatformUsers] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [serviceEnrollments, setServiceEnrollments] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [issuedCertificates, setIssuedCertificates] = useState<any[]>([]);
  const [programsList, setProgramsList] = useState<any[]>(initialPrograms);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);
  const [priorityOnly, setPriorityOnly] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ item: any; collection: string; label: string } | null>(null);

  // Form States
  const [jobForm, setJobForm] = useState({ 
    title: '', 
    category: 'Engineering', 
    location: 'Remote', 
    type: 'Full-time', 
    salary: '',
    description: '',
    requirements: ''
  });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState({ title: '', content: '', author: 'Admin', image: '', category: 'Technology' });
  const [enrollmentForm, setEnrollmentForm] = useState({ userId: '', courseId: '', userName: '', userEmail: '', courseTitle: '', amount: '' as any, learningMode: 'online', paymentStatus: 'paid' });
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [transactionForm, setTransactionForm] = useState({ 
    userId: '', 
    userEmail: '', 
    userName: '', 
    amount: '' as any, 
    type: 'credit', 
    description: '', 
    status: 'completed',
    brand: 'Edusculptor'
  });
  const [policyForm, setPolicyForm] = useState({ type: 'refund', content: '' });
  const [serviceForm, setServiceForm] = useState({ title: '', desc: '', features: '', price: 0 });
  const [portfolioForm, setPortfolioForm] = useState({ title: '', category: 'Web Design', desc: '', img: '', tag: '' });
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [programForm, setProgramForm] = useState({ 
    title: '', 
    category: 'Development', 
    price: '', 
    duration: '', 
    level: 'Beginner to Advanced', 
    type: 'Comprehensive',
    outcome: '',
    salary: '',
    img: '',
    description: '',
    skills: '',
    trainerName: '',
    trainerRole: '',
    trainerBio: '',
    trainerImg: '',
    syllabus: '',
    bestseller: false,
    brochureUrl: ''
  });
  const [eventForm, setEventForm] = useState({ title: '', type: 'workshop', date: '', startTime: '', duration: '', description: '', location: 'Online', googleFormUrl: '' });
  const [certForm, setCertForm] = useState({ userName: '', userEmail: '', eventId: '', eventTitle: '' });
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [viewingAttendeesEventId, setViewingAttendeesEventId] = useState<string | null>(null);

  const handleFirestoreError = (error: any, operation: string, path: string) => {
    const errInfo = {
      error: error.message || String(error),
      operationType: operation,
      path,
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
        isAnonymous: user?.isAnonymous,
        providerInfo: user?.providerData?.map((p: any) => ({
          providerId: p.providerId,
          displayName: p.displayName,
          email: p.email,
          photoUrl: p.photoURL
        })) || []
      }
    };
    console.error(`Firestore Error [${operation}] at ${path}:`, JSON.stringify(errInfo));
  };

  useEffect(() => {
    const admins = ['admin@edusculptor.com', 'edusculptor@gmail.com'];
    const email = user?.email?.toLowerCase();
    const isAdmin = (email && admins.includes(email)) || user?.role === 'admin' || userRole === 'admin';
    if (!user || !isAdmin) return;

    const unsubLeads = onSnapshot(query(collection(db, "proposals"), orderBy("submittedAt", "desc")), 
      (snap) => setLeads(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'proposals' }))),
      (err) => handleFirestoreError(err, 'list', 'proposals')
    );

    const unsubCalls = onSnapshot(query(collection(db, "call_bookings"), orderBy("submittedAt", "desc")), 
      (snap) => setCalls(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'call_bookings' }))),
      (err) => handleFirestoreError(err, 'list', 'call_bookings')
    );

    const unsubApps = onSnapshot(query(collection(db, "applications")), 
      (snap) => {
        const apps = snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'applications' }));
        apps.sort((a: any, b: any) => {
          const dateA = a.submittedAt?.seconds || 0;
          const dateB = b.submittedAt?.seconds || 0;
          return dateB - dateA;
        });
        setApplications(apps);
      },
      (err) => handleFirestoreError(err, 'list', 'applications')
    );

    const unsubJobs = onSnapshot(query(collection(db, "jobs")), 
      (snap) => {
        const jobList = snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'jobs' }));
        jobList.sort((a: any, b: any) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setJobs(jobList);
      },
      (err) => handleFirestoreError(err, 'list', 'jobs')
    );

    const unsubBlogs = onSnapshot(query(collection(db, "blogs"), orderBy("createdAt", "desc")), 
      (snap) => setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'blogs' }))),
      (err) => handleFirestoreError(err, 'list', 'blogs')
    );

    const unsubUsers = onSnapshot(query(collection(db, "users"), orderBy("createdAt", "desc")), 
      (snap) => setPlatformUsers(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'users' }))),
      (err) => handleFirestoreError(err, 'list', 'users')
    );

    const unsubEnrollments = onSnapshot(query(collection(db, "enrollments"), orderBy("createdAt", "desc")), 
      (snap) => setEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'enrollments' }))),
      (err) => handleFirestoreError(err, 'list', 'enrollments')
    );

    const unsubServiceEnrollments = onSnapshot(query(collection(db, "service_enrollments"), orderBy("enrolledAt", "desc")), 
      (snap) => setServiceEnrollments(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'service_enrollments' }))),
      (err) => handleFirestoreError(err, 'list', 'service_enrollments')
    );

    const unsubTransactions = onSnapshot(query(collection(db, "transactions"), orderBy("createdAt", "desc")), 
      (snap) => setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'transactions' }))),
      (err) => handleFirestoreError(err, 'list', 'transactions')
    );

    const unsubEvents = onSnapshot(query(collection(db, "events"), orderBy("createdAt", "desc")), 
      (snap) => setEvents(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'events' }))),
      (err) => handleFirestoreError(err, 'list', 'events')
    );

    const unsubEventRegs = onSnapshot(query(collection(db, "event_registrations"), orderBy("enrolledAt", "desc")), 
      (snap) => setEventRegistrations(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'event_registrations' }))),
      (err) => handleFirestoreError(err, 'list', 'event_registrations')
    );

    const unsubCertificates = onSnapshot(query(collection(db, "issued_certificates"), orderBy("issuedAt", "desc")), 
      (snap) => setIssuedCertificates(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'issued_certificates' }))),
      (err) => handleFirestoreError(err, 'list', 'issued_certificates')
    );

    const unsubPrograms = onSnapshot(query(collection(db, "programs")), 
      (snap) => {
        const fetched = snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'programs' }));
        const deletedIds = new Set(fetched.filter((d: any) => d.isDeleted).map((d: any) => d.id));
        const activeFetched = fetched.filter((d: any) => !d.isDeleted);

        const merged: any[] = [...activeFetched];
        initialPrograms.forEach(ip => {
          if (!deletedIds.has(ip.id) && !merged.find(p => p.id === ip.id)) {
            merged.push({ ...ip, collection: 'programs' });
          }
        });
        
        // Sort by createdAt or maintain stable order
        merged.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        
        setProgramsList(merged);
      },
      (err) => handleFirestoreError(err, 'list', 'programs')
    );

    const unsubPolicies = onSnapshot(query(collection(db, "policies"), orderBy("updatedAt", "desc")), 
      (snap) => setPolicies(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'policies' }))),
      (err) => handleFirestoreError(err, 'list', 'policies')
    );

    const unsubPortfolio = onSnapshot(query(collection(db, "portfolio"), orderBy("createdAt", "desc")), 
      (snap) => setPortfolio(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'portfolio' }))),
      (err) => handleFirestoreError(err, 'list', 'portfolio')
    );

    const unsubServices = onSnapshot(query(collection(db, "services"), orderBy("createdAt", "desc")), 
      (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data(), collection: 'services' }))),
      (err) => handleFirestoreError(err, 'list', 'services')
    );

    return () => {
      unsubLeads(); unsubCalls(); unsubApps(); unsubJobs(); unsubBlogs(); unsubUsers(); unsubEnrollments(); unsubServiceEnrollments(); unsubTransactions();
      unsubEvents(); unsubEventRegs(); unsubCertificates(); unsubPrograms(); unsubPolicies(); unsubPortfolio(); unsubServices();
    };
  }, [user]);

  const getCollectionName = (item: any): string => {
    if (item.collection) return item.collection;
    switch (activeTab) {
      case 'programs': return 'programs';
      case 'careers': return 'jobs';
      case 'applications': return 'applications';
      case 'blog': return 'blogs';
      case 'users': return 'users';
      case 'enrollments': return 'enrollments';
      case 'transactions': return 'transactions';
      case 'portfolio': return 'portfolio';
      case 'services': return 'services';
      case 'policies': return 'policies';
      case 'events': return 'events';
      case 'certificates': return 'issued_certificates';
      case 'leads': return item.type === 'Strategy Call' ? 'call_bookings' : 'proposals';
      default: return 'proposals';
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const requestDelete = (item: any) => {
    if (!item?.id) {
      setToast({ message: "Error: Missing document identity.", type: 'error' });
      return;
    }
    const collectionName = getCollectionName(item);
    const itemLabel = item.title || item.name || item.fullName || item.userName || item.position || item.id;
    setDeleteConfirm({
      item,
      collection: collectionName,
      label: itemLabel
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { item, collection: collectionName, label } = deleteConfirm;

    try {
      setIsProcessing(item.id);

      if (collectionName === 'programs') {
        const isDefaultProgram = initialPrograms.some(ip => ip.id === item.id);
        if (isDefaultProgram) {
          // For initial/hardcoded programs, persist a soft-delete tombstone in Firestore
          await setDoc(doc(db, "programs", item.id), {
            id: item.id,
            title: item.title || 'Deleted Program',
            isDeleted: true,
            deletedAt: serverTimestamp()
          }, { merge: true });
        } else {
          // For custom programs, delete from Firestore
          await deleteDoc(doc(db, "programs", item.id));
        }

        setProgramsList(prev => prev.filter(p => p.id !== item.id));
      } else {
        await deleteDoc(doc(db, collectionName, item.id));
      }

      // Optimistically update local state for all tabs
      if (collectionName === 'applications') {
        setApplications(prev => prev.filter(a => a.id !== item.id));
      } else if (collectionName === 'jobs') {
        setJobs(prev => prev.filter(j => j.id !== item.id));
      } else if (collectionName === 'blogs') {
        setBlogs(prev => prev.filter(b => b.id !== item.id));
      } else if (collectionName === 'proposals') {
        setLeads(prev => prev.filter(l => l.id !== item.id));
      } else if (collectionName === 'call_bookings') {
        setCalls(prev => prev.filter(c => c.id !== item.id));
      } else if (collectionName === 'users') {
        setPlatformUsers(prev => prev.filter(u => u.id !== item.id));
      } else if (collectionName === 'portfolio') {
        setPortfolio(prev => prev.filter(p => p.id !== item.id));
      } else if (collectionName === 'services') {
        setServices(prev => prev.filter(s => s.id !== item.id));
      } else if (collectionName === 'events') {
        setEvents(prev => prev.filter(e => e.id !== item.id));
      } else if (collectionName === 'issued_certificates') {
        setIssuedCertificates(prev => prev.filter(c => c.id !== item.id));
      } else if (collectionName === 'policies') {
        setPolicies(prev => prev.filter(p => p.id !== item.id));
      } else if (collectionName === 'transactions') {
        setTransactions(prev => prev.filter(t => t.id !== item.id));
      } else if (collectionName === 'enrollments') {
        setEnrollments(prev => prev.filter(e => e.id !== item.id));
      }

      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }

      setToast({ message: `"${label}" was deleted successfully.`, type: 'success' });
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setToast({ message: "Delete failed: " + (err.message || String(err)), type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = (item: any) => {
    requestDelete(item);
  };

  const handleToggleStatus = async (item: any) => {
    const newStatus = item.status === 'connected' ? 'unselected' : 'connected';
    try {
      await updateDoc(doc(db, item.collection, item.id), { status: newStatus });
      setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
    } catch (err: any) { 
      setToast({ message: "Update failed: " + err.message, type: 'error' }); 
    }
  };

  const handleTogglePriority = async (item: any) => {
    const newPriority = !item.priority;
    try {
      await updateDoc(doc(db, item.collection, item.id), { priority: newPriority });
      setToast({ message: newPriority ? 'Marked as priority' : 'Priority removed', type: 'info' });
    } catch (err: any) { 
      setToast({ message: "Priority update failed: " + err.message, type: 'error' }); 
    }
  };

  const insertFormatting = (tag: string, field: 'job' | 'blog') => {
    const textarea = document.getElementById(field === 'job' ? 'job-desc' : 'blog-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const selection = text.substring(start, end);

    let newText = '';
    if (tag === 'bold') newText = `${before}<b>${selection}</b>${after}`;
    if (tag === 'italic') newText = `${before}<i>${selection}</i>${after}`;
    if (tag === 'underline') newText = `${before}<u>${selection}</u>${after}`;

    if (field === 'job') setJobForm({ ...jobForm, description: newText });
    else setBlogForm({ ...blogForm, content: newText });
  };

  const handleShareJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/?jobId=${jobId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareTooltip(jobId);
      setTimeout(() => setShareTooltip(null), 2000);
    });
  };

  const handleEditJob = (item: any) => {
    setEditingJobId(item.id);
    setJobForm({
      title: item.title || '',
      category: item.category || 'Engineering',
      location: item.location || 'Remote',
      type: item.type || 'Full-time',
      salary: item.salary || '',
      description: item.description || '',
      requirements: item.requirements || ''
    });
    setShowForm(true);
    setSelectedItem(null);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('job-save');
    try {
      if (editingJobId) {
        await updateDoc(doc(db, "jobs", editingJobId), {
          ...jobForm,
          updatedAt: serverTimestamp()
        });
        setJobs(prev => prev.map(j => j.id === editingJobId ? { ...j, ...jobForm } : j));
        setToast({ message: `Job "${jobForm.title}" updated successfully!`, type: 'success' });
      } else {
        const docRef = await addDoc(collection(db, "jobs"), { 
          ...jobForm, 
          createdAt: serverTimestamp(), 
          collection: 'jobs' 
        });
        setJobs(prev => [{ id: docRef.id, ...jobForm, collection: 'jobs' }, ...prev]);
        setToast({ message: `Job "${jobForm.title}" posted to Careers Hub!`, type: 'success' });
      }
      setShowForm(false);
      setEditingJobId(null);
      setJobForm({ title: '', category: 'Engineering', location: 'Remote', type: 'Full-time', description: '', salary: '', requirements: '' });
    } catch (err: any) { 
      setToast({ message: "Job Save Error: " + err.message, type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleEditProgram = (item: any) => {
    setEditingProgramId(item.id);
    setProgramForm({
      title: item.title || '',
      category: item.category || 'Development',
      price: String(item.price || ''),
      duration: item.duration || '',
      level: item.level || 'Beginner to Advanced',
      type: item.type || 'Comprehensive',
      outcome: item.outcome || '',
      salary: item.salary || '',
      img: item.img || '',
      description: item.description || item.desc || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
      trainerName: item.trainer?.name || '',
      trainerRole: item.trainer?.role || '',
      trainerBio: item.trainer?.bio || '',
      trainerImg: item.trainer?.img || '',
      syllabus: Array.isArray(item.syllabus) ? item.syllabus.join('\n') : (item.syllabus || ''),
      bestseller: !!item.bestseller,
      brochureUrl: item.brochureUrl || ''
    });
    setShowForm(true);
    setSelectedItem(null);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing('program-save');
    try {
      const syllabusArray = programForm.syllabus
        ? programForm.syllabus.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const programData: any = {
        title: programForm.title.trim(),
        category: programForm.category.trim(),
        price: Number(programForm.price) || 0,
        duration: programForm.duration.trim(),
        level: programForm.level,
        type: programForm.type || 'Comprehensive',
        outcome: programForm.outcome.trim(),
        salary: programForm.salary.trim(),
        img: programForm.img.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
        description: programForm.description.trim(),
        syllabus: syllabusArray,
        bestseller: !!programForm.bestseller,
        brochureUrl: programForm.brochureUrl.trim(),
        collection: 'programs'
      };

      if (programForm.trainerName) {
        programData.trainer = {
          name: programForm.trainerName.trim(),
          role: programForm.trainerRole.trim() || 'Senior Instructor',
          bio: programForm.trainerBio.trim() || '',
          img: programForm.trainerImg.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(programForm.trainerName)}&background=0066FF&color=fff`
        };
      }

      if (editingProgramId) {
        const docRef = doc(db, "programs", editingProgramId);
        await setDoc(docRef, {
          ...programData,
          id: editingProgramId,
          isDeleted: false,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Update local state
        setProgramsList(prev => prev.map(p => p.id === editingProgramId ? { ...p, ...programData, id: editingProgramId } : p));
        setToast({ message: `Program "${programData.title}" updated successfully!`, type: 'success' });
      } else {
        const cleanId = programData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prog-${Date.now()}`;
        const newProgram = {
          ...programData,
          id: cleanId,
          isDeleted: false,
          createdAt: serverTimestamp()
        };
        await setDoc(doc(db, "programs", cleanId), newProgram);
        setProgramsList(prev => [newProgram, ...prev.filter(p => p.id !== cleanId)]);
        setToast({ message: `Program "${programData.title}" added to Program Hub!`, type: 'success' });
      }

      setShowForm(false);
      setEditingProgramId(null);
      setProgramForm({ 
        title: '', category: 'Development', price: '', duration: '', level: 'Beginner to Advanced', 
        description: '', img: '', skills: '', outcome: '', salary: '', brochureUrl: '', 
        type: 'Comprehensive', trainerName: '', trainerRole: '', trainerBio: '', trainerImg: '', syllabus: '', bestseller: false 
      });
    } catch (err: any) {
      console.error("Save Program Error:", err);
      handleFirestoreError(err, editingProgramId ? 'update' : 'create', 'programs');
      setToast({ message: "Program Save Error: " + (err.message || String(err)), type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "portfolio"), {
        ...portfolioForm,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setPortfolioForm({ title: '', category: 'Web Design', desc: '', img: '', tag: '' });
    } catch (err) {
      handleFirestoreError(err, 'create', 'portfolio');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "services"), {
        ...serviceForm,
        features: serviceForm.features.split(',').map(f => f.trim()),
        price: Number(serviceForm.price),
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setServiceForm({ title: '', desc: '', features: '', price: 0 });
    } catch (err) {
      handleFirestoreError(err, 'create', 'services');
    }
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "policies"), {
        ...policyForm,
        updatedAt: serverTimestamp()
      });
      setShowForm(false);
    } catch (err) {
      handleFirestoreError(err, 'create', 'policies');
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlogId) {
        await updateDoc(doc(db, "blogs", editingBlogId), { ...blogForm, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "blogs"), { ...blogForm, createdAt: serverTimestamp(), collection: 'blogs' });
      }
      setShowForm(false);
      setEditingBlogId(null);
      setBlogForm({ title: '', content: '', author: 'Admin', image: '', category: 'Technology' });
    } catch (err: any) { alert("Blog Save Error: " + err.message); }
  };

  const handleAddEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCourse = initialPrograms.find(p => p.id === enrollmentForm.courseId);
      const selectedUser = platformUsers.find(u => u.id === enrollmentForm.userId);
      
      if (!selectedCourse || !selectedUser) {
        alert("Please select a valid user and course.");
        return;
      }

      await addDoc(collection(db, "enrollments"), {
        ...enrollmentForm,
        amount: Number(enrollmentForm.amount) || 0,
        userName: selectedUser.fullName || selectedUser.name || 'N/A',
        userEmail: selectedUser.email,
        courseTitle: selectedCourse.title,
        status: 'paid',
        createdAt: serverTimestamp(),
        collection: 'enrollments'
      });

      // Update user's enrolledCourses array
      await updateDoc(doc(db, "users", selectedUser.id), {
        enrolledCourses: arrayUnion(selectedCourse.id)
      });

      setShowEnrollmentForm(false);
      setEnrollmentForm({ userId: '', courseId: '', userName: '', userEmail: '', courseTitle: '', amount: 0, learningMode: 'online', paymentStatus: 'paid' });
      alert("Enrollment added successfully.");
    } catch (err: any) { alert("Enrollment Error: " + err.message); }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), {
        ...eventForm,
        createdAt: serverTimestamp()
      });
      setShowForm(false);
      setEventForm({ title: '', type: 'workshop', date: '', startTime: '', duration: '', description: '', location: 'Online', googleFormUrl: '' });
      alert("Event created successfully.");
    } catch (err) {
      handleFirestoreError(err, 'create', 'events');
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedEvent = events.find(ev => ev.id === certForm.eventId);
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certNumber = `ESC-EV-${dateStr}-${randomId}`;

      const certificateData = {
        ...certForm,
        userEmail: certForm.userEmail.toLowerCase().trim(),
        eventTitle: selectedEvent?.title || certForm.eventTitle || 'Workshop Completion',
        certNumber,
        issuedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "issued_certificates"), certificateData);
      generateCertificatePDF(certificateData);
      setShowForm(false);
      setCertForm({ userName: '', userEmail: '', eventId: '', eventTitle: '' });
      alert("Certificate issued.");
    } catch (err) {
      handleFirestoreError(err, 'create', 'issued_certificates');
    }
  };

  const generateCertificatePDF = (cert: any) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    doc.setDrawColor(0, 102, 255);
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(0, 102, 255);
    doc.text("EDUSCULPTOR", width / 2, 45, { align: 'center' });
    doc.setFontSize(32);
    doc.setTextColor(0);
    doc.text("CERTIFICATE OF APPRECIATION", width / 2, 85, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("THIS CERTIFICATE IS PROUDLY PRESENTED TO", width / 2, 105, { align: 'center' });
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 255);
    doc.text(cert.userName.toUpperCase(), width / 2, 125, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.text(`for outstanding participation and successful completion of the session on`, width / 2, 140, { align: 'center' });
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(cert.eventTitle, width / 2, 155, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Issued on: ${new Date().toLocaleDateString()}`, 40, 185);
    doc.text(`Verify at: edusculptor.com/verify`, 40, 192);
    doc.text(`ID: ${cert.certNumber}`, width - 40, 185, { align: 'right' });
    doc.save(`ESC_Cert_${cert.certNumber}.pdf`);
  };

  const handleToggleAttendance = async (registration: any) => {
    try {
      await updateDoc(doc(db, "event_registrations", registration.id), {
        attended: !registration.attended
      });
    } catch (err: any) {
      alert("Failed to update attendance: " + err.message);
    }
  };

  const handleIssueAttendeeCertificate = async (attendee: any, event: any) => {
    if (!attendee.attended) {
      alert("Certificates can only be issued to candidates who have attended the event.");
      return;
    }

    if (window.confirm(`Issue and auto-generate certificate for ${attendee.userName}?`)) {
      setIsProcessing(attendee.id);
      try {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
        const randomId = Math.random().toString(36).substring(2, 6).toUpperCase();
        const certNumber = `ESC-EV-${dateStr}-${randomId}`;

        const certificateData = {
          userName: attendee.userName,
          userEmail: attendee.userEmail.toLowerCase().trim(),
          eventId: event?.id || 'N/A',
          eventTitle: event?.title || 'Event Completion',
          certNumber,
          issuedAt: serverTimestamp(),
        };

        await addDoc(collection(db, "issued_certificates"), certificateData);
        
        // Mark as issued in registration
        await updateDoc(doc(db, "event_registrations", attendee.id), {
          certificateIssued: true
        });

        generateCertificatePDF(certificateData);
        alert("Certificate issued and PDF generated.");
      } catch (err) {
        handleFirestoreError(err, 'create', 'issued_certificates');
        alert("Failed to issue certificate.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const handleTerminateEnrollment = async (item: any) => {
    if (window.confirm(`Terminate enrollment for ${item.userName} in ${item.courseTitle}?`)) {
      try {
        await deleteDoc(doc(db, "enrollments", item.id));
        
        // Also remove from user's enrolledCourses array
        if (item.userId) {
          await updateDoc(doc(db, "users", item.userId), {
            enrolledCourses: arrayRemove(item.courseId)
          });
        }
        
        alert("Enrollment terminated.");
      } catch (err: any) { alert("Termination failed: " + err.message); }
    }
  };

  const generateInvoice = (enrollment: any) => {
    const doc = new jsPDF();
    const date = (enrollment.createdAt || enrollment.enrolledAt)?.toDate ? (enrollment.createdAt || enrollment.enrolledAt).toDate() : new Date();
    const dateStr = date.toLocaleDateString();
    const invoiceNo = enrollment.paymentId || enrollment.id.substring(0, 8).toUpperCase();
    const amount = Number(enrollment.amount) || 0;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 255); // Primary color
    doc.text("EDUSCULPTOR", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Digital Learning & Career Accelerator", 14, 28);
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 140, 20);
    
    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceNo}`, 140, 28);
    doc.text(`Date: ${dateStr}`, 140, 34);

    // Bill To
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 50);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(enrollment.userName || "Student", 14, 58);
    doc.text(enrollment.userEmail || "", 14, 64);

    // Table
    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Mode', 'Amount']],
      body: [
        [
          enrollment.courseTitle || enrollment.serviceTitle || enrollment.description || 'Service Payment',
          enrollment.learningMode?.toUpperCase() || 'N/A',
          `INR ${amount.toLocaleString()}`
        ]
      ],
      theme: 'striped',
      headStyles: { fillColor: [0, 102, 255] },
      styles: { fontSize: 10, cellPadding: 6 }
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;

    // Summary
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100);
    doc.text("GRAND TOTAL:", 125, finalY + 20);
    doc.setTextColor(0, 102, 255);
    doc.setFontSize(14);
    doc.text(`INR ${amount.toLocaleString()}.00`, 195, finalY + 20, { align: 'right' });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    const footerText = "This is a computer-generated invoice and does not require a physical signature. For any queries, please contact support@edusculptor.com";
    const splitFooter = doc.splitTextToSize(footerText, 180);
    doc.text(splitFooter, 14, finalY + 45);

    doc.save(`Invoice_${invoiceNo}.pdf`);
  };

  const generateInvoicePDF = (tx: any) => {
    const doc = new jsPDF();
    const brand = tx.brand || 'Edusculptor';
    
    // Brand Specific Colors
    const colors: Record<string, [number, number, number]> = {
      'Edusculptor': [0, 102, 255], // Blue
      'Tradiox': [0, 20, 80],       // Deep Blue
      'Growth': [16, 185, 129]      // Emerald
    };
    const primaryColor = colors[brand] || colors['Edusculptor'];

    // Header styling
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.text(brand.toUpperCase(), 20, 25);
    
    doc.setFontSize(10);
    doc.text("OFFICIAL INVOICE", 160, 25);

    // Business info
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(tx.userName || tx.fullName || 'Valued Client', 20, 68);
    doc.text(tx.userEmail || '', 20, 74);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", 140, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: INV-${tx.id?.substring(0, 8).toUpperCase() || 'NEW'}`, 140, 68);
    doc.text(`Date: ${new Date(tx.createdAt?.seconds ? tx.createdAt.seconds * 1000 : Date.now()).toLocaleDateString()}`, 140, 74);

    // Dynamic Table using autoTable for transaction details
    autoTable(doc, {
      startY: 90,
      margin: { left: 20, right: 20 },
      head: [['Description', 'Amount (INR)']],
      body: [
        [
          tx.description || tx.service || 'Digital Service / Program Fee',
          `${Number(tx.amount).toLocaleString('en-IN')}.00`
        ]
      ],
      theme: 'grid',
      headStyles: { 
        fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Total Section
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setLineWidth(0.5);
    doc.line(130, finalY, 190, finalY);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL PAID", 130, finalY + 10);
    
    doc.setFontSize(15);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`INR ${Number(tx.amount).toLocaleString('en-IN')}.00`, 190, finalY + 10, { align: 'right' });

    // Authentication text
    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text(`Transaction Reference: ${tx.id || 'N/A'}`, 20, finalY + 25);

    // Footer
    doc.setTextColor(150);
    doc.setFontSize(9);
    doc.text(`This is a computer-generated invoice for ${brand}.`, 105, 270, { align: 'center' });
    doc.text("Thank you for your business!", 105, 276, { align: 'center' });

    doc.save(`Invoice_${brand}_${(tx.userName || 'Customer').replace(/\s/g, '_')}.pdf`);
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalData = {
        ...transactionForm,
        amount: Number(transactionForm.amount) || 0,
        createdAt: serverTimestamp(),
        collection: 'transactions'
      };

      if (!useManualEntry) {
        const selectedUser = platformUsers.find(u => u.id === transactionForm.userId);
        if (!selectedUser) {
          alert("Please select a valid platform user or use manual entry.");
          return;
        }
        finalData.userName = selectedUser.fullName || selectedUser.name || 'N/A';
        finalData.userEmail = selectedUser.email;
      } else {
        if (!transactionForm.userName || !transactionForm.userEmail) {
          alert("Please enter full client name and email for manual entry.");
          return;
        }
      }

      const docRef = await addDoc(collection(db, "transactions"), finalData);
      
      setShowTransactionForm(false);
      
      // Auto-generate invoice if completed
      if (transactionForm.status === 'completed') {
        generateInvoicePDF({ id: docRef.id, ...finalData, createdAt: new Date() });
      }

      setTransactionForm({ userId: '', userEmail: '', userName: '', amount: 0, type: 'credit', description: '', status: 'completed', brand: 'Edusculptor' });
      setUseManualEntry(false);
      alert("Transaction record created.");
    } catch (err: any) { alert("Transaction Error: " + err.message); }
  };

  const safeToMillis = (timestamp: any) => {
    if (timestamp && typeof timestamp.toMillis === 'function') {
      return timestamp.toMillis();
    }
    return 0;
  };

  const combinedLeads = useMemo(() => {
    return [...leads, ...calls].sort((a, b) => 
      safeToMillis(b.submittedAt) - safeToMillis(a.submittedAt)
    );
  }, [leads, calls]);

  const filteredStats = useMemo(() => {
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const month = 30 * 24 * 60 * 60 * 1000;
    
    const filterFn = (item: any) => {
      if (timeFilter === 'all') return true;
      const ts = safeToMillis(item.submittedAt) || safeToMillis(item.createdAt) || 0;
      return now - ts < (timeFilter === 'weekly' ? week : month);
    };

    const periodLeads = combinedLeads.filter(filterFn);
    const periodUsers = platformUsers.filter(filterFn);

    const connectedLeads = periodLeads.filter(l => l.status === 'connected').length;

    const totalPeriod = periodLeads.length;

    return {
      leads: periodLeads.length,
      users: periodUsers.length,
      connectedRatio: totalPeriod === 0 ? 0 : Math.round((connectedLeads / totalPeriod) * 100),
      connectedCount: connectedLeads,
      unselectedCount: totalPeriod - connectedLeads
    };
  }, [combinedLeads, platformUsers, timeFilter]);

  const filterItems = (items: any[]) => {
    return items.filter(item => {
      const matchesSearch = (item.name || item.title || item.fullName || item.userName || item.courseTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.email || item.userEmail || item.college || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone || item.contact || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.position || item.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = !cityFilter || (item.city || '').toLowerCase().includes(cityFilter.toLowerCase());
      const matchesPriority = !priorityOnly || (activeTab === 'leads' ? item.priority === true : true);

      return matchesSearch && matchesCity && matchesPriority;
    });
  };

  return (
    <div className="flex h-screen bg-[#f3f5f9] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 z-[70] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">E</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">EduSculptor</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <nav className="space-y-2 overflow-y-auto flex-grow custom-scrollbar pr-2">
            {[
              { id: 'dashboard', icon: <LayoutDashboard />, label: 'Analytics' },
              { id: 'leads', icon: <Users />, label: 'Leads CRM', count: combinedLeads.length },
              { id: 'applications', icon: <FileText />, label: 'Applications', count: applications.length },
              { id: 'transactions', icon: <TrendingUp />, label: 'Transactions', count: transactions.length },
              { id: 'enrollments', icon: <CheckCircle />, label: 'Service Inquiries', count: enrollments.length },
              { id: 'users', icon: <UserPlus />, label: 'User Directory', count: platformUsers.length },
              { id: 'services', icon: <Zap />, label: 'Services Hub' },
              { id: 'blog', icon: <PenTool />, label: 'Blog & Insights', count: blogs.length },
              { id: 'portfolio', icon: <Layers />, label: 'Portfolio' },
              { id: 'careers', icon: <Briefcase />, label: 'Careers Hub', count: jobs.length },
              { id: 'policies', icon: <ShieldCheck />, label: 'Policies' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { 
                  setActiveTab(item.id as any); 
                  setShowForm(false); 
                  setSelectedItem(null); 
                  setIsSidebarOpen(false);
                  setPriorityOnly(false);
                  setCityFilter('');
                  setSearchQuery('');
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all relative ${
                  activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {React.cloneElement(item.icon as any, { size: 20 })}
                </div>
                <span className="flex-grow text-left">{item.label}</span>
                {item.count !== undefined && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
            <button 
              onClick={() => setView('home')} 
              className="w-full flex items-center gap-3 text-primary font-black text-sm hover:translate-x-1 transition-transform"
            >
              <Globe size={18} /> View Website
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-3 text-red-500 font-black text-sm hover:translate-x-1 transition-transform">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 lg:ml-72 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600"
            >
              <LayoutDashboard size={20} />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab} Panel</h1>
              <p className="text-slate-400 font-bold text-xs md:text-sm mt-1">Intelligence & Asset Management</p>
            </div>
          </div>
          
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {activeTab === 'users' && (
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  className="pl-10 pr-6 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:border-primary/50 font-bold text-xs shadow-sm appearance-none min-w-[140px]"
                >
                  <option value="">All Cities</option>
                  {Array.from(new Set(platformUsers.map(u => u.city).filter(Boolean))).map(city => (
                    <option key={city as string} value={city as string}>{city as string}</option>
                  ))}
                </select>
              </div>
            )}
            {activeTab === 'leads' && (
              <button 
                onClick={() => setPriorityOnly(!priorityOnly)}
                className={`px-6 py-3 rounded-2xl font-black text-xs shadow-sm flex items-center gap-2 transition-all ${priorityOnly ? 'bg-orange-500 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-50'}`}
              >
                <AlertTriangle size={16} /> {priorityOnly ? 'Priority Only' : 'All Leads'}
              </button>
            )}
            {(activeTab === 'careers' || activeTab === 'blog' || activeTab === 'enrollments' || activeTab === 'transactions' || activeTab === 'programs' || activeTab === 'portfolio' || activeTab === 'services' || activeTab === 'policies' || activeTab === 'events' || activeTab === 'certificates') && !showForm && !showEnrollmentForm && !showTransactionForm && (
              <button 
                onClick={() => { 
                  if (activeTab === 'programs') {
                    setEditingProgramId(null);
                    setProgramForm({ 
                      title: '', category: 'Development', price: '', duration: '', level: 'Beginner to Advanced', 
                      description: '', img: '', skills: '', outcome: '', salary: '', brochureUrl: '', 
                      type: 'Comprehensive', trainerName: '', trainerRole: '', trainerBio: '', trainerImg: '', syllabus: '', bestseller: false 
                    });
                    setShowForm(true);
                  } else if (activeTab === 'careers') {
                    setEditingJobId(null);
                    setJobForm({ title: '', category: 'Engineering', location: 'Remote', type: 'Full-time', description: '', salary: '', requirements: '' });
                    setShowForm(true);
                  } else if (activeTab === 'blog') {
                    setEditingBlogId(null);
                    setBlogForm({ title: '', content: '', author: 'Admin', image: '', category: 'Technology' });
                    setShowForm(true);
                  } else if (activeTab === 'enrollments') {
                    setShowEnrollmentForm(true);
                  } else if (activeTab === 'transactions') {
                    setShowTransactionForm(true);
                  } else {
                    setShowForm(true);
                  }
                }}
                className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all"
              >
                <Plus size={18} /> 
                {activeTab === 'careers' ? 'Post New Job' : 
                 activeTab === 'blog' ? 'Create Article' : 
                 activeTab === 'enrollments' ? 'Add Enrollment' : 
                 activeTab === 'transactions' ? 'Add Transaction' :
                 activeTab === 'programs' ? 'Add Program' :
                 activeTab === 'portfolio' ? 'Add Project' :
                 activeTab === 'services' ? 'Add Service' : 
                 activeTab === 'events' ? 'Add Event' :
                 activeTab === 'certificates' ? 'Issue Certificate' : 'Update Policy'}
              </button>
            )}
            {activeTab === 'dashboard' && (
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
            {(['weekly', 'monthly', 'all'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`flex-1 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${timeFilter === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t}
              </button>
            ))}
          </div>
            )}
            <div className="relative flex-grow md:flex-grow-0 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Deep Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 outline-none focus:border-primary/50 font-bold text-sm w-full md:w-72 shadow-sm transition-all" 
              />
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 md:space-y-10 animate-in fade-in duration-500">
            {/* Visual Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { label: 'Growth Leads', value: filteredStats.leads, icon: <Activity className="text-orange-500" />, sub: 'New potential clients' },
                { label: 'Conversion', value: `${filteredStats.connectedRatio}%`, icon: <TrendingUp className="text-green-500" />, sub: 'Total connectivity' },
                { label: 'User Index', value: filteredStats.users, icon: <Users className="text-indigo-500" />, sub: 'Registered on platform' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
                  <div className="relative z-10">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 md:mb-6">
                      {React.cloneElement(stat.icon as any, { size: 20 })}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-1 md:mb-2">{stat.value}</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-300 mt-1 italic">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Graphical Analytics Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
              <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8 md:mb-12">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black mb-1">Conversion Health</h3>
                      <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Connected vs. Unselected Ratio</p>
                    </div>
                    <PieChart className="text-primary" size={28} />
                  </div>
                  
                  <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between text-[10px] md:text-xs font-black uppercase tracking-widest">
                        <span className="text-green-400">Connected ({filteredStats.connectedCount})</span>
                        <span className="text-slate-400">{filteredStats.connectedRatio}%</span>
                      </div>
                      <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-1000"
                          style={{ width: `${filteredStats.connectedRatio}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between text-[10px] md:text-xs font-black uppercase tracking-widest">
                        <span className="text-orange-400">Unselected ({filteredStats.unselectedCount})</span>
                        <span className="text-slate-400">{100 - filteredStats.connectedRatio}%</span>
                      </div>
                      <div className="h-3 md:h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
                        <div 
                          className="h-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-1000"
                          style={{ width: `${100 - filteredStats.connectedRatio}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 md:gap-8 border-t border-white/10 pt-6 md:pt-8">
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Growth Index</p>
                      <p className="text-2xl md:text-3xl font-black text-primary">+{filteredStats.leads}</p>
                    </div>
                    <div>
                      <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Period</p>
                      <p className="text-2xl md:text-3xl font-black capitalize">{timeFilter}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Priority CRM Actions</h3>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[8px] font-black uppercase tracking-widest">
                    {combinedLeads.filter(l => l.priority).length} Priority
                  </span>
                </div>
                <div className="space-y-4 md:space-y-6 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {combinedLeads.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0)).slice(0, 15).map(item => (
                    <div key={item.id} className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all cursor-pointer group ${item.priority ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-transparent hover:border-primary/20'}`} onClick={() => setSelectedItem(item)}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center ${item.priority ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                          {item.priority ? <AlertTriangle size={16} /> : <Clock size={16} />}
                        </div>
                        <div>
                          <p className="text-[11px] md:text-xs font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.service || 'Strategy Call'}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300" />
                    </div>
                  ))}
                  {combinedLeads.filter(l => l.status !== 'connected').length === 0 && (
                    <div className="text-center py-8 md:py-12">
                      <CheckCircle className="mx-auto text-green-500 mb-3 md:mb-4" size={32} />
                      <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Inbox Clean</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Forms */}
        {showForm && (
          <div className="max-w-4xl bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 mb-12">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-black tracking-tight">
                {activeTab === 'careers' ? (editingJobId ? 'Edit Career Opening' : 'Post New Career Opportunity') : 
                 activeTab === 'programs' ? (editingProgramId ? 'Edit Program Blueprint' : 'Add New Program') :
                 activeTab === 'portfolio' ? 'Add New Project' :
                 activeTab === 'services' ? 'Add New Service' :
                 activeTab === 'policies' ? 'Update Policy' :
                 (editingBlogId ? 'Update Insight Article' : 'Compose Fresh Insight')}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingProgramId(null); setEditingJobId(null); }} className="p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={24} />
              </button>
            </div>

            {activeTab === 'careers' && (
              <form onSubmit={handlePostJob} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                    <div className="relative group">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="Full Stack Developer" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative group">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={jobForm.category} onChange={e => setJobForm({...jobForm, category: e.target.value})}>
                        <option>Engineering</option>
                        <option>Design</option>
                        <option>Marketing</option>
                        <option>Product</option>
                        <option>Sales</option>
                        <option>Operations</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="Remote / Bengaluru" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Employment Type</label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Salary Range / Exp</label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input placeholder="₹6 - 10 LPA / 2+ Yrs" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={jobForm.salary} onChange={e => setJobForm({...jobForm, salary: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Description & Responsibilities</label>
                    <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                      <button type="button" onClick={() => insertFormatting('bold', 'job')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors" title="Bold"><Bold size={16} /></button>
                      <button type="button" onClick={() => insertFormatting('italic', 'job')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors" title="Italic"><Italic size={16} /></button>
                      <button type="button" onClick={() => insertFormatting('underline', 'job')} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors" title="Underline"><Underline size={16} /></button>
                      <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                      <button type="button" onClick={() => {
                        const textarea = document.getElementById('job-desc') as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const text = textarea.value;
                        const before = text.substring(0, start);
                        const after = text.substring(end);
                        const selected = text.substring(start, end) || 'Responsibility item';
                        setJobForm({...jobForm, description: `${before}\n• ${selected}${after}`});
                      }} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors" title="Bullet List"><List size={16} /></button>
                    </div>
                  </div>
                  <textarea 
                    id="job-desc" 
                    required 
                    placeholder="Describe the role, responsibilities, culture, and what candidate will build..." 
                    className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[200px] resize-none outline-none transition-all text-slate-700 leading-relaxed shadow-inner" 
                    value={jobForm.description} 
                    onChange={e => setJobForm({...jobForm, description: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Key Requirements & Skills</label>
                  <textarea 
                    placeholder="React, Node.js, TypeScript, PostgreSQL, 2+ years experience..." 
                    className="w-full p-6 rounded-2xl bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[120px] resize-none outline-none transition-all text-slate-700 leading-relaxed shadow-inner" 
                    value={jobForm.requirements} 
                    onChange={e => setJobForm({...jobForm, requirements: e.target.value})} 
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={isProcessing === 'job-save'} className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                    <Save size={20} /> {editingJobId ? 'Update Opening' : 'Publish Opening'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingJobId(null); }} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {activeTab === 'blog' && (
              <form onSubmit={handleSaveBlog} className="space-y-8">
                <div className="relative group">
                  <PenTool className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={24} />
                  <input required placeholder="Insight Title" className="w-full pl-16 pr-6 py-6 rounded-3xl bg-slate-50 font-black text-2xl border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input placeholder="Admin" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Visual URL</label>
                    <div className="relative group">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input placeholder="https://unsplash.com/..." className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Article Body</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => insertFormatting('bold', 'blog')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Bold size={14} /></button>
                      <button type="button" onClick={() => insertFormatting('italic', 'blog')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Italic size={14} /></button>
                      <button type="button" onClick={() => insertFormatting('underline', 'blog')} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Underline size={14} /></button>
                    </div>
                  </div>
                  <textarea id="blog-content" required placeholder="Begin masterpiece..." className="w-full p-8 rounded-[3rem] bg-slate-50 font-medium border-none h-[300px] resize-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-slate-700 leading-relaxed" value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> {editingBlogId ? 'Update' : 'Publish'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingBlogId(null); }} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {activeTab === 'programs' && (
              <form onSubmit={handleSaveProgram} className="space-y-8">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Program Title *</label>
                    <div className="relative group">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="4-Month Full Stack Web Development" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.title} onChange={e => setProgramForm({...programForm, title: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category *</label>
                    <div className="relative group">
                      <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={programForm.category} onChange={e => setProgramForm({...programForm, category: e.target.value})}>
                        <option value="Development">Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Design">Design (UI/UX)</option>
                        <option value="AI & Machine Learning">AI & Machine Learning</option>
                        <option value="Cloud & DevOps">Cloud & DevOps</option>
                        <option value="Engineering">Engineering</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹) *</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within:text-primary transition-colors pointer-events-none">₹</span>
                      <input type="number" required placeholder="49999" className="w-full pl-10 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.price} onChange={e => setProgramForm({...programForm, price: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration *</label>
                    <div className="relative group">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="4 Months / 16 Weeks" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.duration} onChange={e => setProgramForm({...programForm, duration: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Skill Level</label>
                    <div className="relative group">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={programForm.level} onChange={e => setProgramForm({...programForm, level: e.target.value as any})}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Beginner to Advanced">Beginner to Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type / Pace</label>
                    <input placeholder="Intensive (Monster Approach)" className="w-full px-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.type} onChange={e => setProgramForm({...programForm, type: e.target.value})} />
                  </div>
                </div>

                {/* Outcome & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Career Outcome</label>
                    <input placeholder="e.g. Full-Stack Developer, AI Engineer" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.outcome} onChange={e => setProgramForm({...programForm, outcome: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Salary Expectation / CTC</label>
                    <input placeholder="e.g. 5 LPA - 12 LPA" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.salary} onChange={e => setProgramForm({...programForm, salary: e.target.value})} />
                  </div>
                </div>

                {/* Media & Flags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Cover Image URL</label>
                    <div className="relative group">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input placeholder="https://images.unsplash.com/..." className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={programForm.img} onChange={e => setProgramForm({...programForm, img: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <input 
                      type="checkbox" 
                      id="bestseller-flag"
                      checked={programForm.bestseller} 
                      onChange={e => setProgramForm({...programForm, bestseller: e.target.checked})}
                      className="w-6 h-6 rounded-lg text-primary focus:ring-primary border-slate-300"
                    />
                    <label htmlFor="bestseller-flag" className="text-xs font-black text-slate-700 uppercase tracking-wider cursor-pointer">
                      Featured / Bestseller Badge
                    </label>
                  </div>
                </div>

                {/* Trainer Information */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 space-y-4">
                  <p className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <UserIcon size={16} /> Lead Trainer / Instructor (Optional)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <input placeholder="Trainer Name (e.g. Pratik Bhoyar)" className="w-full px-4 py-3 rounded-xl bg-white font-bold border border-slate-200 outline-none text-xs" value={programForm.trainerName} onChange={e => setProgramForm({...programForm, trainerName: e.target.value})} />
                    <input placeholder="Role (e.g. Senior Tech Lead)" className="w-full px-4 py-3 rounded-xl bg-white font-bold border border-slate-200 outline-none text-xs" value={programForm.trainerRole} onChange={e => setProgramForm({...programForm, trainerRole: e.target.value})} />
                    <input placeholder="Photo URL (https://...)" className="w-full px-4 py-3 rounded-xl bg-white font-bold border border-slate-200 outline-none text-xs" value={programForm.trainerImg} onChange={e => setProgramForm({...programForm, trainerImg: e.target.value})} />
                  </div>
                  <textarea placeholder="Trainer Bio & Credentials..." className="w-full p-4 rounded-xl bg-white font-medium border border-slate-200 h-[80px] resize-none outline-none text-xs" value={programForm.trainerBio} onChange={e => setProgramForm({...programForm, trainerBio: e.target.value})} />
                </div>

                {/* Curriculum / Syllabus Topics */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Syllabus Curriculum Topics (One per line)</label>
                    <span className="text-[10px] text-slate-400 font-bold">Each line becomes a syllabus module</span>
                  </div>
                  <textarea 
                    placeholder="HTML & CSS (Frontend Foundations)&#10;JavaScript (Core Programming + DOM Manipulation)&#10;React.js & State Management&#10;Node.js & Backend Architecture&#10;Express.js & RESTful API Development&#10;MongoDB & Database Design" 
                    className="w-full p-6 rounded-2xl bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[180px] resize-none outline-none transition-all shadow-inner text-xs sm:text-sm font-mono leading-relaxed" 
                    value={programForm.syllabus} 
                    onChange={e => setProgramForm({...programForm, syllabus: e.target.value})} 
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Program Overview & Description *</label>
                  <textarea required placeholder="Deep-dive into full stack web development covering industry-standard best practices, live code reviews, and enterprise capstone architecture..." className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-none h-[150px] resize-none outline-none focus:ring-2 focus:ring-primary/20 transition-all leading-relaxed text-sm" value={programForm.description} onChange={e => setProgramForm({...programForm, description: e.target.value})} />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button type="submit" disabled={isProcessing === 'program-save'} className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50">
                    <Save size={20} /> {editingProgramId ? 'Update Program Blueprint' : 'Publish New Program'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingProgramId(null); }} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
                </div>
              </form>
            )}

            {activeTab === 'portfolio' && (
              <form onSubmit={handleSavePortfolio} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                    <div className="relative group">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="EduPortal 2.0" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={portfolioForm.title} onChange={e => setPortfolioForm({...portfolioForm, title: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative group">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={portfolioForm.category} onChange={e => setPortfolioForm({...portfolioForm, category: e.target.value})}>
                        <option value="Web Design">Web Design</option>
                        <option value="App Development">App Development</option>
                        <option value="Digital Branding">Digital Branding</option>
                        <option value="LMS Solutions">LMS Solutions</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                    <div className="relative group">
                      <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="https://..." className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={portfolioForm.img} onChange={e => setPortfolioForm({...portfolioForm, img: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tag</label>
                    <div className="relative group">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <input required placeholder="LMS Solutions" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={portfolioForm.tag} onChange={e => setPortfolioForm({...portfolioForm, tag: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea required placeholder="Project overview..." className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[150px] resize-none outline-none transition-all shadow-inner" value={portfolioForm.desc} onChange={e => setPortfolioForm({...portfolioForm, desc: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Save Project</button>
              </form>
            )}

            {activeTab === 'services' && (
              <form onSubmit={handleSaveService} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Service Title</label>
                  <div className="relative group">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <input required placeholder="Web Development" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea required placeholder="Service overview..." className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[150px] resize-none outline-none transition-all shadow-inner" value={serviceForm.desc} onChange={e => setServiceForm({...serviceForm, desc: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Features (Comma separated)</label>
                  <div className="relative group">
                    <List className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <input required placeholder="Next.js, React, E-commerce" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={serviceForm.features} onChange={e => setServiceForm({...serviceForm, features: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (INR)</label>
                  <div className="relative group">
                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <input required type="number" placeholder="49999" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Save Service</button>
              </form>
            )}

            {activeTab === 'policies' && (
              <form onSubmit={handleSavePolicy} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Policy Type</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={policyForm.type} onChange={e => setPolicyForm({...policyForm, type: e.target.value as any})}>
                      <option value="refund">Refund Policy</option>
                      <option value="terms">Terms & Conditions</option>
                      <option value="privacy">Privacy Policy</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content (Markdown/HTML supported)</label>
                  <textarea required placeholder="Policy content..." className="w-full p-8 rounded-[3rem] bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[400px] resize-none outline-none transition-all text-slate-700 leading-relaxed shadow-inner" value={policyForm.content} onChange={e => setPolicyForm({...policyForm, content: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Update Policy</button>
              </form>
            )}

            {activeTab === 'events' && (
              <form onSubmit={handleSaveEvent} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input required placeholder="React Workshop" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event Type</label>
                    <select className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={eventForm.type} onChange={e => setEventForm({...eventForm, type: e.target.value as any})}>
                      <option value="workshop">Workshop</option>
                      <option value="program">Program</option>
                      <option value="webinar">Webinar</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                    <input required type="date" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                      <input required type="time" className="w-full px-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.startTime} onChange={e => setEventForm({...eventForm, startTime: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Hrs)</label>
                      <input required type="number" placeholder="2" className="w-full px-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.duration} onChange={e => setEventForm({...eventForm, duration: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location / Platform</label>
                  <input required placeholder="Zoom / Google Meet / Office Address" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Google Form URL</label>
                  <input required placeholder="https://docs.google.com/forms/..." className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={eventForm.googleFormUrl} onChange={e => setEventForm({...eventForm, googleFormUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea required placeholder="Event details..." className="w-full p-8 rounded-[2rem] bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[150px] resize-none outline-none transition-all shadow-inner" value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Save Event</button>
              </form>
            )}

            {activeTab === 'certificates' && (
              <form onSubmit={handleIssueCertificate} className="space-y-8 text-left">
                <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 mb-8">
                  <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2 italic">
                    <ShieldCheck size={14} /> Security Notice
                  </p>
                  <p className="text-slate-500 font-bold text-sm leading-relaxed">
                    Certificates issued through this portal will be assigned a unique, auto-generated verification number. 
                    This record is permanent and will be searchable on the public verification page.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Recipient Full Name</label>
                    <input required placeholder="Enter student name" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-black border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={certForm.userName} onChange={e => setCertForm({...certForm, userName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input required type="email" placeholder="student@example.com" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-black border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={certForm.userEmail} onChange={e => setCertForm({...certForm, userEmail: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Event / Workshop</label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <select required className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={certForm.eventId} onChange={e => setCertForm({...certForm, eventId: e.target.value})}>
                      <option value="">Choose Event...</option>
                      {events.map(ev => (
                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                      ))}
                      <option value="custom">Custom (Specify Below)</option>
                    </select>
                  </div>
                </div>

                {certForm.eventId === 'custom' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Custom Event Title</label>
                    <input required placeholder="Advanced Node.js Masterclass" className="w-full px-6 py-5 rounded-2xl bg-slate-50 font-black border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={certForm.eventTitle} onChange={e => setCertForm({...certForm, eventTitle: e.target.value})} />
                  </div>
                )}

                <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95">
                  <Award size={20} /> Generate & Issue Certificate
                </button>
              </form>
            )}
          </div>
        )}

        {/* Enrollment Form */}
        {showEnrollmentForm && (
          <div className="max-w-4xl bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 mb-12">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-black tracking-tight">Manual Course Enrollment</h2>
              <button onClick={() => setShowEnrollmentForm(false)} className="p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddEnrollment} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select User</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select required className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={enrollmentForm.userId} onChange={e => setEnrollmentForm({...enrollmentForm, userId: e.target.value})}>
                        <option value="">Choose User...</option>
                        {platformUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName || u.name || u.email}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Course</label>
                    <div className="relative group">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select required className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={enrollmentForm.courseId} onChange={e => setEnrollmentForm({...enrollmentForm, courseId: e.target.value})}>
                        <option value="">Choose Course...</option>
                        {programsList.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount Paid (₹)</label>
                  <div className="relative group flex items-center">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within:text-primary transition-colors pointer-events-none">₹</span>
                    <input 
                      type="number" 
                      required 
                      className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" 
                      value={enrollmentForm.amount} 
                      onChange={e => setEnrollmentForm({...enrollmentForm, amount: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Learning Mode</label>
                  <div className="relative group flex items-center">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={enrollmentForm.learningMode} onChange={e => setEnrollmentForm({...enrollmentForm, learningMode: e.target.value as any})}>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                  <div className="relative group flex items-center">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                    <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={enrollmentForm.paymentStatus} onChange={e => setEnrollmentForm({...enrollmentForm, paymentStatus: e.target.value as any})}>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="partial">Partial</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"><UserPlus size={20} /> Confirm Enrollment</button>
                <button type="button" onClick={() => setShowEnrollmentForm(false)} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Transaction Form */}
        {showTransactionForm && (
          <div className="max-w-4xl bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[4rem] shadow-2xl border border-slate-100 animate-in zoom-in duration-300 mb-12">
            <div className="flex justify-between items-center mb-6 md:mb-10">
              <h2 className="text-xl md:text-3xl font-black tracking-tight">Create Transaction Record</h2>
              <button onClick={() => setShowTransactionForm(false)} className="p-4 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Entity / Brand Branding</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Edusculptor', 'Tradiox', 'Growth'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setTransactionForm({ ...transactionForm, brand: b })}
                        className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                          transactionForm.brand === b 
                            ? 'border-primary bg-primary/5 text-primary shadow-lg scale-105' 
                            : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Client Selection</label>
                    <button 
                      type="button" 
                      onClick={() => {
                        setUseManualEntry(!useManualEntry);
                        setTransactionForm({...transactionForm, userName: '', userEmail: '', userId: ''});
                      }}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      {useManualEntry ? 'Select App User' : 'Enter Manually'}
                    </button>
                  </div>
                  
                  {useManualEntry ? (
                    <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                      <div className="relative group flex items-center">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <input required placeholder="Client Full Name" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={transactionForm.userName} onChange={e => setTransactionForm({...transactionForm, userName: e.target.value})} />
                      </div>
                      <div className="relative group flex items-center">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                        <input required type="email" placeholder="Client Email" className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" value={transactionForm.userEmail} onChange={e => setTransactionForm({...transactionForm, userEmail: e.target.value})} />
                      </div>
                    </div>
                  ) : (
                    <div className="relative group animate-in slide-in-from-right-2 duration-300 flex items-center">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none" size={18} />
                      <select required className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={transactionForm.userId} onChange={e => setTransactionForm({...transactionForm, userId: e.target.value})}>
                        <option value="">Choose Platform User...</option>
                        {platformUsers.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName || u.name || u.email}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                  <div className="relative group flex items-center">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within:text-primary transition-colors pointer-events-none">₹</span>
                    <input 
                      type="number" 
                      required 
                      className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-black text-2xl text-slate-900 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all shadow-sm" 
                      value={transactionForm.amount} 
                      onChange={e => setTransactionForm({...transactionForm, amount: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Transaction Type</label>
                  <div className="relative group">
                    <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={transactionForm.type} onChange={e => setTransactionForm({...transactionForm, type: e.target.value as any})}>
                      <option value="credit">Credit (Payment Received)</option>
                      <option value="debit">Debit (Refund/Chargeback)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                  <div className="relative group">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                    <select className="w-full pl-12 pr-4 py-5 rounded-2xl bg-slate-50 font-bold border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all appearance-none shadow-sm" value={transactionForm.status} onChange={e => setTransactionForm({...transactionForm, status: e.target.value as any})}>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea required placeholder="Payment for Full Stack Course..." className="w-full p-6 rounded-3xl bg-slate-50 font-medium border-2 border-transparent focus:border-primary/20 focus:bg-white h-[120px] resize-none outline-none transition-all shadow-inner" value={transactionForm.description} onChange={e => setTransactionForm({...transactionForm, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-primary-dark transition-all flex items-center justify-center gap-3 active:scale-95"><Save size={20} /> Save Transaction</button>
                <button type="button" onClick={() => setShowTransactionForm(false)} className="px-12 py-6 bg-slate-100 text-slate-500 font-black rounded-[2rem] hover:bg-slate-200 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Global List View */}
        {activeTab !== 'dashboard' && !showForm && !showEnrollmentForm && !showTransactionForm && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                      <th className="px-6 md:px-10 py-4 md:py-6 text-left">Identity</th>
                      <th className="px-6 md:px-10 py-4 md:py-6 text-left">Context / Details</th>
                      {activeTab === 'users' && <th className="px-6 md:px-10 py-4 md:py-6 text-left">City</th>}
                      <th className="px-6 md:px-10 py-4 md:py-6 text-left">Status / Date</th>
                      <th className="px-6 md:px-10 py-4 md:py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                      {filterItems(
                        activeTab === 'leads' ? combinedLeads : 
                        activeTab === 'careers' ? jobs : 
                        activeTab === 'users' ? platformUsers :
                        activeTab === 'enrollments' ? [...enrollments, ...serviceEnrollments].sort((a,b) => safeToMillis(b.enrolledAt || b.createdAt) - safeToMillis(a.enrolledAt || a.createdAt)) :
                        activeTab === 'applications' ? applications :
                        activeTab === 'transactions' ? transactions :
                        activeTab === 'programs' ? programsList :
                        activeTab === 'portfolio' ? portfolio :
                        activeTab === 'services' ? services :
                        activeTab === 'events' ? events :
                        activeTab === 'certificates' ? issuedCertificates :
                        activeTab === 'policies' ? policies :
                        blogs
                      ).map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs flex-shrink-0">
                              {(item.name || item.title || item.fullName || item.userName || '?').charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-900 text-xs truncate">{item.name || item.title || item.fullName || item.userName || (item.type ? item.type.toUpperCase() : 'N/A')}</p>
                              <p className="text-[9px] font-bold text-slate-400 truncate max-w-[150px]">{item.email || item.userEmail || item.category || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <div className="text-[11px] font-bold text-slate-600">
                            {activeTab === 'users' ? `${item.college || 'N/A'}` : 
                             activeTab === 'enrollments' ? `${item.courseTitle || item.serviceTitle || 'N/A'}` :
                             activeTab === 'applications' ? `${item.position}` :
                             activeTab === 'transactions' ? (
                               <div className="flex flex-col gap-0.5">
                                 <span className="text-[11px] font-black text-slate-900">₹{item.amount.toLocaleString()}</span>
                                 <span className="text-[9px] font-bold text-slate-400 truncate max-w-[200px]">{item.description}</span>
                                 <span className="text-[8px] font-medium text-primary/60">{item.userName} ({item.userEmail})</span>
                               </div>
                             ) : 
                             activeTab === 'careers' ? `${item.category} • ${item.location}` :
                             activeTab === 'programs' ? `${item.category} • ₹${item.price}` :
                             activeTab === 'portfolio' ? `${item.category} • ${item.tag}` :
                             activeTab === 'services' ? `${item.desc.substring(0, 50)}...` :
                             activeTab === 'events' ? `${item.type.toUpperCase()} • ${item.location}` :
                             activeTab === 'certificates' ? `${item.eventTitle} • ID: ${item.certNumber}` :
                             activeTab === 'policies' ? `${item.content.substring(0, 50)}...` :
                             (item.service || item.position || item.author || 'N/A')}
                          </div>
                          {activeTab === 'applications' && <p className="text-[9px] text-slate-400 font-medium">{item.experience || 'No exp info'}</p>}
                        </td>
                        {activeTab === 'users' && (
                          <td className="px-6 md:px-10 py-4 md:py-6">
                            <p className="text-[11px] font-bold text-slate-600">{item.city || 'N/A'}</p>
                          </td>
                        )}
                        <td className="px-6 md:px-10 py-4 md:py-6">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${
                              item.status === 'connected' || item.status === 'paid' || item.status === 'completed' || item.status === 'hired' ? 'bg-green-100 text-green-600' : 
                              item.status === 'rejected' || item.status === 'failed' ? 'bg-red-100 text-red-600' :
                              'bg-orange-100 text-orange-600'
                            }`}>
                              {item.status || 'New'}
                            </span>
                            {(item.submittedAt || item.createdAt || item.enrolledAt) && (
                              <span className="text-[8px] text-slate-300 font-black uppercase">
                                {new Date(safeToMillis(item.submittedAt || item.createdAt || item.enrolledAt)).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-4 md:py-6 text-right">
                          <div className="flex gap-1.5 md:gap-2 justify-end items-center flex-wrap">
                             {activeTab === 'certificates' && (
                              <button 
                                onClick={() => generateCertificatePDF(item)}
                                className="p-2 md:p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                title="Re-download Certificate"
                              >
                                <FileDown size={16} />
                              </button>
                            )}
                            {activeTab === 'transactions' && (
                              <button 
                                onClick={() => generateInvoicePDF(item)}
                                className="p-2 md:p-2.5 rounded-xl bg-slate-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                                title="Download Invoice"
                              >
                                <FileDown size={16} />
                              </button>
                            )}
                            {activeTab === 'events' && (
                              <button 
                                onClick={() => setViewingAttendeesEventId(item.id)}
                                className="p-2 md:p-2.5 rounded-xl bg-slate-100 text-primary hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                                title="Manage Attendees"
                              >
                                <Users size={16} />
                                <span className="text-[10px] font-black uppercase hidden sm:inline">Attendees</span>
                                <span className="bg-primary/20 text-primary group-hover:bg-white/20 group-hover:text-white px-2 py-0.5 rounded-full text-[10px]">
                                  {eventRegistrations.filter(r => r.eventId === item.id).length}
                                </span>
                              </button>
                            )}
                            {activeTab === 'leads' && (
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleTogglePriority(item)} 
                                  className={`p-2 md:p-2.5 rounded-xl transition-all ${item.priority ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-400 hover:text-orange-500'}`}
                                  title={item.priority ? 'Remove Priority' : 'Mark Priority'}
                                >
                                  <AlertTriangle size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button 
                                  onClick={() => handleToggleStatus(item)} 
                                  className={`p-2 md:p-2.5 rounded-xl transition-all ${item.status === 'connected' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400 hover:text-green-500'}`}
                                  title={item.status === 'connected' ? 'Connected' : 'Mark Connected'}
                                >
                                  <UserCheck size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                              </div>
                            )}
                            {activeTab === 'enrollments' && (
                              <button 
                                onClick={() => handleTerminateEnrollment(item)} 
                                className="p-2 md:p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl shadow-sm"
                                title="Terminate Enrollment"
                              >
                                <UserMinus size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            )}
                            {activeTab === 'applications' && (
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleToggleStatus(item)} 
                                  className={`p-2 md:p-2.5 rounded-xl transition-all ${item.status === 'connected' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-400 hover:text-green-500'}`}
                                  title={item.status === 'connected' ? 'Connected' : 'Mark Connected'}
                                >
                                  <UserCheck size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button 
                                  onClick={async () => {
                                    try {
                                      await updateDoc(doc(db, "applications", item.id), { status: 'interviewing' });
                                      setToast({ message: "Status updated to Interviewing", type: 'success' });
                                    } catch (err: any) { setToast({ message: "Update failed: " + err.message, type: 'error' }); }
                                  }}
                                  className={`p-2 rounded-xl transition-all ${item.status === 'interviewing' ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                  title="Mark Interviewing"
                                >
                                  <Activity size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    try {
                                      await updateDoc(doc(db, "applications", item.id), { status: 'hired' });
                                      setToast({ message: "Status updated to Hired", type: 'success' });
                                    } catch (err: any) { setToast({ message: "Update failed: " + err.message, type: 'error' }); }
                                  }}
                                  className={`p-2 rounded-xl transition-all ${item.status === 'hired' ? 'bg-green-600 text-white shadow-md' : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'}`}
                                  title="Mark Hired"
                                >
                                  <CheckCircle size={14} />
                                </button>
                                <button 
                                  onClick={async () => {
                                    try {
                                      await updateDoc(doc(db, "applications", item.id), { status: 'rejected' });
                                      setToast({ message: "Status updated to Rejected", type: 'info' });
                                    } catch (err: any) { setToast({ message: "Update failed: " + err.message, type: 'error' }); }
                                  }}
                                  className={`p-2 rounded-xl transition-all ${item.status === 'rejected' ? 'bg-red-600 text-white shadow-md' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                                  title="Mark Rejected"
                                >
                                  <XCircle size={14} />
                                </button>
                              </div>
                            )}

                            {activeTab === 'careers' && (
                              <div className="relative">
                                <button 
                                  onClick={(e) => handleShareJob(e, item.id)} 
                                  className="p-2 md:p-2.5 bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all rounded-xl shadow-sm"
                                  title="Share Job Link"
                                >
                                  <Share2 size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                {shareTooltip === item.id && (
                                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded whitespace-nowrap z-50">
                                    Copied!
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Inspect Details Button */}
                            <button 
                              onClick={() => setSelectedItem(item)} 
                              className={`p-2 md:p-2.5 transition-all rounded-xl hover:shadow-md ${selectedItem?.id === item.id ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-white hover:text-primary'}`}
                              title="Inspect Details"
                            >
                              <Eye size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>

                            {/* Edit Button for Editable Tabs */}
                            {activeTab === 'programs' && (
                              <button 
                                onClick={() => handleEditProgram(item)} 
                                className="p-2 md:p-2.5 bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all rounded-xl shadow-sm"
                                title="Edit Program"
                              >
                                <PenTool size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            )}
                            {activeTab === 'careers' && (
                              <button 
                                onClick={() => handleEditJob(item)} 
                                className="p-2 md:p-2.5 bg-blue-50 text-primary hover:bg-primary hover:text-white transition-all rounded-xl shadow-sm"
                                title="Edit Job Opening"
                              >
                                <PenTool size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            )}
                            {activeTab === 'blog' && (
                              <button 
                                onClick={() => { setEditingBlogId(item.id); setBlogForm({ ...item }); setShowForm(true); }} 
                                className="p-2 md:p-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all rounded-xl shadow-sm"
                                title="Edit Article"
                              >
                                <PenTool size={16} className="md:w-[18px] md:h-[18px]" />
                              </button>
                            )}

                            {/* Delete Button (Accessible across all tabs) */}
                            <button 
                              onClick={() => requestDelete(item)} 
                              className="p-2 md:p-2.5 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all rounded-xl shadow-sm"
                              title="Delete Record"
                            >
                              <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Inspector */}
            <div className="lg:col-span-1">
              <div className="sticky top-12">
                {selectedItem ? (
                  <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 p-6 md:p-8 animate-in slide-in-from-right duration-300 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center font-black text-2xl md:text-3xl mx-auto mb-4 shadow-xl shadow-primary/20 overflow-hidden">
                        {selectedItem.photoURL || selectedItem.img ? (
                          <img src={selectedItem.photoURL || selectedItem.img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          (selectedItem.name || selectedItem.title || selectedItem.fullName)?.charAt(0) || 'E'
                        )}
                      </div>
                      <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                        {selectedItem.name || selectedItem.title || selectedItem.fullName || selectedItem.userName}
                      </h4>
                      <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
                        <span className="text-[9px] md:text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                          {selectedItem.collection || activeTab}
                        </span>
                        {selectedItem.category && (
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                            {selectedItem.category}
                          </span>
                        )}
                        {selectedItem.status && (
                          <span className={`text-[9px] md:text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            selectedItem.status === 'connected' || selectedItem.status === 'paid' || selectedItem.status === 'completed' || selectedItem.status === 'hired' ? 'bg-green-100 text-green-700' : 
                            selectedItem.status === 'rejected' || selectedItem.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {selectedItem.status}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specific Inspector Content for Programs */}
                    {activeTab === 'programs' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Price</span>
                            <span className="text-base font-black text-primary">₹{Number(selectedItem.price || 0).toLocaleString()}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Duration</span>
                            <span className="text-xs font-black text-slate-800">{selectedItem.duration || 'N/A'}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Level</span>
                            <span className="text-xs font-bold text-slate-700">{selectedItem.level || 'Beginner to Advanced'}</span>
                          </div>
                          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Format</span>
                            <span className="text-xs font-bold text-slate-700">{selectedItem.type || 'Comprehensive'}</span>
                          </div>
                        </div>

                        {(selectedItem.outcome || selectedItem.salary) && (
                          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                            {selectedItem.outcome && (
                              <div className="text-xs text-slate-700">
                                <span className="font-bold text-emerald-700">Career Outcome: </span>
                                <span className="font-black text-slate-900">{selectedItem.outcome}</span>
                              </div>
                            )}
                            {selectedItem.salary && (
                              <div className="text-xs text-slate-700">
                                <span className="font-bold text-emerald-700">Expected Package: </span>
                                <span className="font-black text-slate-900">{selectedItem.salary}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedItem.trainer?.name && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Lead Trainer</span>
                            <div className="flex items-center gap-3">
                              {selectedItem.trainer.img && (
                                <img src={selectedItem.trainer.img} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
                              )}
                              <div>
                                <p className="text-xs font-black text-slate-900">{selectedItem.trainer.name}</p>
                                <p className="text-[10px] font-bold text-primary">{selectedItem.trainer.role}</p>
                              </div>
                            </div>
                            {selectedItem.trainer.bio && (
                              <p className="text-[11px] text-slate-500 mt-2 italic leading-relaxed">{selectedItem.trainer.bio}</p>
                            )}
                          </div>
                        )}

                        {Array.isArray(selectedItem.syllabus) && selectedItem.syllabus.length > 0 && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                              Curriculum Modules ({selectedItem.syllabus.length})
                            </span>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                              {selectedItem.syllabus.map((topic: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2 text-xs font-bold text-slate-700 bg-white p-2 rounded-xl border border-slate-100">
                                  <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] shrink-0 font-black">
                                    {idx + 1}
                                  </span>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(selectedItem.description || selectedItem.desc) && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Overview</span>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed">
                              {selectedItem.description || selectedItem.desc}
                            </p>
                          </div>
                        )}

                        <div className="pt-2 flex flex-col gap-2">
                          <button
                            onClick={() => handleEditProgram(selectedItem)}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                          >
                            <PenTool size={16} /> Edit Program Details
                          </button>
                          <button
                            onClick={() => {
                              setView('services');
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <ExternalLink size={14} /> View On Site
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Specific Inspector Content for Applications */}
                    {activeTab === 'applications' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Position Applied For</span>
                            <p className="text-sm font-black text-slate-900">{selectedItem.position || selectedItem.category || 'Job Application'}</p>
                          </div>
                          {selectedItem.experience && (
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Experience Level</span>
                              <p className="text-xs font-bold text-slate-700">{selectedItem.experience}</p>
                            </div>
                          )}
                          {selectedItem.skills && (
                            <div>
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Key Skills</span>
                              <p className="text-xs font-bold text-primary bg-primary/5 p-2 rounded-xl border border-primary/10">{selectedItem.skills}</p>
                            </div>
                          )}
                        </div>

                        {/* Resume and Portfolio Links */}
                        {(selectedItem.resumeLink || selectedItem.portfolio) && (
                          <div className="space-y-2">
                            {selectedItem.resumeLink && (
                              <a
                                href={selectedItem.resumeLink.startsWith('http') ? selectedItem.resumeLink : `https://${selectedItem.resumeLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-indigo-200 shadow-sm"
                              >
                                <FileText size={16} /> Open Candidate Resume / CV <ExternalLink size={14} />
                              </a>
                            )}
                            {selectedItem.portfolio && (
                              <a
                                href={selectedItem.portfolio.startsWith('http') ? selectedItem.portfolio : `https://${selectedItem.portfolio}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                              >
                                <Globe size={16} /> Open Portfolio URL <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Application Status Controller */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Application Pipeline Stage</span>
                          <div className="grid grid-cols-2 gap-2">
                            {(['new', 'interviewing', 'hired', 'rejected'] as const).map(st => (
                              <button
                                key={st}
                                onClick={async () => {
                                  try {
                                    await updateDoc(doc(db, "applications", selectedItem.id), { status: st });
                                    setSelectedItem({ ...selectedItem, status: st });
                                    setToast({ message: `Candidate marked as ${st}`, type: 'success' });
                                  } catch (err: any) {
                                    setToast({ message: "Update failed: " + err.message, type: 'error' });
                                  }
                                }}
                                className={`py-2 px-3 rounded-xl font-black text-[10px] uppercase tracking-wider border transition-all ${
                                  selectedItem.status === st
                                    ? st === 'hired' ? 'bg-green-600 text-white border-green-600 shadow-md' :
                                      st === 'interviewing' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' :
                                      st === 'rejected' ? 'bg-red-600 text-white border-red-600 shadow-md' :
                                      'bg-slate-900 text-white border-slate-900 shadow-md'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedItem.message && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cover Note / Message</span>
                            <p className="text-xs font-medium text-slate-700 italic border-l-2 border-primary/40 pl-3 leading-relaxed">
                              "{selectedItem.message}"
                            </p>
                          </div>
                        )}

                        {/* Direct Connectivity */}
                        <div className="flex gap-2">
                          {selectedItem.email && (
                            <a
                              href={`mailto:${selectedItem.email}`}
                              className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                            >
                              <Mail size={14} /> Email
                            </a>
                          )}
                          {selectedItem.phone && (
                            <a
                              href={`https://wa.me/${selectedItem.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-100 transition-all shadow-sm"
                            >
                              <Phone size={14} /> WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Specific Inspector Content for Careers (Jobs) */}
                    {activeTab === 'careers' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">{selectedItem.location || 'Remote'}</span>
                            <span className="text-xs font-black text-primary">{selectedItem.type || 'Full-time'}</span>
                          </div>
                          {selectedItem.salary && (
                            <p className="text-sm font-black text-slate-900">{selectedItem.salary}</p>
                          )}
                        </div>

                        {selectedItem.description && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Description</span>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                              {selectedItem.description}
                            </p>
                          </div>
                        )}

                        {selectedItem.requirements && (
                          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Requirements</span>
                            <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                              {selectedItem.requirements}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-col gap-2 pt-2">
                          <button
                            onClick={() => handleEditJob(selectedItem)}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                          >
                            <PenTool size={16} /> Edit Job Listing
                          </button>
                          <button
                            onClick={(e) => handleShareJob(e, selectedItem.id)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                          >
                            <Share2 size={16} /> Copy Shareable URL
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Standard Inspector Content for Other Tabs */}
                    {activeTab !== 'programs' && activeTab !== 'applications' && activeTab !== 'careers' && (
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 md:p-6 rounded-2xl">
                          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Connectivity</p>
                          <p className="text-[13px] md:text-sm font-black text-slate-900 flex items-center gap-2 truncate">
                            <Mail size={14} className="text-slate-300 flex-shrink-0" /> 
                            <span className="truncate">{selectedItem.email || selectedItem.userEmail || 'N/A'}</span>
                          </p>
                          {(selectedItem.phone || selectedItem.contact) && (
                            <p className="text-[13px] md:text-sm font-bold text-slate-500 mt-2 flex items-center gap-2">
                              <Phone size={14} className="text-slate-300 flex-shrink-0" /> 
                              <span>{selectedItem.phone || selectedItem.contact}</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-primary/5 p-4 md:p-6 rounded-2xl border border-primary/10">
                          <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-2">Internal Context</p>
                          <div className="space-y-3">
                            <p className="text-[13px] md:text-sm font-black text-slate-900 leading-relaxed">
                              {selectedItem.service || selectedItem.position || selectedItem.category || selectedItem.courseTitle || selectedItem.description || 'Platform Member'}
                            </p>
                            
                            <div className="grid grid-cols-1 gap-2 pt-2">
                              {selectedItem.college && (
                                <div className="flex items-start gap-2 text-[11px] md:text-xs">
                                  <span className="text-slate-400 font-bold w-16 flex-shrink-0">College:</span>
                                  <span className="text-slate-700 font-black">{selectedItem.college}</span>
                                </div>
                              )}
                              {selectedItem.branch && (
                                <div className="flex items-start gap-2 text-[11px] md:text-xs">
                                  <span className="text-slate-400 font-bold w-16 flex-shrink-0">Branch:</span>
                                  <span className="text-slate-700 font-black">{selectedItem.branch}</span>
                                </div>
                              )}
                              {selectedItem.city && (
                                <div className="flex items-start gap-2 text-[11px] md:text-xs">
                                  <span className="text-slate-400 font-bold w-16 flex-shrink-0">City:</span>
                                  <span className="text-slate-700 font-black">{selectedItem.city}</span>
                                </div>
                              )}
                              {selectedItem.amount !== undefined && (
                                <div className="flex items-start gap-2 text-[11px] md:text-xs">
                                  <span className="text-slate-400 font-bold w-16 flex-shrink-0">Amount:</span>
                                  <span className="text-slate-700 font-black">₹{selectedItem.amount}</span>
                                </div>
                              )}
                              {(activeTab === 'enrollments' || activeTab === 'transactions') && (
                                <div className="pt-4">
                                  <button 
                                    onClick={() => generateInvoice(selectedItem)}
                                    className="w-full bg-emerald-50 text-emerald-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all"
                                  >
                                    <FileDown size={14} /> Download Invoice
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedItem.message && (
                          <div className="bg-slate-50 p-4 md:p-6 rounded-2xl">
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message Payload</p>
                            <p className="text-[13px] md:text-sm font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4">"{selectedItem.message}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                      <button 
                        onClick={() => requestDelete(selectedItem)} 
                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-red-100 shadow-sm"
                      >
                        <Trash2 size={16} /> Delete Record
                      </button>
                      <button 
                        onClick={() => setSelectedItem(null)} 
                        className="flex-1 border border-slate-200 text-slate-500 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-200 p-12 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="text-slate-300" size={28} />
                    </div>
                    <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Select a record to inspect</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Attendee Management Modal */}
        {viewingAttendeesEventId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingAttendeesEventId(null)} />
            <div className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Event Management</p>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {events.find(e => e.id === viewingAttendeesEventId)?.title} Attendees
                  </h2>
                </div>
                <button 
                  onClick={() => setViewingAttendeesEventId(null)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {eventRegistrations.filter(r => r.eventId === viewingAttendeesEventId).length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">No candidates enrolled for this event yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventRegistrations.filter(r => r.eventId === viewingAttendeesEventId).map((reg) => (
                      <div key={reg.id} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${reg.attended ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-200'}`}>
                            {reg.userName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-sm md:text-base">{reg.userName}</h4>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 italic">{reg.userEmail}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                          {/* Attendance Toggle */}
                          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${reg.attended ? 'text-primary' : 'text-slate-400'}`}>
                              {reg.attended ? 'Attended' : 'Mark Absence'}
                            </span>
                            <button 
                              onClick={() => handleToggleAttendance(reg)}
                              className={`w-12 h-6 flex items-center p-1 rounded-full transition-all duration-300 ${reg.attended ? 'bg-primary' : 'bg-slate-200'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${reg.attended ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                          </div>

                          {/* Certification Action */}
                          {reg.attended && (
                            reg.certificateIssued ? (
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest italic">
                                  <Award size={14} /> Issued
                                </div>
                                <button 
                                  onClick={() => {
                                    const cert = issuedCertificates.find(c => c.eventId === viewingAttendeesEventId && c.userEmail === reg.userEmail);
                                    if (cert) generateCertificatePDF(cert);
                                    else alert("Certificate record not found in system.");
                                  }}
                                  className="p-2.5 bg-slate-100 text-slate-400 hover:text-primary hover:bg-white rounded-xl transition-all shadow-sm"
                                  title="Re-download"
                                >
                                  <FileDown size={14} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handleIssueAttendeeCertificate(reg, events.find(e => e.id === viewingAttendeesEventId))}
                                disabled={isProcessing === reg.id}
                                className={`flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:shadow-lg transition-all active:scale-95 ${isProcessing === reg.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {isProcessing === reg.id ? <Activity className="animate-spin" size={14} /> : <Award size={14} />} 
                                {isProcessing === reg.id ? 'Issuing...' : 'Issue Certificate'}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center italic">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Only ATTENDED candidates qualify for certificates</span>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-primary rounded-full" />
                     <span className="text-[10px] font-black text-slate-600 uppercase">
                       {eventRegistrations.filter(r => r.eventId === viewingAttendeesEventId && r.attended).length} Attended
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                     <span className="text-[10px] font-black text-slate-600 uppercase">
                       {eventRegistrations.filter(r => r.eventId === viewingAttendeesEventId && r.certificateIssued).length} Certified
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
                <Trash2 size={26} />
              </div>
              <h3 className="text-xl font-black text-slate-900 text-center tracking-tight mb-2">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-500 text-center font-medium leading-relaxed mb-6">
                Are you sure you want to permanently delete <span className="font-bold text-slate-900">"{deleteConfirm.label}"</span> from <span className="font-bold text-primary uppercase">{deleteConfirm.collection}</span>? This action cannot be reversed.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={!!isProcessing}
                  className="flex-1 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={!!isProcessing}
                  className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toast Notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-[130] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white font-bold text-xs md:text-sm animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'error' ? 'bg-red-600 shadow-red-600/30' :
            toast.type === 'info' ? 'bg-blue-600 shadow-blue-600/30' :
            'bg-slate-900 shadow-slate-900/30'
          }`}>
            {toast.type === 'error' ? <AlertTriangle size={18} className="text-red-200 shrink-0" /> : <CheckCircle size={18} className="text-emerald-400 shrink-0" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 p-1 hover:bg-white/20 rounded-lg text-white/80 transition-colors">
              <X size={14} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
