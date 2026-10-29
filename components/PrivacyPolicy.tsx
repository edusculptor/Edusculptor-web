
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Database, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Markdown from 'react-markdown';

const PrivacyPolicy: React.FC = () => {
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const q = query(collection(db, "policies"), where("type", "==", "privacy"), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPolicy(snapshot.docs[0].data());
        }
      } catch (err) {
        console.error("Error fetching policy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-bg-light min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">{policy?.title || 'Privacy Policy'}</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                {policy?.updatedAt ? `Last updated on ${policy.updatedAt}` : 'Last updated on 19-03-2026'}
              </p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none space-y-8 text-slate-600 font-medium leading-relaxed">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : policy ? (
              <div className="markdown-body">
                <Markdown>{policy.content}</Markdown>
              </div>
            ) : (
              <>
                <p>
                  This Privacy Policy describes how EDUSCULPTOR (“we”, “us”, or “our”) collects, uses, and shares your personal information when you use our website and services.
                </p>

                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-500" />
                    Information We Collect
                  </h3>
                  <p>
                    We collect information you provide directly to us, such as when you create an account or contact us for support. This may include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Name and contact information (email, phone number)</li>
                    <li>Profile information and academic details</li>
                    <li>Communications you send to us</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-emerald-500" />
                    How We Use Your Information
                  </h3>
                  <p>
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your requests and send related information</li>
                    <li>Send you technical notices, updates, and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Communicate with you about products, services, and events</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-500" />
                    Data Security
                  </h3>
                  <p>
                    We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Third-Party Sharing
                  </h3>
                  <p>
                    We do not share your personal information with third parties except as described in this policy. We may share information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Service providers who perform services on our behalf</li>
                    <li>To comply with legal obligations or protect our rights</li>
                  </ul>
                </section>
              </>
            )}

            <p className="pt-8 border-t border-slate-100 text-sm text-slate-400">
              If you have any questions about this Privacy Policy, please contact us at support@edusculptor.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
