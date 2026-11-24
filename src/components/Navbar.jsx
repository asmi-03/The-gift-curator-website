import React, { useState } from 'react';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import siteConfig from '../data/siteConfig.json';
import { getCleanWhatsAppNumber, buildWhatsAppUrl } from '../utils/whatsapp';

export default function Navbar({ onNavigate, activeTab, currentUser, onOpenAuthModal, onOpenProfileModal, onOpenOwnerPortal }) {
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

          {/* Right Action: Auth / Profile Button & Burgundy WhatsApp Button */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={onOpenProfileModal}
                className="px-4 py-2 rounded-lg bg-[#FAECE8] hover:bg-[#F5D8D0] text-[#7A2832] border border-[#E8DFD5] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                title="View My Account & Orders"
              >
                <User className="w-4 h-4" />
                <span>{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 rounded-lg border border-[#D5CEC9] hover:border-[#7A2832] text-[#2E2826] text-xs font-semibold flex items-center gap-1.5 transition-all bg-white"
              >
                <User className="w-4 h-4 text-[#7A2832]" />
                <span>Sign In</span>
              </button>
            )}

            <a 
              href={buildWhatsAppUrl("Hello The Gift Curator! I'd like to ask a question about your gifting services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-[#7A2832] hover:bg-[#682029] text-white text-sm font-semibold tracking-wide shadow-xs transition-all flex items-center justify-center"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile Menu Hamburger + Auth Icon */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser ? (
              <button
                onClick={onOpenProfileModal}
                className="p-1.5 rounded-lg bg-[#FAECE8] text-[#7A2832] text-xs font-bold flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                <span className="text-[11px]">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="p-1.5 rounded-lg border border-[#D5CEC9] text-[#2E2826] text-xs font-semibold"
              >
                <User className="w-4 h-4 text-[#7A2832]" />
              </button>
            )}

            <a 
              href={buildWhatsAppUrl("Hello! I'd like to enquire about gifts.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#7A2832] text-white text-xs font-semibold"
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
            className={`w-full text-left py-2 border-b border-[#F0EBE3] ${activeTab === 'contact' ? 'font-bold text-[#7A2832]' : ''}`}
          >
            Contact
          </button>

          {/* Account Profile action in drawer */}
          <div className="pt-2">
            {currentUser ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenProfileModal(); }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAECE8] text-[#7A2832] font-semibold text-xs flex items-center justify-between"
              >
                <span>👤 Logged in as {currentUser.name}</span>
                <span className="text-[11px] underline">My Orders →</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuthModal(); }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2E2826] text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>Customer Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
