
import React, { useState, useEffect } from 'react';
import { type User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { programsList } from '../src/constants';
import { 
  User as UserIcon, Mail, Phone, School, GitBranch, 
  Save, Loader2, CheckCircle2, Camera, LogOut, ChevronLeft,
  BookOpen, Clock, ArrowRight, Globe, FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProfilePageProps {
  user: User;
  setView: (view: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, setView }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<any>({
    fullName: '',
    contact: '',
    altContact: '',
    college: '',
    branch: '',
    city: '',
    photoURL: ''
  });
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfileData(userDoc.data());
        }

        // Fetch enrollments
        const enrollmentsRef = collection(db, "enrollments");
        const q = query(enrollmentsRef, where("userId", "==", user.uid), where("status", "==", "paid"));
        const querySnapshot = await getDocs(q);
        const enrollmentsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEnrollments(enrollmentsData);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...profileData,
        updatedAt: new Date()
      }, { merge: true });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const generateInvoice = (enrollment: any, course: any) => {
    const doc = new jsPDF();
    const date = enrollment.createdAt?.toDate ? enrollment.createdAt.toDate() : new Date();
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
    doc.text(enrollment.userName || profileData.fullName || "Student", 14, 58);
    doc.text(user.email || "", 14, 64);
    if (profileData.contact) doc.text(profileData.contact, 14, 70);

    // Table
    autoTable(doc, {
      startY: 85,
      head: [['Description', 'Mode', 'Amount']],
      body: [
        [
          course.title,
          enrollment.learningMode?.toUpperCase() || 'ONLINE',
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
    doc.text("Total Amount Paid:", 120, finalY + 20);
    doc.text(`INR ${amount.toLocaleString()}`, 190, finalY + 20, { align: 'right' });

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    const footerText = "This is a computer-generated invoice and does not require a physical signature. For any queries, please contact support@edusculptor.com";
    const splitFooter = doc.splitTextToSize(footerText, 180);
    doc.text(splitFooter, 14, finalY + 50);

    doc.save(`Invoice_${invoiceNo}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-16 md:pb-24 bg-bg-light animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button 
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-black text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-8 transition-colors"
        >
          <ChevronLeft size={14} className="md:w-4 md:h-4" /> Back to Home
        </button>

        {/* Profile Settings Section */}
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-slate-900 p-8 md:p-12 text-white text-center">
            <div className="relative inline-block mb-6 md:mb-8 group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] bg-slate-800 overflow-hidden border-4 border-slate-800 shadow-2xl mx-auto">
                <img 
                  src={profileData.photoURL || `https://ui-avatars.com/api/?name=${profileData.fullName}&background=5252ff&color=fff`} 
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                <Camera size={14} className="md:w-4 md:h-4" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-black mb-1">{profileData.fullName}</h2>
            <p className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-widest mb-6 md:mb-8">{profileData.role || 'Student'}</p>
            
            <div className="space-y-3 md:space-y-4 text-left">
              <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4">
                <Mail className="text-slate-500" size={16} />
                <span className="text-[10px] md:text-xs font-bold text-slate-300 truncate">{user.email}</span>
              </div>
              <div className="bg-white/5 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4">
                <Phone className="text-slate-500" size={16} />
                <span className="text-[10px] md:text-xs font-bold text-slate-300">{profileData.contact || 'No contact'}</span>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="md:w-2/3 p-8 md:p-12 lg:p-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Profile Settings</h3>
              {success && (
                <div className="flex items-center gap-2 text-green-500 font-black text-[10px] md:text-xs uppercase tracking-widest animate-in zoom-in">
                  <CheckCircle2 size={14} className="md:w-4 md:h-4" /> Changes Saved
                </div>
              )}
            </div>

            <form onSubmit={handleUpdate} className="space-y-6 md:space-y-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Full Name</label>
                  <div className="relative group w-full flex items-center">
                    <UserIcon className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.fullName}
                      onChange={e => setProfileData({...profileData, fullName: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Profile Photo URL</label>
                  <div className="relative group w-full flex items-center">
                    <Camera className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.photoURL}
                      onChange={e => setProfileData({...profileData, photoURL: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">College / Institution</label>
                  <div className="relative group w-full flex items-center">
                    <School className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.college}
                      onChange={e => setProfileData({...profileData, college: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Branch / Stream</label>
                  <div className="relative group w-full flex items-center">
                    <GitBranch className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.branch}
                      onChange={e => setProfileData({...profileData, branch: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">City</label>
                <div className="relative group w-full flex items-center">
                  <Globe className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                  <input 
                    value={profileData.city}
                    onChange={e => setProfileData({...profileData, city: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 pt-4 md:pt-6 text-left">
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Primary Contact</label>
                  <div className="relative group w-full flex items-center">
                    <Phone className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.contact}
                      onChange={e => setProfileData({...profileData, contact: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block text-left">Alt Contact (Optional)</label>
                  <div className="relative group w-full flex items-center">
                    <Phone className="absolute left-4 text-slate-300 group-focus-within:text-primary transition-colors opacity-50 pointer-events-none z-10" size={18} />
                    <input 
                      value={profileData.altContact}
                      onChange={e => setProfileData({...profileData, altContact: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-sm text-slate-700 transition-all shadow-sm block text-left"
                    />
                  </div>
                </div>
              </div>

              <button 
                disabled={saving}
                type="submit"
                className="w-full bg-primary text-white py-5 md:py-6 rounded-2xl md:rounded-[2rem] font-black text-base md:text-lg hover:bg-primary-dark shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" /> : <><Save size={18} className="md:w-5 md:h-5" /> Update My Profile</>}
              </button>
            </form>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        <div className="mt-12 md:mt-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Enrolled Courses</h3>
            <span className="px-3 py-1 md:px-4 md:py-1.5 bg-primary/10 text-primary rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest">
              {profileData.enrolledCourses?.length || 0} Active Programs
            </span>
          </div>

          {profileData.enrolledCourses && profileData.enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {programsList
                .filter(course => {
                  const enrolledCourses = profileData.enrolledCourses || [];
                  return enrolledCourses.some((ec: any) => 
                    (typeof ec === 'string' ? ec === course.id : ec.id === course.id)
                  );
                })
                .map(course => {
                  const enrollment = enrollments.find(e => e.courseId === course.id);
                  const userCourseData = (profileData.enrolledCourses || []).find((ec: any) => 
                    (typeof ec === 'string' ? ec === course.id : ec.id === course.id)
                  );
                  
                  // Use enrollment data if available, otherwise fallback to user profile data
                  const paidAmount = enrollment?.amount || (enrollment?.paidAmount ?? (typeof userCourseData === 'object' ? userCourseData.paidAmount : 0));
                  const totalAmount = enrollment?.amount || enrollment?.totalAmount || enrollment?.totalFee || (typeof userCourseData === 'object' ? (userCourseData.totalAmount || userCourseData.totalFee) : 0) || course.pricing.online;
                  let remainingAmount = (totalAmount - paidAmount);
                  
                  // Fix NaN if it exists
                  if (isNaN(remainingAmount)) {
                    remainingAmount = 0;
                  }

                  const paymentStatus = enrollment?.status === 'paid' ? 'fully_paid' : (remainingAmount <= 0 ? 'fully_paid' : 'partially_paid');

                  return (
                    <motion.div 
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
                    >
                      <div className="flex gap-4 md:gap-6 items-start mb-6 md:mb-8">
                        <img src={course.img} alt={course.title} className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl object-cover shadow-lg" />
                        <div>
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1.5 md:mb-2">
                            {course.category}
                          </span>
                          <h4 className="text-lg md:text-xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                            {course.title}
                          </h4>
                        </div>
                      </div>
                      
                      {(enrollment || typeof userCourseData === 'object') && (
                        <div className="bg-slate-50 rounded-xl md:rounded-2xl p-4 mb-6 space-y-2">
                          <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span>Payment Status</span>
                            <span className={paymentStatus === 'fully_paid' || remainingAmount <= 0 ? "text-emerald-500" : "text-orange-500"}>
                              {paymentStatus === 'fully_paid' || remainingAmount <= 0 ? "Fully Paid" : 
                               (paymentStatus === 'partially_paid' ? "Partially Paid" : (paymentStatus as string).replace('_', ' '))}
                            </span>
                          </div>
                          <div className="flex justify-between text-[11px] md:text-xs font-bold text-slate-700">
                            <span>Paid Amount</span>
                            <span>₹{paidAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock size={14} className="md:w-4 md:h-4" />
                            <span className="text-[11px] md:text-xs font-bold">{course.duration}</span>
                          </div>
                          {enrollment && (
                            <button 
                              onClick={() => generateInvoice(enrollment, course)}
                              className="flex items-center gap-1.5 text-emerald-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:text-emerald-600 transition-all"
                            >
                              <FileDown size={14} /> Invoice
                            </button>
                          )}
                        </div>
                        <button 
                          onClick={() => setView('services')}
                          className="flex items-center gap-2 text-primary font-black text-[10px] md:text-xs uppercase tracking-widest hover:gap-3 transition-all"
                        >
                          View Services <ArrowRight size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 text-center border-2 border-dashed border-slate-100">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="text-slate-300 md:w-8 md:h-8" size={28} />
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-900 mb-2">No active enrollments</h4>
              <p className="text-sm md:text-base text-slate-500 font-medium mb-8">You haven't requested any services or enrollments yet. Discover our solutions!</p>
              <button 
                onClick={() => setView('services')}
                className="bg-primary text-white px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm hover:bg-primary-dark transition-all shadow-xl shadow-primary/20"
              >
                Explore Services
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
