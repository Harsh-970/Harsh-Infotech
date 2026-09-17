import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by RootErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070b13] text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full glass-card p-8 sm:p-10 text-center rounded-3xl border border-[#D4AF37]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              {this.props.fallbackTitle || 'Something Went Wrong'}
            </h2>

            <p className="text-sm text-white/60 leading-relaxed mb-8">
              We encountered an unexpected display issue. Please reload the page or return to the homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E8C0] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.25)]"
              >
                <RefreshCw className="w-4 h-4" /> Reload Page
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 px-5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" /> Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
