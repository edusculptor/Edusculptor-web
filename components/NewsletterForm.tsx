
import React, { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface NewsletterFormProps {
  variant?: 'light' | 'dark' | 'primary';
  buttonText?: string;
  placeholder?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  variant = 'dark', 
  buttonText = 'Get Early Access',
  placeholder = 'Enter your email'
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setStatus(null);

    try {
      const emailId = email.toLowerCase().trim();
      const docRef = doc(db, 'subscribers', emailId);
      
      let docSnap;
      try {
        docSnap = await getDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `subscribers/${emailId}`);
        return;
      }
      
      if (docSnap.exists()) {
        setStatus({ type: 'success', msg: 'You are already subscribed!' });
        setEmail('');
        setLoading(false);
        return;
      }

      try {
        await setDoc(docRef, {
          email: emailId,
          subscribedAt: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `subscribers/${emailId}`);
        return;
      }
      
      setStatus({ type: 'success', msg: 'Thank you for subscribing!' });
      setEmail('');
    } catch (error: any) {
      console.error('Subscription error:', error);
      let errorMsg = 'Failed to subscribe. Please try again.';
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error) errorMsg += ` (${parsed.error})`;
      } catch (e) {
        // Not a JSON error
      }
      setStatus({ type: 'error', msg: errorMsg });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const inputClasses = variant === 'primary' 
    ? "flex-grow pl-14 pr-6 sm:pr-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-blue-100/50 font-bold focus:border-white outline-none transition-all text-sm sm:text-base shadow-sm"
    : "w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white transition-all text-sm shadow-sm";

  const buttonClasses = variant === 'primary'
    ? "bg-white text-primary px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg hover:bg-blue-50 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
    : "w-full bg-primary hover:bg-primary-dark text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-primary/20 text-sm flex items-center justify-center gap-2";

  return (
    <form onSubmit={handleSubscribe} className={variant === 'primary' ? "flex flex-col sm:flex-row items-stretch sm:items-center gap-4" : "flex flex-col gap-3"}>
      <div className="relative group flex-grow flex items-center">
        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors pointer-events-none" size={20} />
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder} 
          className={inputClasses + " leading-none"}
        />
      </div>
      <button 
        disabled={loading}
        className={buttonClasses}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
      </button>
      {status && (
        <p className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {status.msg}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm;
