import React, { useState } from 'react';
import faqsData from '../data/faqs.json';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export default function FaqSection({ onOpenPrivacyModal }) {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-cream-100 border-b border-cream-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-rosewood-500">
            Clear Policies & Clarity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slatewarm-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about our sourcing, delivery across the UAE, deposit terms, and boutique policies.
          </p>
        </div>

        {/* Highlight Policy Banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-soft text-center space-y-1.5">
            <Truck className="w-5 h-5 text-rosewood-500 mx-auto" />
            <h4 className="font-serif text-sm font-semibold text-slatewarm-900">UAE Delivery</h4>
            <p className="text-xs text-slatewarm-500">
              Same-day in Dubai (orders by 12 PM). 24h–48h across all 7 Emirates.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-soft text-center space-y-1.5">
            <CreditCard className="w-5 h-5 text-gold-500 mx-auto" />
            <h4 className="font-serif text-sm font-semibold text-slatewarm-900">50% Advance Policy</h4>
            <p className="text-xs text-slatewarm-500">
              Free initial concept. 50% deposit upon approval; balance after final photos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-soft text-center space-y-1.5">
            <RefreshCw className="w-5 h-5 text-emerald-600 mx-auto" />
            <h4 className="font-serif text-sm font-semibold text-slatewarm-900">Equal Sourcing Pledge</h4>
            <p className="text-xs text-slatewarm-500">
              Any artisan substitutions are always of equal or greater value with notice.
            </p>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {faqsData.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-soft transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-rosewood-500 block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-slatewarm-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-rosewood-100 text-rosewood-600' : 'text-slatewarm-500'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slatewarm-600 leading-relaxed border-t border-cream-200/80 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal & Consumer Note */}
        <div className="mt-10 p-5 rounded-2xl bg-cream-200/60 border border-cream-300 text-xs text-slatewarm-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Operated by <strong>Anrudaya Gifts FZE</strong>. Compliant with UAE Consumer Protection and Personal Data Protection laws.
            </span>
          </div>
          <button
            onClick={onOpenPrivacyModal}
            className="text-rosewood-600 hover:text-rosewood-700 font-semibold underline shrink-0"
          >
            View Privacy Notice →
          </button>
        </div>

      </div>
    </section>
  );
}
