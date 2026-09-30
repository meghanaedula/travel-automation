import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote:
        'The automated travelling agent synthesized our multi-city Kyoto & Tokyo route and recommended 3 boutique machiyas within 2 hours of submitting our budget envelope. Saved us over $1,200 compared to travel desk quotes.',
      name: 'Priya Raman',
      role: 'Product Director',
      journey: '7-Day Kyoto & Tokyo Route · October 2026',
      metric: 'Saved $1,200 & 14 hours of manual research',
    },
    {
      quote:
        'Coordinating an 8-day Italian coastal itinerary for 4 people usually takes weeks of back-and-forth. The daily breakdown matched our budget constraint to the dollar, including private Capri transfers.',
      name: 'Marcus Vance',
      role: 'Architectural Consultant',
      journey: '8-Day Amalfi & Capri · June 2026',
      metric: 'Zero scheduling conflicts across 4 travelers',
    },
    {
      quote:
        'Direct, concise, and beautifully organized. The day-by-day train connections on the Glacier Express and hotel recommendations were spot on for our family alpine expedition.',
      name: 'Elena Rostova',
      role: 'Operations VP',
      journey: '6-Day Swiss Alps & Zermatt · August 2026',
      metric: '100% budget adherence across 3 travelers',
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 uppercase tracking-wider">
            <span>04</span>
            <span>/</span>
            <span>Traveler Proof</span>
            <span>/</span>
            <span>Verified Outcomes</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
            Endorsed by Discerning Travelers
          </h2>
          <p className="text-stone-400 text-sm sm:text-base mt-2">
            Real travelers who leveraged our autonomous n8n itinerary generator for seamless,
            stress-free expeditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-800/80">
                <p className="font-bold text-white text-sm">{rev.name}</p>
                <p className="text-xs text-stone-400">{rev.role}</p>
                <div className="mt-2 text-[11px] font-mono text-amber-400/90">
                  {rev.metric}
                </div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">
                  {rev.journey}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
