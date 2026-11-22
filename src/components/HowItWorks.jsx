import React, { useState } from 'react';
import { ShoppingBag, Sparkles, MessageCircle, Check, ArrowRight, ShieldCheck, HeartHandshake, Camera } from 'lucide-react';

export default function HowItWorks({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('curate'); // 'curate' or 'ready'

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-cream-50 border-b border-cream-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-rosewood-500">
            Transparent & Pressure-Free
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-slatewarm-900 font-normal">
            How Gifting Works With Us
          </h2>
          <p className="text-slatewarm-600 text-sm sm:text-base leading-relaxed">
            We believe gifting should be effortless, beautifully personal, and completely transparent. Choose the journey that fits your timing.
          </p>

          {/* Toggle Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-cream-200 border border-cream-300 mt-4">
            <button
              onClick={() => setActiveTab('curate')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'curate'
                  ? 'bg-slatewarm-800 text-cream-50 shadow-sm'
                  : 'text-slatewarm-600 hover:text-slatewarm-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Personalised Concierge (Curate My Gift)</span>
            </button>
            <button
              onClick={() => setActiveTab('ready')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'ready'
                  ? 'bg-rosewood-500 text-white shadow-sm'
                  : 'text-slatewarm-600 hover:text-slatewarm-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ready-to-Gift Hampers</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Personalised Concierge Journey */}
        {activeTab === 'curate' && (
          <div className="mt-12 space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Step 1 */}
              <div className="relative p-6 rounded-2xl bg-white border border-cream-300 shadow-soft flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-full bg-cream-200 text-slatewarm-800 font-serif font-bold text-sm flex items-center justify-center">
                    01
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                    Share Your Brief
                  </h3>
                  <p className="text-xs text-slatewarm-600 leading-relaxed">
                    Tell us the occasion, recipient relationship, interests, and your budget range (e.g. AED 150–250, AED 400+). Takes 90 seconds.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  No payment or card required
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative p-6 rounded-2xl bg-white border border-cream-300 shadow-soft flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 font-serif font-bold text-sm flex items-center justify-center">
                    02
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                    Free Tailored Concept
                  </h3>
                  <p className="text-xs text-slatewarm-600 leading-relaxed">
                    Our curator reviews your notes and messages you 1 written thematic concept with indicative contents and a clear price via WhatsApp within 2–4 hours.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-slatewarm-500 font-medium">
                  Illustrative & subject to stock
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative p-6 rounded-2xl bg-white border border-cream-300 shadow-soft flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-full bg-rosewood-100 text-rosewood-700 font-serif font-bold text-sm flex items-center justify-center">
                    03
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                    Approval & 50% Deposit
                  </h3>
                  <p className="text-xs text-slatewarm-600 leading-relaxed">
                    Once you love the concept and agreed price, a 50% advance secures artisan sourcing and assembly. Transparent UAE bank transfer or payment link.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-rosewood-600 font-medium">
                  50% advance / 50% prior to dispatch
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative p-6 rounded-2xl bg-white border border-cream-300 shadow-soft flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-serif font-bold text-sm flex items-center justify-center">
                    04
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                    Photo Approval & Delivery
                  </h3>
                  <p className="text-xs text-slatewarm-600 leading-relaxed">
                    We handcraft your gift and send actual high-resolution photos of the assembled hamper for your final peace of mind before dispatch.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  Full visual check before delivery
                </div>
              </div>

            </div>

            {/* Bottom Call to Action for Concierge */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slatewarm-900 to-slatewarm-800 text-cream-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-lg font-semibold text-cream-50">
                  Ready to delegate your gifting to a trusted Dubai curator?
                </h4>
                <p className="text-xs text-cream-300">
                  Ideal for birthdays, newborn arrivals, romantic anniversaries, or thoughtful corporate thank-yous.
                </p>
              </div>
              <button
                onClick={() => onNavigate('curate')}
                className="shrink-0 px-6 py-3 rounded-xl bg-gold-400 hover:bg-gold-500 text-slatewarm-900 font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <span>Curate My Gift Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Ready-to-Gift Journey */}
        {activeTab === 'ready' && (
          <div className="mt-12 space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-2xl bg-white border border-cream-300 shadow-soft space-y-3">
                <span className="w-8 h-8 rounded-full bg-rosewood-100 text-rosewood-700 font-serif font-bold text-sm flex items-center justify-center">
                  01
                </span>
                <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                  Explore Actual Hampers
                </h3>
                <p className="text-xs text-slatewarm-600 leading-relaxed">
                  Browse real photographs of our curated boxes with upfront AED pricing, itemized inclusions list, and lead times. What you see is what arrives.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-cream-300 shadow-soft space-y-3">
                <span className="w-8 h-8 rounded-full bg-rosewood-100 text-rosewood-700 font-serif font-bold text-sm flex items-center justify-center">
                  02
                </span>
                <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                  One-Tap WhatsApp Order
                </h3>
                <p className="text-xs text-slatewarm-600 leading-relaxed">
                  Click 'Order on WhatsApp' on any product. The exact hamper name, price, and your message are pre-filled so our team can confirm stock and delivery fee instantly.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-cream-300 shadow-soft space-y-3">
                <span className="w-8 h-8 rounded-full bg-rosewood-100 text-rosewood-700 font-serif font-bold text-sm flex items-center justify-center">
                  03
                </span>
                <h3 className="font-serif text-lg font-semibold text-slatewarm-900">
                  Wax Seal & Hand Delivery
                </h3>
                <p className="text-xs text-slatewarm-600 leading-relaxed">
                  We hand-write your personal message card, apply an authentic wax seal, and arrange tracked delivery to your recipient's home or office in Dubai or across the UAE.
                </p>
              </div>

            </div>

            <div className="p-6 rounded-2xl bg-white border border-rosewood-200 text-slatewarm-900 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-serif text-lg font-semibold text-slatewarm-900">
                  Need a gift delivered today in Dubai?
                </h4>
                <p className="text-xs text-slatewarm-600">
                  Orders confirmed before 12:00 PM GST qualify for same-day delivery.
                </p>
              </div>
              <button
                onClick={() => onNavigate('shop')}
                className="shrink-0 px-6 py-3 rounded-xl bg-rosewood-500 hover:bg-rosewood-600 text-white font-semibold text-xs tracking-wide shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <span>View Ready Hampers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
