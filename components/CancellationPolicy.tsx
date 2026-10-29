
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Markdown from 'react-markdown';

const CancellationPolicy: React.FC = () => {
  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const q = query(collection(db, "policies"), where("type", "==", "cancellation"), limit(1));
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900">{policy?.title || 'Cancellation & Refund Policy'}</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">
                {policy?.updatedAt ? `Last updated on ${policy.updatedAt}` : 'Last updated on 18-03-2026 00:28:21'}
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
                <p className="text-lg">
                  EDUSCULPTOR believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. Under this policy:
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 bg-primary rounded-full" /></div>
                    <p>
                      Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 bg-primary rounded-full" /></div>
                    <p>
                      EDUSCULPTOR does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 bg-primary rounded-full" /></div>
                    <p>
                      In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 7 Days days of receipt of the products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 Days days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1.5"><div className="w-2 h-2 bg-primary rounded-full" /></div>
                    <p>
                      In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them. In case of any Refunds approved by the EDUSCULPTOR, it’ll take 3-5 Days days for the refund to be processed to the end customer.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 flex gap-4">
              <AlertCircle className="text-primary w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-black text-slate-900 mb-2">Need Help?</h4>
                <p className="text-sm">If you have any questions about our Cancellation and Refund Policy, please contact our support team at info@edusculptor.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
