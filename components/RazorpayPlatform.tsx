import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ArrowLeft, Loader2, 
  Lock, CheckCircle2, AlertCircle, Zap, Smartphone, Mail, User
} from 'lucide-react';

interface RazorpayPlatformProps {
  paymentData: {
    amount: number;
    title: string;
    description: string;
    type: 'service' | 'program';
    metadata: {
      fullName: string;
      email: string;
      phone: string;
      [key: string]: any;
    };
    onSuccess: (paymentId: string, orderId: string) => Promise<void>;
    onCancel: () => void;
  } | null;
  setView: (view: any) => void;
}

const RazorpayPlatform: React.FC<RazorpayPlatformProps> = ({ paymentData, setView }) => {
  if (!paymentData) {
    return (
      <div className="min-h-screen bg-[#f5f8fc] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Retrieving secure transaction data...</p>
        </div>
      </div>
    );
  }

  const { amount, title, description, metadata, onSuccess, onCancel } = paymentData;

  // Dynamically load Razorpay SDK for real money transaction gateways
  useEffect(() => {
    const scriptId = 'razorpay-checkout-sdk-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const [realOrder, setRealOrder] = useState<any>(null);
  const [isCreatingRealOrder, setIsCreatingRealOrder] = useState(false);
  const [realOrderError, setRealOrderError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initRealOrder = async () => {
      setIsCreatingRealOrder(true);
      setRealOrderError('');
      try {
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            receipt: `rcpt_${Date.now().toString().substring(5)}`
          })
        });

        if (!response.ok) {
          const text = await response.text();
          let msg = 'Failed to instantiate live Razorpay order';
          try {
            const parsed = JSON.parse(text);
            if (parsed.error) msg = parsed.error;
          } catch(e) {}
          throw new Error(msg);
        }

        const data = await response.json();
        setRealOrder(data);
      } catch (err: any) {
        console.error("Failed to fetch live Razorpay order:", err);
        setRealOrderError(err.message || String(err));
      } finally {
        setIsCreatingRealOrder(false);
      }
    };

    if (amount) {
      initRealOrder();
    }
  }, [amount]);

  const handleRealSecurePayment = () => {
    if (isCreatingRealOrder) {
      setError("Please wait, preparing live secure gateway order...");
      return;
    }

    if (!realOrder) {
      setError(realOrderError || "Live order creation pending or unavailable. Try refreshing the gateway session.");
      return;
    }

    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_Su5bpoMbPxCkob',
        amount: realOrder.amount,
        currency: realOrder.currency || 'INR',
        name: 'EDUSCULPTOR',
        description: description || title,
        image: `${window.location.origin}/logo.png`,
        order_id: realOrder.id,
        handler: async function (response: any) {
          setLoading(true);
          try {
            await onSuccess(response.razorpay_payment_id, realOrder.id);
          } catch (err: any) {
            setError(err.message || 'Verification of live transaction failed.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: metadata.fullName || '',
          email: metadata.email || '',
          contact: metadata.phone || ''
        },
        theme: {
          color: '#2563EB'
        },
        modal: {
          ondismiss: function () {
            console.log('Real payment gateway panel closed.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error("Real payment gateway failure event:", resp.error);
        setError(resp.error.description || 'Transaction cancelled or rejected.');
      });
      rzp.open();
    } catch (sdkError: any) {
      console.error("Failed to render official Razorpay popover:", sdkError);
      setError("Official Razorpay Checkout cannot be launched in this browser state due to iframe restrictions. Please proceed using direct checkout button.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f8fc] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 select-none font-sans">
      
      {/* Top logo header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-600 w-5 h-5 animate-pulse" />
          <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">Razorpay Live Gateway Channel</span>
        </div>
        <button 
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Cancel Payment
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-[500px]">
        {/* Brand Banner */}
        <div className="bg-[#121c2f] p-6 px-7 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-wider text-white">EDUSCULPTOR</span>
              <span className="text-[8px] font-black bg-blue-600 text-blue-100 px-1.5 py-0.5 rounded uppercase tracking-widest">LIVE TRANSACTIONS ONLY</span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center gap-1">
              <Lock size={10} className="text-emerald-400" /> Authorized Checkout Platform
            </p>
          </div>
          <div className="text-right">
            <span className="text-[8px] uppercase font-bold text-[#3b82f6] bg-blue-950 px-2.5 py-0.5 rounded-full tracking-wider border border-blue-900">WAITING</span>
            <p className="text-xl font-black text-[#3b82f6] mt-0.5">₹{amount.toLocaleString()}</p>
          </div>
        </div>

        {/* Selected Product info */}
        <div className="bg-[#fafbff] p-4.5 px-7 border-b border-slate-100 flex justify-between items-center text-xs text-slate-600">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Plan / Program Name</span>
            <h4 className="font-bold text-slate-800">{title}</h4>
          </div>
          <div className="text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Currency</span>
            <p className="font-bold text-slate-800">INR (₹)</p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="px-7 py-3 bg-red-50 text-red-650 text-xs font-bold border-b border-red-100 flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* SECURE DIRECT PAYMENT FORM */}
        <div className="p-7 flex-grow flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Customer Details Summary */}
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Customer Contact Specifications</span>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <User size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{metadata.fullName || "Valued Client"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{metadata.email || "No email specified"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <Smartphone size={14} className="text-slate-400 shrink-0" />
                  <span>{metadata.phone || "No primary contact number"}</span>
                </div>
              </div>
            </div>

            {/* Official Order Status Panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5 text-center">
              <div className="mx-auto w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100">
                <Lock size={18} />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-widest leading-none">Official Payment Platform</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2 max-w-[280px] mx-auto">
                  Accepts live credits/debits, Netbanking, instant UPI, and registered wallets directly through native Razorpay secure frames.
                </p>
              </div>

              {isCreatingRealOrder ? (
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50/30 py-2.5 rounded-xl border border-blue-105 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                  Generating Secure Order Tokens...
                </div>
              ) : realOrder ? (
                <div className="bg-emerald-50 text-emerald-800 text-[10px] font-black border border-emerald-100 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 select-text">
                  <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                  Secure Order ID: {realOrder.id}
                </div>
              ) : (
                <div className="bg-amber-50 text-amber-800 text-[9px] font-bold border border-amber-100 py-2.5 px-3 rounded-xl leading-snug">
                  {realOrderError ? `Connection update: ${realOrderError}` : "Retrieving integration response keys..."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 space-y-3.5">
            <button
              type="button"
              disabled={isCreatingRealOrder || !realOrder || loading}
              onClick={handleRealSecurePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Verifying gateway session...
                </>
              ) : (
                <>
                  <Zap size={12} className="fill-current text-yellow-300" /> Pay Live via Razorpay Secure
                </>
              )}
            </button>
            
            <p className="text-[8.5px] text-slate-400 text-center font-bold tracking-tight uppercase">
              🛡️ Protected and fully encrypted by official live Razorpay API protocols
            </p>
          </div>
        </div>

        {/* Secure Footer Bar */}
        <div className="bg-[#fafbff] p-3 px-6 border-t border-slate-100 text-center text-[9px] text-slate-400 font-semibold tracking-wide flex items-center justify-center gap-2 shrink-0 select-none">
          <span className="border-r border-slate-200 pr-2">VERIFIED LIVE LINK</span>
          <span className="border-r border-slate-200 pr-2">128-BIT ENCRYPTION</span>
          <span>POWERED BY RAZORPAY</span>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPlatform;
