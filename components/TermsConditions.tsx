
import React, { useState, useEffect } from 'react';
import { FileText, Shield, Scale, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Markdown from 'react-markdown';

const TermsConditions: React.FC = () => {
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const q = query(collection(db, "policies"), where("type", "==", "terms"), limit(1));
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
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">{policy?.title || 'Terms & Conditions'}</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                {policy?.updatedAt ? `Last updated on ${policy.updatedAt}` : 'Last updated on 18-03-2026 00:24:28'}
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
                  These Terms and Conditions, along with privacy policy or other terms (“Terms”) constitute a binding agreement by and between EDUSCULPTOR, ( “Website Owner” or “we” or “us” or “our”) and you (“you” or “your”) and relate to your use of our website, goods (as applicable) or services (as applicable) (collectively, “Services”).
                </p>

                <p>
                  By using our website and availing the Services, you agree that you have read and accepted these Terms (including the Privacy Policy). We reserve the right to modify these Terms at any time and without assigning any reason. It is your responsibility to periodically review these Terms to stay informed of updates.
                </p>

                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-primary" />
                  Terms of Use
                </h3>

                <ul className="space-y-4 list-none pl-0">
                  {[
                    "To access and use the Services, you agree to provide true, accurate and complete information to us during and after registration, and you shall be responsible for all acts done through the use of your registered account.",
                    "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials offered on this website or through the Services, for any specific purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
                    "Your use of our Services and the website is solely at your own risk and discretion. You are required to independently assess and ensure that the Services meet your requirements.",
                    "The contents of the Website and the Services are proprietary to Us and you will not have any authority to claim any intellectual property rights, title, or interest in its contents.",
                    "You acknowledge that unauthorized use of the Website or the Services may lead to action against you as per these Terms or applicable laws.",
                    "You agree to pay us the charges associated with availing the Services.",
                    "You agree not to use the website and/ or Services for any purpose that is unlawful, illegal or forbidden by these Terms, or Indian or local laws that might apply to you.",
                    "You agree and acknowledge that website and the Services may contain links to other third party websites. On accessing these links, you will be governed by the terms of use, privacy policy and such other policies of such third party websites.",
                    "You understand that upon initiating a transaction for availing the Services you are entering into a legally binding and enforceable contract with the us for the Services.",
                    "Notwithstanding anything contained in these Terms, the parties shall not be liable for any failure to perform an obligation under these Terms if performance is prevented or delayed by a force majeure event.",
                    "These Terms and any dispute or claim relating to it, or its enforceability, shall be governed by and construed in accordance with the laws of India.",
                    "All disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in nagpur, Maharashtra",
                    "All concerns or communications relating to these Terms must be communicated to us using the contact information provided on this website."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="mt-1.5"><div className="w-2 h-2 bg-primary rounded-full" /></div>
                      <p>{item}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
