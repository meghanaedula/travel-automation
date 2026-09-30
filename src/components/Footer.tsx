import React from 'react';
import { Globe, ArrowUp } from 'lucide-react';
import { DEFAULT_PRODUCTION_URL } from '../types';

interface FooterProps {
  onOpenMonitor: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMonitor, onScrollToTop }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800/80">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <span className="font-display text-base font-bold text-white tracking-tight">
              Voyage<span className="text-amber-400">AI</span>
            </span>
            <span className="text-stone-600 font-mono text-[11px] ml-2">
              Autonomous Travel Concierge
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 text-stone-300">
            <a href="#planner" className="hover:text-amber-400 transition-colors">
              Trip Planner
            </a>
            <a href="#destinations" className="hover:text-amber-400 transition-colors">
              Destinations
            </a>
            <a href="#workflow" className="hover:text-amber-400 transition-colors">
              Architecture
            </a>
            <button
              onClick={onOpenMonitor}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              n8n Webhook Console
            </button>
            <a
              href={DEFAULT_PRODUCTION_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              n8n Cloud Form ↗
            </a>
          </div>

          {/* Back to top */}
          <button
            onClick={onScrollToTop}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Return to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px] font-mono">
          <p>© {new Date().getFullYear()} VoyageAI · Connected to edulameghana19.app.n8n.cloud</p>
          <div className="flex items-center gap-4">
            <span>TLS 1.3 Verified</span>
            <span>·</span>
            <span>n8n Travelling Agent Trigger</span>
            <span>·</span>
            <span>Status 200 OK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
