import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ShopReadyToGift from './components/ShopReadyToGift';
import CurateMyGift from './components/CurateMyGift';
import CorporateGifting from './components/CorporateGifting';
import OurStory from './components/OurStory';
import AboutContact from './components/AboutContact';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import PrivacyPolicyModal from './components/PrivacyPolicyModal';
import OwnerPortalModal from './components/OwnerPortalModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import CheckoutModal from './components/CheckoutModal';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton';
import ImageFrame from './components/ImageFrame';
import { Sparkles, ShoppingBag, ArrowRight, CreditCard } from 'lucide-react';
import productsData from './data/products.json';
import { formatAED } from './utils/whatsapp';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [ownerPortalOpen, setOwnerPortalOpen] = useState(false);

  // Authentication & Profile States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tgc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Payment & Checkout State
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      sessionStorage.setItem('tgc_admin_auth', 'true');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tgc_auth_user');
    localStorage.removeItem('tgc_auth_token');
    sessionStorage.removeItem('tgc_admin_auth');
    setCurrentUser(null);
  };

  // Sync with URL hash (e.g. #our-story, #personalised-gifting, #hampers, #admin)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['home', 'hampers', 'personalised-gifting', 'corporate-gifting', 'our-story', 'contact', 'admin'];
      
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else if (hash === 'shop') {
        setActiveTab('hampers');
      } else if (hash === 'curate') {
        setActiveTab('personalised-gifting');
      } else if (hash === 'corporate') {
        setActiveTab('corporate-gifting');
      } else if (hash === 'about') {
        setActiveTab('our-story');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const switchTab = (tabId) => {
    let target = tabId;
    if (tabId === 'shop') target = 'hampers';
    if (tabId === 'curate') target = 'personalised-gifting';
    if (tabId === 'corporate') target = 'corporate-gifting';
    if (tabId === 'about') target = 'our-story';

    setActiveTab(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Dashboard mode, display full-screen dedicated admin application
  if (activeTab === 'admin') {
    return <AdminDashboard onExit={() => switchTab('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#2E2826]">
      
      {/* Attractive Clean Navbar (Matching Screenshot) */}
      <Navbar 
        onNavigate={switchTab} 
        activeTab={activeTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenOwnerPortal={() => switchTab('admin')}
      />

      <main className="flex-1">

        {/* ======================================================== */}
        {/* TAB 1: HOME                                              */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="animate-fadeIn">
            {/* Hero Section */}
            <Hero onNavigate={switchTab} />

            {/* How It Works */}
            <HowItWorks onNavigate={switchTab} />

            {/* Featured Hampers Preview */}
            <section className="py-16 bg-[#FAF7F2] border-b border-[#EFEAE2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#7A2832]">
                      Curated & In Stock
                    </span>
                    <h2 className="font-serif text-3xl font-semibold text-[#2E2826] mt-1">
                      Our Ready-to-Gift Hampers
                    </h2>
                    <p className="text-xs text-[#7A706B] mt-1">
                      Available for same-day delivery across Dubai and next-day UAE.
                    </p>
                  </div>
                  <button
                    onClick={() => switchTab('hampers')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
                  >
                    <span>View All Hampers ({productsData.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {productsData.slice(0, 4).map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => switchTab('hampers')}
                      className="bg-white rounded-2xl border border-[#EAE2D8] overflow-hidden shadow-soft hover:shadow-card transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <ImageFrame
                        src={p.image}
                        alt={p.title}
                        title={p.title}
                        category={p.category}
                        badge={p.badge}
                      />
                      <div className="p-4 space-y-2">
                        <span className="text-[10px] uppercase font-semibold text-[#7A2832]">{p.category}</span>
                        <h3 className="font-serif text-base font-semibold text-[#2E2826] group-hover:text-[#7A2832] transition-colors line-clamp-1">{p.title}</h3>
                        <div className="pt-2 flex items-baseline justify-between border-t border-[#F0EBE3]">
                          <span className="font-serif text-lg font-bold text-[#2E2826]">{formatAED(p.price)}</span>
                          <span className="text-[11px] text-emerald-700 font-medium">Same-Day Dubai</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCheckoutProduct(p);
                          }}
                          className="w-full mt-2 py-2 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-[11px] font-semibold uppercase tracking-wider shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Order & Pay Now</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Bespoke Banner */}
            <section className="py-16 bg-[#2E2826] text-[#FAF7F2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-300">
                    Bespoke Gifting Studio • Dubai
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-normal">
                    Looking for a completely bespoke gift?
                  </h2>
                  <p className="text-sm text-[#D1C7BD] max-w-2xl leading-relaxed">
                    Tell us your occasion, recipient, and budget. We craft 1 tailored written concept within 2–4 hours. <strong>No advance design fees or deposits until you approve.</strong>
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <button
                    onClick={() => switchTab('personalised-gifting')}
                    className="px-8 py-4 rounded-xl bg-gold-400 hover:bg-gold-500 text-[#2E2826] font-bold text-xs uppercase tracking-wider shadow-card hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Personalised Concierge</span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: OUR HAMPERS                                       */}
        {/* ======================================================== */}
        {activeTab === 'hampers' && (
          <div className="animate-fadeIn">
            <ShopReadyToGift 
              onNavigateToCurate={() => switchTab('personalised-gifting')} 
              onCheckoutProduct={(prod) => setCheckoutProduct(prod)}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PERSONALISED GIFTING                              */}
        {/* ======================================================== */}
        {activeTab === 'personalised-gifting' && (
          <div className="animate-fadeIn">
            <div className="bg-[#2E2826] text-[#FAF7F2] py-10 px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-4xl mx-auto space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-rosewood-300">
                  Concierge Studio
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white">
                  Personalised Gifting
                </h1>
                <p className="text-xs sm:text-base text-[#D1C7BD] max-w-xl mx-auto leading-relaxed">
                  Tell us who, why, and how much — we take care of the what. 1 complimentary concept shared within 2–4h without any advance mockup fee.
                </p>
              </div>
            </div>
            <CurateMyGift />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: CORPORATE GIFTING                                 */}
        {/* ======================================================== */}
        {activeTab === 'corporate-gifting' && (
          <div className="animate-fadeIn">
            <CorporateGifting />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: OUR STORY (MEET THE FOUNDER - CHAITALLY)          */}
        {/* Directly Replicating Screenshot & Website Content        */}
        {/* ======================================================== */}
        {activeTab === 'our-story' && (
          <div className="animate-fadeIn">
            <OurStory onNavigate={switchTab} />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CONTACT                                           */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <div className="animate-fadeIn">
            <AboutContact />
            <FaqSection onOpenPrivacyModal={() => setPrivacyModalOpen(true)} />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer 
        onNavigate={switchTab}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenOwnerPortal={() => switchTab('admin')}
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

      {/* Customer Database Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Customer User Profile & My Orders Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onNavigateToShop={() => switchTab('hampers')}
      />

      {/* Luxury Payment & Checkout Modal */}
      <CheckoutModal
        isOpen={Boolean(checkoutProduct)}
        onClose={() => setCheckoutProduct(null)}
        product={checkoutProduct}
        user={currentUser}
        onOrderComplete={(order) => {}}
      />

    </div>
  );
}
