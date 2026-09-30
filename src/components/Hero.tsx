import React from 'react';
import { ArrowDown, CheckCircle2, Zap, ShieldCheck, Cpu } from 'lucide-react';
import heroImage from '../assets/images/hero_automation_workspace_1790759350245.jpg';

interface HeroProps {
  onScrollToForm: () => void;
  onOpenMonitor: () => void;
  isN8nLive: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToForm, onOpenMonitor, isN8nLive }) => {
  return (
    <section className="relative overflow-hidden bg-stone-900 text-stone-100 pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-stone-800">
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition and Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Meta indicator */}
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 mb-6 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Autonomous Travelling Agent</span>
              <span className="text-stone-600">/</span>
              <span>n8n Cloud Workflow Live</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6 [text-wrap:balance]">
              Bespoke Journeys, Curated by Intelligent Travel Automation
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl mb-8">
              Submit your dates, budget, and travel party. Our autonomous n8n agent orchestrates
              global flight matrices, curated stays, and day-by-day itineraries—delivered directly to
              your inbox within moments.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onScrollToForm}
                className="px-6 py-3.5 text-sm font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-98 rounded-lg transition-all shadow-md flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Trip Intake Portal</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onOpenMonitor}
                className="px-5 py-3.5 text-sm font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-lg border border-stone-700/80 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Inspect n8n Payload</span>
              </button>
            </div>

            {/* Proof & Trust Markers */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">&lt;60s</p>
                <p className="text-xs text-stone-400 mt-0.5">Automated Intake</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">100%</p>
                <p className="text-xs text-stone-400 mt-0.5">Budget Customization</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums">200 OK</p>
                <p className="text-xs text-stone-400 mt-0.5">n8n Cloud Webhook</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Container with Fallback */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 shadow-2xl group">
              {/* Media Container with Fallback */}
              <div className="aspect-[4/3] sm:aspect-[16/10] relative w-full overflow-hidden bg-gradient-to-tr from-stone-900 via-stone-850 to-stone-800">
                <img
                  src={heroImage}
                  alt="Modern travel automation operations workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 opacity-90"
                  onError={(e) => {
                    // Resilient CSS Fallback if image path issues arise
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                {/* Measured Scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
              </div>

              {/* Inset overlay card showing live agent parameters */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-stone-900/90 backdrop-blur-md border border-stone-700/60 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-amber-400 flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    Agent Node: travelling agent
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                    n8n.cloud Active
                  </span>
                </div>
                <p className="text-stone-300 text-xs leading-relaxed">
                  Endpoint schema: <code className="text-stone-400 font-mono">field-0</code> (Name), <code className="text-stone-400 font-mono">field-1</code> (Email), <code className="text-stone-400 font-mono">field-2..3</code> (Dates), <code className="text-stone-400 font-mono">field-4</code> (Budget), <code className="text-stone-400 font-mono">field-5</code> (Travelers).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
