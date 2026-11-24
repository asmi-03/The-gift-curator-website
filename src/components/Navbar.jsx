import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import siteConfig from '../data/siteConfig.json';
import { getCleanWhatsAppNumber, buildWhatsAppUrl } from '../utils/whatsapp';

export default function Navbar({ onNavigate, activeTab, onOpenOwnerPortal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const whatsappPhone = getCleanWhatsAppNumber();

  const handleNavClick = (tabId) => {
    setMobileMenuOpen(false);
    onNavigate(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-[#EFEAE2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name (HD Adjustable Circular Logo) */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 sm:gap-3.5 text-left group focus:outline-none"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <img 
                src="/images/brand/logo.png" 
                alt="The Gift Curator Dubai Logo" 
                className="w-full h-full object-contain rounded-full drop-shadow-xs"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </div>
            <div>
              <span className="font-serif text-lg sm:text-2xl tracking-tight text-[#2E2826] font-semibold block leading-tight">
                The Gift Curator
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans tracking-[0.25em] text-[#7A706B] uppercase block font-medium mt-0.5">
                DUBAI
              </span>
            </div>
          </button>

          {/* Desktop Distinct Tabs Navigation (Matching Screenshot) */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[15px] font-normal text-[#3A3330]">
            
            <button 
              onClick={() => handleNavClick('home')}
              className={`py-1 transition-all ${
                activeTab === 'home'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Home
            </button>

            <button 
              onClick={() => handleNavClick('hampers')}
              className={`py-1 transition-all ${
                activeTab === 'hampers'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Our Hampers
            </button>

            <button 
              onClick={() => handleNavClick('personalised-gifting')}
              className={`py-1 transition-all ${
                activeTab === 'personalised-gifting'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Personalised Gifting
            </button>

            <button 
              onClick={() => handleNavClick('corporate-gifting')}
              className={`py-1 transition-all ${
                activeTab === 'corporate-gifting'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Corporate Gifting
            </button>

            <button 
              onClick={() => handleNavClick('our-story')}
              className={`py-1 transition-all ${
                activeTab === 'our-story'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Our Story
            </button>

            <button 
              onClick={() => handleNavClick('contact')}
              className={`py-1 transition-all ${
                activeTab === 'contact'
                  ? 'text-[#2E2826] font-medium border-b-2 border-[#2E2826]'
                  : 'hover:text-[#7A2832]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action: Clean Burgundy WhatsApp Button (Matching Screenshot) */}
          <div className="hidden lg:flex items-center">
            <a 
              href={buildWhatsAppUrl("Hello The Gift Curator! I'd like to ask a question about your gifting services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-[#7A2832] hover:bg-[#682029] text-white text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center justify-center"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <a 
              href={buildWhatsAppUrl("Hello! I'd like to enquire about gifts.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#7A2832] text-white text-xs font-semibold"
            >
              WhatsApp
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#3A3330] hover:text-[#7A2832] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-t border-[#EFEAE2] px-6 py-5 space-y-3 shadow-lg animate-fadeIn text-sm font-medium text-[#3A3330]">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'home' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavClick('hampers')} 
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'hampers' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Our Hampers
          </button>
          <button 
            onClick={() => handleNavClick('personalised-gifting')} 
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'personalised-gifting' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Personalised Gifting
          </button>
          <button 
            onClick={() => handleNavClick('corporate-gifting')} 
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'corporate-gifting' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Corporate Gifting
          </button>
          <button 
            onClick={() => handleNavClick('our-story')} 
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'our-story' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Our Story
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className={`w-full text-left py-2 ${activeTab === 'contact' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Contact
          </button>

          <div className="pt-3 border-t border-[#EAE2D8] flex items-center justify-between text-xs text-[#7A706B]">
            <span>Anrudaya Gifts FZE • Dubai</span>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenOwnerPortal(); }}
              className="underline hover:text-[#2E2826]"
            >
              Owner Portal
            </button>
          </div>
        </div>
      )}

    </header>
  );
}
