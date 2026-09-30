import React from 'react';
import { Sparkles, Globe, Activity } from 'lucide-react';
import { WebhookCheckResult } from '../types';

interface NavbarProps {
  endpointStatus: WebhookCheckResult | null;
  currentMode: 'production' | 'test' | 'custom';
  onOpenMonitor: () => void;
  onScrollToForm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  endpointStatus,
  currentMode,
  onOpenMonitor,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900/90 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Globe className="w-4 h-4 text-amber-400" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Voyage<span className="text-amber-400">AI</span>
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a
            href="#planner"
            onClick={(e) => {
              e.preventDefault();
              onScrollToForm();
            }}
            className="hover:text-amber-400 transition-colors"
          >
            Trip Planner
          </a>
          <a href="#destinations" className="hover:text-amber-400 transition-colors">
            Destinations
          </a>
          <a href="#workflow" className="hover:text-amber-400 transition-colors">
            How It Works
          </a>
          <button
            onClick={onOpenMonitor}
            className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>n8n Console</span>
            {endpointStatus?.ok ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
            ) : endpointStatus?.isWaitingExecution ? (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-stone-500" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMonitor}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-stone-700 bg-stone-800/80 text-stone-300 hover:border-stone-600 hover:text-white transition-colors"
            title="Inspect n8n Webhook connection"
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{currentMode}</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                endpointStatus?.ok
                  ? 'bg-emerald-400'
                  : endpointStatus?.isWaitingExecution
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            />
          </button>

          <button
            onClick={onScrollToForm}
            className="px-4 py-2 text-xs font-medium text-stone-900 bg-amber-400 rounded-lg hover:bg-amber-300 active:scale-95 transition-all shadow-sm font-sans whitespace-nowrap cursor-pointer"
          >
            Plan Your Journey
          </button>
        </div>
      </div>
    </header>
  );
};
