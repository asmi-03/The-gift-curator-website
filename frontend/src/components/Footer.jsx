import React from 'react';
import { Gift, MessageCircle, Mail, ShieldCheck, Heart, Lock } from 'lucide-react';
import { InstagramIcon } from './Icons';
import siteConfig from '../data/siteConfig.json';
import { getCleanWhatsAppNumber, buildWhatsAppUrl } from '../utils/whatsapp';

export default function Footer({ onNavigate, onOpenPrivacyModal, onOpenOwnerPortal }) {
  const whatsappPhone = getCleanWhatsAppNumber();

  return (
    <footer className="bg-slatewarm-900 text-cream-100 pt-16 pb-12 border-t border-slatewarm-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slatewarm-800 text-xs">
          
          {/* Brand Info (Col 1 & 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rosewood-500/20 border border-rosewood-400 text-rosewood-300 flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-semibold text-cream-50 tracking-tight">
                {siteConfig.brandName}
              </span>
            </div>

            <p className="text-slatewarm-400 max-w-sm leading-relaxed">
              Thoughtfully chosen. Beautifully gifted. UAE boutique gifting offering ready-to-order curated hampers and personalized gifting concierge across Dubai and the Emirates.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slatewarm-800 hover:bg-rosewood-500 hover:text-white flex items-center justify-center text-slatewarm-300 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={buildWhatsAppUrl("Hello The Gift Curator!")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slatewarm-800 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-slatewarm-300 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-8 h-8 rounded-full bg-slatewarm-800 hover:bg-slatewarm-700 flex items-center justify-center text-slatewarm-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Legal Entity Attribution (BRD Section 1) */}
            <div className="pt-2 text-[11px] text-slatewarm-400">
              <span>Legal Entity: </span>
              <strong className="text-cream-200">{siteConfig.legalEntity}</strong>
            </div>
          </div>

          {/* Col 3: Gifting Services */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-2 text-slatewarm-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-gold-300 transition-colors">
                  Ready-to-Gift Hampers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('curate')} className="hover:text-gold-300 transition-colors flex items-center gap-1">
                  <span>Curate My Gift</span>
                  <span className="text-[9px] bg-rosewood-600 text-white px-1.5 py-0.2 rounded font-sans">Concierge</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('creations')} className="hover:text-gold-300 transition-colors">
                  Our Creations (Portfolio)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('corporate')} className="hover:text-gold-300 transition-colors">
                  Corporate & Bulk Orders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-gold-300 transition-colors">
                  How Gifting Works
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider">
              Policies & Help
            </h4>
            <ul className="space-y-2 text-slatewarm-400">
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-gold-300 transition-colors">
                  Delivery & Lead Times
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-gold-300 transition-colors">
                  Deposit & Payment Terms
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-gold-300 transition-colors">
                  Artisan Substitution Pledge
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacyModal} className="hover:text-gold-300 transition-colors">
                  UAE Privacy & Data Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-gold-300 transition-colors">
                  Studio Story & Hours
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Delivery & UAE Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-cream-50 uppercase tracking-wider">
              UAE Coverage
            </h4>
            <p className="text-slatewarm-400 text-xs leading-relaxed">
              Handcrafted in Dubai.<br />
              Dispatching across all 7 Emirates: Dubai, Abu Dhabi, Sharjah, Ajman, RAK, UAQ, Fujairah.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1.5 rounded-lg bg-slatewarm-800 border border-slatewarm-700 text-[11px] text-cream-300">
                🇦🇪 Licensed in UAE
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slatewarm-400">
          <div>
            © {new Date().getFullYear()} The Gift Curator • Operated by {siteConfig.legalEntity}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenPrivacyModal}
              className="hover:text-cream-200 transition-colors"
            >
              Privacy Notice
            </button>
            <span className="text-slatewarm-700">•</span>
            {/* Discrete Owner Portal Access (Section 4 & 9) */}
            <button 
              onClick={onOpenOwnerPortal}
              className="hover:text-gold-300 transition-colors flex items-center gap-1 text-slatewarm-400 hover:text-white"
            >
              <Lock className="w-3 h-3" />
              <span>Owner Portal & CSV Export</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
