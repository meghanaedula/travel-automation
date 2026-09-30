import React from 'react';
import { Send, Cpu, FileText, CheckCircle2, Shield, Network } from 'lucide-react';

export const WorkflowExplainer: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Intake Ingestion & Field Mapping',
      description:
        'Parameters are sanitized and transmitted via HTTPS multipart payload into Meghana’s n8n Form Trigger node, capturing traveler names, date bounds, budget quotas, and group headcount.',
      specs: 'field-0 to field-5 · HTTPS TLS 1.3 · <60ms dispatch',
    },
    {
      num: '02',
      title: 'Autonomous Travel Agent Processing',
      description:
        'The n8n workflow executes downstream automation branches: routing traveler coordinates against global airfare benchmarks, accommodation categories, and seasonal pacing.',
      specs: 'n8n Cloud Execution · Dynamic Branching · Cost Optimization',
    },
    {
      num: '03',
      title: 'Personalized Day-by-Day Synthesis',
      description:
        'The system generates a custom day-by-day travel roadmap tailored strictly to the specified budget envelope, including daily morning, afternoon, and evening activities.',
      specs: 'Day-by-day pacing · Curated Dining · Transit Links',
    },
    {
      num: '04',
      title: 'Direct Client Dispatch & Status Sync',
      description:
        'The finalized travel plan is formatted and automatically dispatched to the traveler’s email address, closing the intake loop with zero manual intervention required.',
      specs: 'Automated Email Node · Instant Receipt · Status 200 OK',
    },
  ];

  return (
    <section id="workflow" className="py-16 lg:py-24 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500 mb-3 uppercase tracking-wider">
            <span>03</span>
            <span>/</span>
            <span>Architecture</span>
            <span>/</span>
            <span className="text-amber-700 font-semibold">Autonomous Workflow</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-4 [text-wrap:balance]">
            How The Travelling Agent Pipeline Operates
          </h2>
          <p className="text-stone-600 text-base leading-relaxed">
            Behind this client portal sits a multi-stage n8n automation engine configured to eliminate
            hours of manual itinerary research.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="font-display text-3xl font-bold text-amber-600 mb-4 font-mono">
                  {step.num}.
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 text-[11px] font-mono text-stone-500">
                {step.specs}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
