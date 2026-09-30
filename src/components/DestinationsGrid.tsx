import React from 'react';
import { ArrowUpRight, Compass, Sun, MapPin } from 'lucide-react';

interface DestinationItem {
  id: string;
  name: string;
  region: string;
  duration: string;
  budget: number;
  style: string;
  season: string;
  highlights: string[];
  gradient: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'japan',
    name: 'Kyoto & Tokyo, Japan',
    region: 'East Asia',
    duration: '7 Days · 6 Nights',
    budget: 3500,
    style: 'Cultural Immersion',
    season: 'Autumn / Spring Foliage',
    highlights: ['Boutique Gion Machiya Stays', 'Private Tea Ceremony', 'Shinkansen Gran Class'],
    gradient: 'from-amber-900/80 via-stone-900 to-stone-950',
  },
  {
    id: 'amalfi',
    name: 'Amalfi Coast & Capri, Italy',
    region: 'Southern Europe',
    duration: '8 Days · 7 Nights',
    budget: 5200,
    style: 'Luxury & Wellness',
    season: 'May - September',
    highlights: ['Cliffside Sea-View Suites', 'Private Gozzo Yachting', 'Lemon Grove Michelin Dining'],
    gradient: 'from-blue-900/80 via-stone-900 to-stone-950',
  },
  {
    id: 'iceland',
    name: 'Reykjavik & Golden Circle, Iceland',
    region: 'Nordic Europe',
    duration: '6 Days · 5 Nights',
    budget: 2800,
    style: 'Adventure & Nature',
    season: 'September - March',
    highlights: ['Aurora Borealis Expeditions', 'Silfra Fissure Diving', 'Geothermal Lagoon Lodges'],
    gradient: 'from-teal-900/80 via-stone-900 to-stone-950',
  },
  {
    id: 'switzerland',
    name: 'Swiss Alps & Zermatt, Switzerland',
    region: 'Central Europe',
    duration: '6 Days · 5 Nights',
    budget: 4200,
    style: 'Scenic Exploration',
    season: 'Year-Round Alpine',
    highlights: ['Matterhorn Panorama Suites', 'Glacier Express First Class', 'High-Altitude Spa Retreat'],
    gradient: 'from-slate-800 via-stone-900 to-stone-950',
  },
];

interface DestinationsGridProps {
  onSelectDestination: (dest: { name: string; budget: number; style: string }) => void;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({ onSelectDestination }) => {
  return (
    <section id="destinations" className="py-16 lg:py-24 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 uppercase tracking-wider">
              <span>02</span>
              <span>/</span>
              <span>Curated Inspiration</span>
              <span>/</span>
              <span>Global Itineraries</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white [text-wrap:balance]">
              Featured Journey Blueprints
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mt-2 max-w-xl">
              Pre-engineered travel templates optimized for the Travelling Agent workflow.
              Click any itinerary to pre-populate the intake planner with one touch.
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="bg-stone-950 rounded-2xl border border-stone-800/80 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all group"
            >
              {/* Visual Card Header with Gradient Scrim */}
              <div className={`p-6 bg-gradient-to-b ${dest.gradient} border-b border-stone-800/60 relative`}>
                <div className="flex items-center justify-between text-xs text-stone-300 font-mono mb-6">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <MapPin className="w-3.5 h-3.5" />
                    {dest.region}
                  </span>
                  <span className="text-stone-400">{dest.season}</span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2 leading-snug">
                  {dest.name}
                </h3>
                <p className="text-xs text-stone-300 font-mono">{dest.duration}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-3">
                    Curated Highlights
                  </div>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {dest.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Baseline Budget</span>
                    <span className="font-mono text-base font-bold text-white tabular-nums">
                      ${dest.budget.toLocaleString()} USD
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDestination({
                        name: dest.name,
                        budget: dest.budget,
                        style: dest.style,
                      });
                      const element = document.getElementById('planner');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-2.5 rounded-lg bg-stone-800 group-hover:bg-amber-400 group-hover:text-stone-950 text-stone-200 transition-colors cursor-pointer"
                    title="Load into Trip Planner"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
