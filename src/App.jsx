import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ShopReadyToGift from './components/ShopReadyToGift';
import CurateMyGift from './components/CurateMyGift';
import CreationsGallery from './components/CreationsGallery';
import CorporateGifting from './components/CorporateGifting';
import AboutContact from './components/AboutContact';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import OwnerPortalModal from './components/OwnerPortalModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import productsData from './data/products.json';
import creationsData from './data/creations.json';
import { formatAED } from './utils/whatsapp';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [ownerPortalOpen, setOwnerPortalOpen] = useState(false);

  // Sync with URL hash (e.g. #personalised-gifting, #shop, #creations)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'shop', 'personalised-gifting', 'creations', 'corporate', 'faq', 'about'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else if (hash === 'curate') {
        setActiveTab('personalised-gifting');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchTab = (tabId) => {
    // Normalise 'curate' to 'personalised-gifting'
    const targetTab = tabId === 'curate' ? 'personalised-gifting' : tabId;
    setActiveTab(targetTab);
    window.location.hash = targetTab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col font-sans text-slatewarm-800">
      
      {/* Top Navbar with Tab Selectors */}
      <Navbar 
        onNavigate={switchTab} 
        activeTab={activeTab} 
        onOpenOwnerPortal={() => setOwnerPortalOpen(true)}
      />

      <main className="flex-1">

        {/* ======================================================== */}
        {/* TAB 1: HOME PAGE                                         */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Boutique Hero Section */}
            <Hero onNavigate={switchTab} />

            {/* How Gifting Works Section */}
            <HowItWorks onNavigate={switchTab} />

            {/* Featured Ready-to-Gift Preview Strip */}
            <section className="py-16 bg-cream-100 border-b border-cream-300">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-rosewood-500">
                      Curated & In Stock
                    </span>
                    <h2 className="font-serif text-3xl font-semibold text-slatewarm-900 mt-1">
                      Ready-to-Gift Favorites
                    </h2>
                    <p className="text-xs text-slatewarm-500 mt-1">
                      Available for same-day delivery across Dubai and next-day UAE.
                    </p>
                  </div>
                  <button
                    onClick={() => switchTab('shop')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rosewood-500 hover:bg-rosewood-600 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
                  >
                    <span>View All Hampers ({productsData.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productsData.slice(0, 4).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => switchTab('shop')}
                      className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-square overflow-hidden bg-cream-200">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {p.badge && (
                          <span className="absolute top-2.5 left-2.5 bg-white/95 text-rosewood-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] uppercase font-semibold text-rosewood-500">{p.category}</span>
                        <h3 className="font-serif text-base font-semibold text-slatewarm-900 group-hover:text-rosewood-600 transition-colors line-clamp-1">{p.title}</h3>
                        <div className="pt-2 flex items-baseline justify-between border-t border-cream-200">
                          <span className="font-serif text-lg font-bold text-slatewarm-900">{formatAED(p.price)}</span>
                          <span className="text-[11px] text-emerald-700 font-medium">Same-Day Dubai</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Bespoke Concierge Banner */}
            <section className="py-16 bg-slatewarm-900 text-cream-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-300">
                    Bespoke Gifting Studio • Dubai
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 font-normal">
                    Looking for a completely custom gift?
                  </h2>
                  <p className="text-sm text-slatewarm-300 max-w-2xl leading-relaxed">
                    Tell us your occasion, who you are gifting, and your budget range. We craft one tailored concept within 2–4 hours. <strong>No advance design fees or deposits until you approve.</strong>
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <button
                    onClick={() => switchTab('personalised-gifting')}
                    className="px-8 py-4 rounded-2xl bg-gold-400 hover:bg-gold-500 text-slatewarm-900 font-bold text-xs uppercase tracking-wider shadow-card hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Open Personalised Concierge</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SHOP READY-TO-GIFT (DEDICATED PAGE)               */}
        {/* ======================================================== */}
        {activeTab === 'shop' && (
          <div className="animate-fadeIn">
            {/* Dedicated Page Header Banner */}
            <div className="bg-cream-200/80 border-b border-cream-300 py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-slatewarm-500 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slatewarm-800 font-medium">Shop Ready-to-Gift</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slatewarm-900">
                  Ready-to-Gift Hampers
                </h1>
                <p className="text-xs sm:text-sm text-slatewarm-600 mt-1 max-w-2xl">
                  Handcrafted in Dubai with real photography, transparent AED pricing, itemized contents, and same-day delivery.
                </p>
              </div>
            </div>

            {/* Shop Component */}
            <ShopReadyToGift onNavigateToCurate={() => switchTab('personalised-gifting')} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PERSONALISED GIFTING (DEDICATED CONCIERGE PAGE)   */}
        {/* Matches: thegiftcuratordubai.com/personalised-gifting/   */}
        {/* ======================================================== */}
        {activeTab === 'personalised-gifting' && (
          <div className="animate-fadeIn">
            {/* Dedicated Page Header Banner */}
            <div className="bg-slatewarm-900 text-cream-100 border-b border-slatewarm-800 py-10 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-slatewarm-400 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:text-cream-200">Home</button>
                  <span>/</span>
                  <span className="text-gold-300 font-medium">Personalised Gifting</span>
                </div>
                <span className="text-xs uppercase tracking-widest font-semibold text-rosewood-300">
                  Concierge Gifting Studio
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl text-cream-50 font-normal">
                  Personalised Gifting
                </h1>
                <p className="text-xs sm:text-base text-slatewarm-300 max-w-xl mx-auto leading-relaxed">
                  Tell us who, why, and how much — we take care of the what. Receive 1 tailored concept in 2–4h without any advance mockup fees.
                </p>
              </div>
            </div>

            {/* Curate My Gift Guided Questionnaire */}
            <CurateMyGift />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: OUR CREATIONS (DEDICATED PORTFOLIO PAGE)          */}
        {/* ======================================================== */}
        {activeTab === 'creations' && (
          <div className="animate-fadeIn">
            <div className="bg-cream-200/80 border-b border-cream-300 py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-slatewarm-500 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slatewarm-800 font-medium">Our Creations</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slatewarm-900">
                  Our Past Creations & Commissions
                </h1>
                <p className="text-xs sm:text-sm text-slatewarm-600 mt-1 max-w-2xl">
                  Real bespoke hampers assembled for VIP private and corporate clients across the UAE.
                </p>
              </div>
            </div>

            <CreationsGallery onSelectCreationToCurate={() => switchTab('personalised-gifting')} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CORPORATE & BULK GIFTING (DEDICATED PAGE)         */}
        {/* ======================================================== */}
        {activeTab === 'corporate' && (
          <div className="animate-fadeIn">
            <div className="bg-cream-200/80 border-b border-cream-300 py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-slatewarm-500 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slatewarm-800 font-medium">Corporate & Bulk Gifting</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slatewarm-900">
                  Corporate & Bulk Gifting Services
                </h1>
                <p className="text-xs sm:text-sm text-slatewarm-600 mt-1 max-w-2xl">
                  Custom branding, executive gift suites, Ramadan/festive hampers, and multi-address UAE drop shipping.
                </p>
              </div>
            </div>

            <CorporateGifting />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: FAQ & POLICIES (DEDICATED PAGE)                   */}
        {/* ======================================================== */}
        {activeTab === 'faq' && (
          <div className="animate-fadeIn">
            <div className="bg-cream-200/80 border-b border-cream-300 py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-slatewarm-500 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slatewarm-800 font-medium">FAQ & Policies</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slatewarm-900">
                  Frequently Asked Questions & Policies
                </h1>
                <p className="text-xs sm:text-sm text-slatewarm-600 mt-1 max-w-2xl">
                  Complete clarity on delivery zones across the 7 Emirates, 50% deposit policy, substitutions, and payments.
                </p>
              </div>
            </div>

            <FaqSection onOpenPrivacyModal={() => setPrivacyModalOpen(true)} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: ABOUT & CONTACT (DEDICATED PAGE)                  */}
        {/* ======================================================== */}
        {activeTab === 'about' && (
          <div className="animate-fadeIn">
            <div className="bg-cream-200/80 border-b border-cream-300 py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-xs text-slatewarm-500 mb-1">
                  <button onClick={() => switchTab('home')} className="hover:underline">Home</button>
                  <span>/</span>
                  <span className="text-slatewarm-800 font-medium">About & Contact</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-slatewarm-900">
                  About The Gift Curator
                </h1>
                <p className="text-xs sm:text-sm text-slatewarm-600 mt-1 max-w-2xl">
                  Dubai boutique gifting studio operated by Anrudaya Gifts FZE.
                </p>
              </div>
            </div>

            <AboutContact />
          </div>
        )}

      </main>

      {/* Global Footer (switches tabs instead of scrolling) */}
      <Footer 
        onNavigate={switchTab}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenOwnerPortal={() => setOwnerPortalOpen(true)}
      />

      {/* Floating Concierge WhatsApp Widget */}
      <WhatsAppFloatingButton />

      {/* Privacy Policy Modal (UAE PDPL Compliant) */}
      <PrivacyPolicyModal 
        isOpen={privacyModalOpen} 
        onClose={() => setPrivacyModalOpen(false)} 
      />

      {/* Business Owner Lead & Content Portal */}
      <OwnerPortalModal 
        isOpen={ownerPortalOpen} 
        onClose={() => setOwnerPortalOpen(false)} 
      />

    </div>
  );
}
