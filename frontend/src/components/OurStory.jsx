import React from 'react';
import { Sparkles, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import siteConfig from '../data/siteConfig.json';
import { getCleanWhatsAppNumber } from '../utils/whatsapp';

export default function OurStory({ onNavigate }) {
  const whatsappPhone = getCleanWhatsAppNumber();

  return (
    <section id="our-story" className="py-12 sm:py-20 bg-[#FAF7F2] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main "Meet the Founder" Layout (Directly Matching Website & Screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2E2826] font-normal tracking-tight leading-[1.1]">
                Meet the <br className="hidden sm:inline" />
                Founder
              </h1>
              
              <p className="font-serif italic text-xl sm:text-2xl text-[#9E533F] font-normal pt-1">
                The heart behind The Gift Curator Dubai
              </p>
            </div>

            <div className="space-y-4 text-[#3A3330] text-base sm:text-lg leading-relaxed pt-2">
              <p className="font-semibold text-[#2E2826]">
                Hi, I'm Chaitally, the person behind The Gift Curator Dubai.
              </p>
              
              <p className="text-[#524945]">
                And believe it or not, it all started with my children's birthday favours.
              </p>

              <p className="text-[#524945] text-sm sm:text-base leading-relaxed">
                When planning celebrations for my little ones, I found myself frustrated by generic party favours and impersonal plastic trinkets. I wanted to give gifts that felt intentional, memorable, and genuinely appreciated—items that children and parents would cherish long after the party ended.
              </p>

              <p className="text-[#524945] text-sm sm:text-base leading-relaxed">
                I began hand-curating bespoke gift bundles, sourcing lovely artisan keepsakes, hand-tying ribbons, and penning personal notes. The response was immediate: friends and family began asking me to curate gifts for their own milestones, baby showers, birthdays, and corporate celebrations.
              </p>

              <p className="text-[#524945] text-sm sm:text-base leading-relaxed">
                That passion grew into <strong>The Gift Curator Dubai</strong>. Today, our philosophy remains unchanged: you tell us <em>who</em>, <em>why</em>, and <em>how much</em>—and we take care of the <em>what</em>. Every hamper is hand-assembled in Dubai with authentic artisanal goods, custom silk ribbons, and handwritten wax-sealed cards.
              </p>
            </div>

            {/* Quote Block */}
            <div className="p-5 rounded-2xl bg-[#F4EDE5] border-l-4 border-[#7A2832] text-sm text-[#3A3330] italic">
              "We believe gifting is not just a transaction—it is a silent letter of gratitude, celebration, and love."
              <span className="block not-italic font-semibold text-xs text-[#7A2832] mt-2">— Chaitally, Founder</span>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('personalised-gifting')}
                className="px-6 py-3.5 rounded-xl bg-[#2E2826] hover:bg-[#1A1716] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-all flex items-center gap-2"
              >
                <span>Curate My Gift</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent("Hello Chaitally! I read your story on The Gift Curator and would love to ask about gifting.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold tracking-wider uppercase shadow-xs transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Say Hello on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Column: Founder Portrait Card (Proper Margin Boundary Fitting in Full HD) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-3xl bg-white border border-[#E5DACF] shadow-md hover:shadow-lg transition-all text-center group">
              
              {/* Inner Photo Container with Balanced Boundary Margins */}
              <div className="relative mx-auto rounded-2xl overflow-hidden aspect-square sm:aspect-[4/5] bg-[#F7F2EC] border border-[#EAE2D8] shadow-inner">
                <img
                  src="/images/founder-chaitally.jpg"
                  alt="Chaitally - Founder & Lead Curator, The Gift Curator Dubai"
                  className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-103"
                  loading="eager"
                />
                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Founder Details & Signature */}
              <div className="pt-5 pb-2 space-y-1.5 px-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAECE8] text-[#7A2832] text-[10px] font-bold uppercase tracking-wider">
                  <span>Founder & Lead Curator</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2E2826] tracking-tight">
                  Chaitally
                </h3>
                
                <p className="text-xs sm:text-sm text-[#524945] font-medium">
                  The Gift Curator Dubai
                </p>

                <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-[#9E533F] font-serif italic">
                  <span className="w-8 h-[1px] bg-[#E0D5C7]"></span>
                  <span>Anrudaya Gifts FZE • Dubai, UAE</span>
                  <span className="w-8 h-[1px] bg-[#E0D5C7]"></span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Brand Values Strip */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-[#EAE2D8] grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EDE5] text-[#7A2832] flex items-center justify-center text-lg">
              🌿
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#2E2826]">
              Thoughtfully Chosen
            </h4>
            <p className="text-xs text-[#6B615C] leading-relaxed">
              We curate only sensory, delightful, and genuinely useful items from artisanal Emirati makers and ethical global craftspeople.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EDE5] text-[#7A2832] flex items-center justify-center text-lg">
              ✨
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#2E2826]">
              Handcrafted in Dubai
            </h4>
            <p className="text-xs text-[#6B615C] leading-relaxed">
              Every hamper is hand-assembled in our Dubai studio, tied with raw-edge silk ribbon, and sealed with botanical wax and custom calligraphy.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#F4EDE5] text-[#7A2832] flex items-center justify-center text-lg">
              🤍
            </div>
            <h4 className="font-serif text-lg font-semibold text-[#2E2826]">
              Welcoming Across Budgets
            </h4>
            <p className="text-xs text-[#6B615C] leading-relaxed">
              Meaningful gifting should never be intimidating. From accessible thank-you gestures (AED 150) to grand VIP curations, we honour every budget.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
