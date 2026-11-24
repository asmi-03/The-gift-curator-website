import React from 'react';
import { MessageCircle, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { InstagramIcon } from './Icons';
import siteConfig from '../data/siteConfig.json';
import { getCleanWhatsAppNumber, buildWhatsAppUrl } from '../utils/whatsapp';

export default function AboutContact() {
  const whatsappPhone = getCleanWhatsAppNumber();

  return (
    <section id="about" className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Storytelling */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-elevated border-4 border-white bg-cream-200">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80"
                alt="The Gift Curator Dubai Gifting Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slatewarm-900/70 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-300">
                  Our Philosophy
                </span>
                <p className="font-serif text-xl sm:text-2xl font-light">
                  "Gifts are silent letters of love, gratitude, and belonging."
                </p>
                <p className="text-[11px] text-cream-200 pt-1">
                  — The Gift Curator Studio, Dubai
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: About Narrative & Contact Cards */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-rosewood-500">
                Behind The Brand
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900">
                Gifting That Speaks With Intention
              </h2>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slatewarm-600 leading-relaxed">
              <p>
                <strong>The Gift Curator</strong> was born in Dubai out of a simple observation: meaningful gifting shouldn't require exhausting hours scouring malls or settling for generic cellophane baskets with items people don't use.
              </p>
              <p>
                We believe the best gifts tell a story. Whether it is an intimate surprise for a best friend's 30th birthday, a nurturing bundle for a new mother, or bespoke client tokens for an executive milestone, we source from passionate boutique makers, organic botanical blenders, and ethical artisans.
              </p>
              <p>
                Every hamper is finished by hand in our studio with our signature keepsake boxes, natural silk ribbons, and handwritten cards sealed in botanical wax.
              </p>
            </div>

            {/* Contact & Studio Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* WhatsApp Card */}
              <a
                href={buildWhatsAppUrl("Hello! I would like to enquire about The Gift Curator.")}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-cream-300 hover:border-emerald-500 shadow-soft transition-all group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slatewarm-400 uppercase font-semibold block">WhatsApp Concierge</span>
                  <span className="font-semibold text-slatewarm-800 text-sm group-hover:text-emerald-700 transition-colors">
                    {siteConfig.whatsappDisplay}
                  </span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">Quick response in 15–30 mins</span>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white border border-cream-300 hover:border-rosewood-400 shadow-soft transition-all group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rosewood-100 text-rosewood-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slatewarm-400 uppercase font-semibold block">Instagram Community</span>
                  <span className="font-semibold text-slatewarm-800 text-sm group-hover:text-rosewood-600 transition-colors">
                    {siteConfig.instagramHandle}
                  </span>
                  <span className="text-[11px] text-rosewood-600 block mt-0.5">See daily hamper unboxings</span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-4 rounded-2xl bg-white border border-cream-300 hover:border-slatewarm-400 shadow-soft transition-all group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cream-200 text-slatewarm-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slatewarm-400 uppercase font-semibold block">Email Inquiries</span>
                  <span className="font-semibold text-slatewarm-800 text-sm">
                    {siteConfig.email}
                  </span>
                  <span className="text-[11px] text-slatewarm-500 block mt-0.5">Corporate RFQs & Collaborations</span>
                </div>
              </a>

              {/* Studio & Hours */}
              <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-soft flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cream-200 text-slatewarm-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slatewarm-400 uppercase font-semibold block">Location & Hours</span>
                  <span className="font-semibold text-slatewarm-800 text-sm">
                    Dubai, UAE
                  </span>
                  <span className="text-[11px] text-slatewarm-500 block mt-0.5">{siteConfig.operatingHours}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
