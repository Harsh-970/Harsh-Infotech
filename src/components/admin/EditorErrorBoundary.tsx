import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export interface EditorErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

export interface EditorErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class EditorErrorBoundary extends React.Component<EditorErrorBoundaryProps, EditorErrorBoundaryState> {
  state: EditorErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<EditorErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EditorErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] p-8 bg-[#0b1329] border border-red-500/30 rounded-2xl text-white flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-xl font-bold text-white">
              {this.props.fallbackTitle || 'Component Render Failed'}
            </h2>
            <p className="text-xs text-white/60">
              The editor encountered a runtime error while trying to render this webpage component.
            </p>
          </div>

          {this.state.error && (
            <div className="w-full max-w-lg p-4 bg-black/60 border border-white/10 rounded-xl text-left font-mono text-[11px] text-red-300 overflow-x-auto max-h-40">
              <div className="font-bold text-red-400 mb-1">{this.state.error.name}: {this.state.error.message}</div>
              {this.state.error.stack && (
                <pre className="text-[10px] text-white/40 whitespace-pre-wrap">{this.state.error.stack}</pre>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" /> Retry Loading Component
            </button>

            {this.props.onReset && (
              <button
                onClick={this.props.onReset}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a830] text-black font-extrabold rounded-xl text-xs flex items-center gap-2 transition-all shadow"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Blueprint
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
