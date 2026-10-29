
import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let isFirestoreError = false;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Firestore Access Denied: ${parsed.operationType} at ${parsed.path || 'unknown path'}`;
            isFirestoreError = true;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-[#f3f5f9] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ShieldAlert size={40} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">System Interruption</h1>
            <div className="bg-slate-50 p-6 rounded-2xl mb-8 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Error Context</p>
              <p className="text-sm font-bold text-slate-600 leading-relaxed">
                {errorMessage}
              </p>
              {isFirestoreError && (
                <p className="mt-4 text-[10px] font-bold text-red-400 italic">
                  Tip: This usually means your account doesn't have permission to access this data.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all"
              >
                <RefreshCcw size={18} /> Reload Application
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"
              >
                <Home size={18} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
