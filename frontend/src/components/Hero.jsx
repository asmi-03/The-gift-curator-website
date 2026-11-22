import React from 'react';
import { Sparkles, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Clock, Truck } from 'lucide-react';
import siteConfig from '../data/siteConfig.json';

export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-cream-100 via-cream-50 to-cream-200 border-b border-cream-300/60">
      
      {/* Decorative Warm Ambient Elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rosewood-200/25 blur-[120px] rounded-full pointer-events-none -z-0"></div>
      <div className="absolute -bottom-10 right-10 w-[350px] h-[250px] bg-gold-200/20 blur-[100px] rounded-full pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Core Messaging & Dual CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-200/90 border border-cream-400/80 text-xs font-semibold text-rosewood-600 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-rosewood-500"></span>
              <span>UAE Boutique Gifting Studio</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-slatewarm-900 leading-[1.15]">
              Thoughtfully chosen. <br className="hidden sm:inline" />
              <span className="italic font-serif font-light text-rosewood-500">Beautifully gifted.</span>
            </h1>

            {/* Core Value Proposition (Section 3) */}
            <p className="text-base sm:text-lg text-slatewarm-600 max-w-2xl leading-relaxed">
              Tell us <strong className="text-slatewarm-900 font-semibold">who</strong>, <strong className="text-slatewarm-900 font-semibold">why</strong>, and <strong className="text-slatewarm-900 font-semibold">how much</strong> — The Gift Curator takes care of the what. Whether you need a ready-to-dispatch hamper today or a bespoke personalised curation for someone special, we create gifts that feel deeply personal.
            </p>

            {/* The Two Primary Action Cards / Journeys */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl mx-auto lg:mx-0">
              
              {/* Journey 1: Ready-to-Gift */}
              <div 
                onClick={() => onNavigate('shop')}
                className="group relative cursor-pointer p-5 rounded-2xl bg-white border border-[#EAE2D8] hover:border-[#7A2832] shadow-soft hover:shadow-card transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FAECE8] text-[#7A2832] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#2E2826] leading-tight">
                      Shop Ready-to-Gift
                    </h3>
                    <p className="text-xs text-[#524945] mt-1.5 leading-relaxed">
                      Instant gratification. Pre-curated boutique hampers with actual AED prices, complete item lists & same-day Dubai delivery.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between text-xs font-bold text-[#7A2832]">
                  <span className="uppercase tracking-wider">Browse Catalogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Journey 2: Curate My Gift (High Visibility & Rich Boutique Contrast) */}
              <div 
                onClick={() => onNavigate('curate')}
                className="group relative cursor-pointer p-5 rounded-2xl bg-[#FFFBF8] border-2 border-[#7A2832] shadow-soft hover:shadow-card transition-all text-left flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#7A2832] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] bg-[#7A2832] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Bespoke
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#7A2832] group-hover:text-[#682029] transition-colors leading-tight">
                      Curate My Gift
                    </h3>
                    <p className="text-xs font-medium text-[#2E2826] mt-1.5 leading-relaxed">
                      Personalised concierge. Share your recipient, occasion & budget. We propose 1 tailored concept in 2–4h — no deposit required.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[#F0E5DC] flex items-center justify-between text-xs font-bold text-[#7A2832]">
                  <span className="uppercase tracking-wider">Start 2-Min Brief</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {/* Trust Cues Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slatewarm-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Real Product Photos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Transparent AED Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-rosewood-500 shrink-0" />
                <span>Delivery Across All 7 Emirates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span>Anrudaya Gifts FZE</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase & Real Hamper Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Featured Visual Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-cream-200 aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80" 
                  alt="The Gift Curator Luxury Boutique Hamper Dubai" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                
                {/* Floating Stamp / Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-slatewarm-800 shadow-sm border border-cream-300">
                  Dubai Hand-Assembled
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-card border border-cream-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-rosewood-500">
                        Featured Hamper
                      </span>
                      <h4 className="font-serif text-base font-semibold text-slatewarm-900">
                        The Velvet Morning Indulgence
                      </h4>
                      <p className="text-xs text-slatewarm-500 mt-0.5">
                        Ceramic mug, mountain sidr honey, amber candle & herbal infusion
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slatewarm-400 block">From</span>
                      <span className="text-base font-serif font-bold text-slatewarm-900">
                        AED 285
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2.5 border-t border-cream-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Ready for Same-Day Dispatch
                    </span>
                    <button 
                      onClick={() => onNavigate('shop')}
                      className="font-semibold text-rosewood-600 hover:text-rosewood-700 underline"
                    >
                      View Hamper
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
