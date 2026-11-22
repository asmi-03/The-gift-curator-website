import React, { useState } from 'react';
import creationsData from '../data/creations.json';
import { Sparkles, Info, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

export default function CreationsGallery({ onSelectCreationToCurate }) {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section id="creations" className="py-16 sm:py-24 bg-cream-100 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-cream-300">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rosewood-500 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Bespoke Archive & Portfolio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900 mt-2">
              Our Past Creations
            </h2>
            <p className="text-slatewarm-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Every bespoke gift we create is unique. Browse real commissions assembled for past private and corporate clients across the UAE.
            </p>
          </div>

          {/* BRD Disclaimer Cue */}
          <div className="shrink-0 bg-white p-3.5 rounded-2xl border border-cream-300 shadow-soft max-w-sm flex items-start gap-2.5">
            <Info className="w-4 h-4 text-rosewood-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slatewarm-600 leading-normal">
              <strong>Please Note:</strong> All past creations are shown as examples only with indicative budgets. Exact contents are subject to artisan seasonality and custom sourcing.
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
          {creationsData.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              {/* Photo with Example Only Badge */}
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Clear "Example Only" Label (BRD Section 4 & 5 Requirement) */}
                <div className="absolute top-3 right-3 bg-slatewarm-900/85 backdrop-blur-md text-gold-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slatewarm-700">
                  Example Only
                </div>

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-slatewarm-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-cream-200">
                  {item.category}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rosewood-500 uppercase tracking-wider text-[11px]">
                      {item.occasion}
                    </span>
                    <span className="font-serif font-bold text-slatewarm-900 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-300 text-xs">
                      {item.indicativeBudget}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-slatewarm-900 group-hover:text-rosewood-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slatewarm-600 leading-relaxed italic">
                    "{item.clientStory}"
                  </p>
                </div>

                {/* Inclusions summary */}
                <div className="pt-3 border-t border-cream-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slatewarm-400 block">
                    Curated Elements:
                  </span>
                  <p className="text-xs text-slatewarm-600 line-clamp-2">
                    {item.itemsIncluded}
                  </p>

                  {/* Request similar concept button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectCreationToCurate(item)}
                      className="w-full py-2.5 px-4 rounded-xl bg-cream-100 hover:bg-slatewarm-900 hover:text-white text-slatewarm-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-cream-300 hover:border-slatewarm-900"
                    >
                      <span>Request a Similar Concept</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
