import React, { useState } from 'react';
import { Gift, Sparkles, MessageCircle, Menu, X, ShoppingBag, ShieldCheck, Home } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-cream-300/80 transition-all shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-slatewarm-800 text-cream-100 py-1.5 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-rosewood-400 animate-pulse"></span>
            <span>Dubai Same-Day Delivery on Ready Gifts (order by 12 PM) • Next-Day across all 7 Emirates</span>
          </div>
          <div className="flex items-center gap-4 text-cream-300">
            <span className="hidden md:inline">Complimentary handwritten wax-sealed note with every hamper</span>
            <a 
              href={siteConfig.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold-200 transition-colors"
            >
              {siteConfig.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-rosewood-100 border border-rosewood-300 flex items-center justify-center text-rosewood-500 shadow-sm group-hover:bg-rosewood-200 transition-colors">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-tight text-slatewarm-800 font-semibold block leading-none">
                The Gift Curator
              </span>
              <span className="text-[11px] font-sans tracking-wider text-slatewarm-400 uppercase mt-1 block">
                Dubai • Boutique Gifting
              </span>
            </div>
          </button>

          {/* Desktop Distinct Tabs Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium text-slatewarm-700">
            <button 
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'home'
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              Home
            </button>

            <button 
              onClick={() => handleNavClick('shop')}
              className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'shop' 
                  ? 'bg-rosewood-500 text-white shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Ready-to-Gift</span>
            </button>

            <button 
              onClick={() => handleNavClick('personalised-gifting')}
              className={`px-3.5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'personalised-gifting' 
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>Personalised Gifting</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                activeTab === 'personalised-gifting' ? 'bg-rosewood-500 text-white' : 'bg-rosewood-100 text-rosewood-600'
              }`}>
                Concierge
              </span>
            </button>

            <button 
              onClick={() => handleNavClick('creations')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'creations' 
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              Our Creations
            </button>

            <button 
              onClick={() => handleNavClick('corporate')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'corporate' 
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              Corporate & Bulk
            </button>

            <button 
              onClick={() => handleNavClick('faq')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'faq' 
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              FAQ & Policies
            </button>

            <button 
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === 'about' 
                  ? 'bg-slatewarm-900 text-cream-50 shadow-xs font-semibold' 
                  : 'hover:text-rosewood-600 hover:bg-cream-200/60'
              }`}
            >
              About
            </button>
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href={buildWhatsAppUrl("Hello The Gift Curator! I'd like to ask a quick question about your gifting services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a 
              href={buildWhatsAppUrl("Hello! I'd like to enquire about gifts.")}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-600 hover:text-emerald-700"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slatewarm-700 hover:text-rosewood-500 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer (Tab Navigation) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream-50 border-b border-cream-300 px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavClick('shop')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium shadow-sm transition-all ${
                activeTab === 'shop' ? 'bg-rosewood-600 text-white ring-2 ring-rosewood-300' : 'bg-rosewood-500 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Ready</span>
            </button>
            <button
              onClick={() => handleNavClick('personalised-gifting')}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium shadow-sm transition-all ${
                activeTab === 'personalised-gifting' ? 'bg-black text-white ring-2 ring-gold-400' : 'bg-slatewarm-800 text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>Personalised</span>
            </button>
          </div>
          
          <div className="border-t border-cream-300 pt-2 space-y-1 text-sm font-medium text-slatewarm-700">
            <button 
              onClick={() => handleNavClick('home')} 
              className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2 ${
                activeTab === 'home' ? 'bg-cream-200 font-bold text-slatewarm-900' : 'hover:bg-cream-200'
              }`}
            >
              <Home className="w-4 h-4 text-slatewarm-500" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => handleNavClick('creations')} 
              className={`w-full text-left px-3 py-2.5 rounded-lg ${
                activeTab === 'creations' ? 'bg-cream-200 font-bold text-slatewarm-900' : 'hover:bg-cream-200'
              }`}
            >
              Our Creations (Portfolio)
            </button>
            <button 
              onClick={() => handleNavClick('corporate')} 
              className={`w-full text-left px-3 py-2.5 rounded-lg ${
                activeTab === 'corporate' ? 'bg-cream-200 font-bold text-slatewarm-900' : 'hover:bg-cream-200'
              }`}
            >
              Corporate & Bulk Gifting
            </button>
            <button 
              onClick={() => handleNavClick('faq')} 
              className={`w-full text-left px-3 py-2.5 rounded-lg ${
                activeTab === 'faq' ? 'bg-cream-200 font-bold text-slatewarm-900' : 'hover:bg-cream-200'
              }`}
            >
              FAQ & Policies
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`w-full text-left px-3 py-2.5 rounded-lg ${
                activeTab === 'about' ? 'bg-cream-200 font-bold text-slatewarm-900' : 'hover:bg-cream-200'
              }`}
            >
              About & Legal
            </button>
          </div>

          <div className="pt-2 border-t border-cream-300 flex items-center justify-between text-xs text-slatewarm-500">
            <span>Anrudaya Gifts FZE • Dubai</span>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenOwnerPortal(); }}
              className="underline text-slatewarm-600 hover:text-slatewarm-900"
            >
              Owner Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
