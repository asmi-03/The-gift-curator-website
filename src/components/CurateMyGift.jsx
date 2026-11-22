import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, MessageCircle, Copy, CheckCircle2, 
  HelpCircle, Calendar, ShieldCheck, Heart, User, DollarSign, Send
} from 'lucide-react';
import { generateReferenceId, createCurateWhatsAppUrl, saveEnquiryLocally } from '../utils/whatsapp';

export default function CurateMyGift() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    occasion: 'Birthday',
    relationship: 'Friend',
    budget: 'AED 150 – 250',
    interests: [],
    exclusions: '',
    deliveryDate: '',
    deliveryArea: 'Dubai',
    senderName: '',
    senderContact: '',
    consent: true,
  });

  const [submittedRef, setSubmittedRef] = useState(null);
  const [copied, setCopied] = useState(false);

  const occasions = [
    'Birthday',
    'Anniversary',
    'Newborn & Baby Shower',
    'Thank You / Gratitude',
    'Housewarming',
    'Just Because / Thinking of You',
    'Corporate Milestone / Promotion',
    'Other Occasion'
  ];

  const relationships = [
    'Friend',
    'Partner / Spouse',
    'Colleague / Mentor',
    'Parent / Family Member',
    'Client / VIP Partner',
    'Teacher / Host'
  ];

  const budgetOptions = [
    { label: 'AED 150 – 250', desc: 'Thoughtful curated essentials (candle, artisan treat, note)' },
    { label: 'AED 250 – 400', desc: 'Boutique sensory hamper with 4–5 premium artisanal elements' },
    { label: 'AED 400 – 650', desc: 'Elevated luxury curation with keepsake items & delicacies' },
    { label: 'AED 650+ (VIP / Custom)', desc: 'Prestige bespoke hamper with custom luxury sourcing' },
  ];

  const interestOptions = [
    'Self-Care & Pampering',
    'Gourmet Sweets & Chocolates',
    'Cosy Home & Scents (Candles/Mists)',
    'Specialty Coffee & Artisan Tea',
    'Stationery & Keepsake Accessories',
    'Healthy, Organic & Clean Living',
    'Neutral & Minimalist Living',
    'Mediterranean & Culinary Treats'
  ];

  const emirates = [
    'Dubai (Same-Day / Next-Day)',
    'Abu Dhabi (1–2 Days)',
    'Sharjah (1–2 Days)',
    'Ajman',
    'Ras Al Khaimah',
    'Umm Al Quwain',
    'Fujairah'
  ];

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const referenceId = generateReferenceId('TGC-CUR');
    const fullEnquiry = {
      ...formData,
      referenceId,
      createdAt: new Date().toISOString()
    };
    
    // Save to local storage for Owner Dashboard / CSV export (BRD Section 9)
    saveEnquiryLocally(fullEnquiry);
    setSubmittedRef(fullEnquiry);
    setStep(5); // Confirmation Screen
  };

  const copyBriefText = () => {
    if (!submittedRef) return;
    const text = `The Gift Curator Brief (${submittedRef.referenceId})
Occasion: ${submittedRef.occasion}
Recipient: ${submittedRef.relationship}
Budget: ${submittedRef.budget}
Interests: ${submittedRef.interests.join(', ') || 'Open to curator recommendation'}
Exclusions: ${submittedRef.exclusions || 'None'}
Delivery: ${submittedRef.deliveryArea} (${submittedRef.deliveryDate || 'Flexible'})
Sender: ${submittedRef.senderName} (${submittedRef.senderContact})`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="curate" className="py-16 sm:py-24 bg-cream-50 border-y border-cream-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rosewood-100 border border-rosewood-200 text-xs font-semibold text-rosewood-600">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Bespoke Gifting Concierge</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900">
            Curate My Gift
          </h2>
          <p className="text-slatewarm-600 text-sm sm:text-base leading-relaxed">
            Answer a few quick questions about who you are celebrating and your budget. We'll suggest one thoughtful, tailor-made concept within 2–4 hours. <strong>No advance payment required.</strong>
          </p>
        </div>

        {/* Progress Stepper Bar (if not submitted) */}
        {step < 5 && (
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-medium text-slatewarm-500 mb-2">
              <span className={step >= 1 ? 'text-rosewood-600 font-bold' : ''}>1. Occasion & Recipient</span>
              <span className={step >= 2 ? 'text-rosewood-600 font-bold' : ''}>2. Budget</span>
              <span className={step >= 3 ? 'text-rosewood-600 font-bold' : ''}>3. Preferences</span>
              <span className={step >= 4 ? 'text-rosewood-600 font-bold' : ''}>4. Delivery & Details</span>
            </div>
            <div className="w-full bg-cream-300 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-rosewood-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Questionnaire Form Container */}
        <div className="bg-white rounded-3xl border border-cream-300 p-6 sm:p-10 shadow-card">
          
          {/* STEP 1: Occasion & Recipient */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood-500">Step 1 of 4</span>
                <h3 className="font-serif text-2xl text-slatewarm-900 font-semibold">
                  Who is this gift for, and what are we celebrating?
                </h3>
                <p className="text-xs text-slatewarm-500">
                  This helps us set the right tone, color palette, and emotional feeling.
                </p>
              </div>

              {/* Occasion Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slatewarm-800 block">
                  Select the Occasion:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setFormData({ ...formData, occasion: occ })}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        formData.occasion === occ
                          ? 'bg-rosewood-500 text-white border-rosewood-500 shadow-sm'
                          : 'bg-cream-50 text-slatewarm-800 border-cream-300 hover:border-slatewarm-400'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Relationship */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slatewarm-800 block">
                  Your Relationship with the Recipient:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {relationships.map((rel) => (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => setFormData({ ...formData, relationship: rel })}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        formData.relationship === rel
                          ? 'bg-slatewarm-900 text-white border-slatewarm-900 shadow-sm'
                          : 'bg-cream-50 text-slatewarm-800 border-cream-300 hover:border-slatewarm-400'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-slatewarm-900 hover:bg-slatewarm-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Budget</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Budget Range */}
          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood-500">Step 2 of 4</span>
                <h3 className="font-serif text-2xl text-slatewarm-900 font-semibold">
                  What is your indicative budget in AED?
                </h3>
                <p className="text-xs text-slatewarm-500">
                  We create authentic beauty across all budgets. Stating your budget ensures our curator proposes items you will feel great about.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {budgetOptions.map((b) => (
                  <div
                    key={b.label}
                    onClick={() => setFormData({ ...formData, budget: b.label })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.budget === b.label
                        ? 'bg-cream-100 border-rosewood-500 shadow-soft ring-1 ring-rosewood-400'
                        : 'bg-cream-50 border-cream-300 hover:border-slatewarm-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-slatewarm-900">
                        {b.label}
                      </span>
                      {formData.budget === b.label && (
                        <div className="w-5 h-5 rounded-full bg-rosewood-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slatewarm-600 mt-1 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-cream-200/80 border border-cream-300 text-xs text-slatewarm-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-slatewarm-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Need a different budget?</strong> Custom corporate or high-volume enquiries can specify any custom amount in the next notes step.
                </span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slatewarm-600 hover:text-slatewarm-900"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-slatewarm-900 hover:bg-slatewarm-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Preferences</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Recipient Interests & Exclusions */}
          {step === 3 && (
            <form onSubmit={handleNextStep} className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood-500">Step 3 of 4</span>
                <h3 className="font-serif text-2xl text-slatewarm-900 font-semibold">
                  What does your recipient love? (Optional)
                </h3>
                <p className="text-xs text-slatewarm-500">
                  Select any themes they appreciate. If you're not sure, leave blank and our curator will recommend crowd favorites!
                </p>
              </div>

              {/* Multi-select Interests */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {interestOptions.map((interest) => {
                  const selected = formData.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`p-3 rounded-xl border text-xs text-left font-medium transition-all ${
                        selected
                          ? 'bg-rosewood-500 text-white border-rosewood-500 shadow-sm'
                          : 'bg-cream-50 text-slatewarm-800 border-cream-300 hover:border-slatewarm-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{interest}</span>
                        {selected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Exclusions / Dietary / Allergies */}
              <div className="space-y-1.5 pt-2">
                <label htmlFor="exclusions-input" className="text-xs font-semibold text-slatewarm-800 block">
                  Any Allergies, Dietary Restrictions, or Dislikes? (Optional)
                </label>
                <input
                  id="exclusions-input"
                  type="text"
                  value={formData.exclusions}
                  onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                  placeholder="e.g. Nut allergy, halal only, no scented candles, decaf coffee..."
                  className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slatewarm-600 hover:text-slatewarm-900"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-slatewarm-900 hover:bg-slatewarm-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <span>Continue to Delivery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Delivery & Sender Contact Details */}
          {step === 4 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-rosewood-500">Step 4 of 4</span>
                <h3 className="font-serif text-2xl text-slatewarm-900 font-semibold">
                  Where should we send your concept and delivery?
                </h3>
                <p className="text-xs text-slatewarm-500">
                  We respect your privacy. We only use these details to share your 1 tailored concept and confirm dispatch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Emirate */}
                <div className="space-y-1.5">
                  <label htmlFor="emirate-select" className="text-xs font-semibold text-slatewarm-800 block">
                    Delivery Emirate:
                  </label>
                  <select
                    id="emirate-select"
                    value={formData.deliveryArea}
                    onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                  >
                    {emirates.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label htmlFor="delivery-date-input" className="text-xs font-semibold text-slatewarm-800 block">
                    Preferred Delivery Date (Optional):
                  </label>
                  <input
                    id="delivery-date-input"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                  />
                </div>

                {/* Sender Name */}
                <div className="space-y-1.5">
                  <label htmlFor="sender-name-input" className="text-xs font-semibold text-slatewarm-800 block">
                    Your Full Name: *
                  </label>
                  <input
                    id="sender-name-input"
                    type="text"
                    required
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    placeholder="e.g. Priya Sharma / Alex Mercer"
                    className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="sender-contact-input" className="text-xs font-semibold text-slatewarm-800 block">
                    Your WhatsApp Number / Mobile: *
                  </label>
                  <input
                    id="sender-contact-input"
                    type="tel"
                    required
                    value={formData.senderContact}
                    onChange={(e) => setFormData({ ...formData, senderContact: e.target.value })}
                    placeholder="e.g. +971 50 123 4567"
                    className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                  />
                </div>
              </div>

              {/* Consent and UAE Privacy Notice Checkbox (BRD Requirement) */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 text-xs text-slatewarm-600 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5 rounded text-rosewood-500 focus:ring-rosewood-400"
                  />
                  <span>
                    I agree to receive 1 complimentary gifting concept on WhatsApp/Phone. I understand that The Gift Curator (Anrudaya Gifts FZE) will never share my contact details with third parties, in compliance with UAE Personal Data Protection laws.
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slatewarm-600 hover:text-slatewarm-900"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-rosewood-500 hover:bg-rosewood-600 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit My Brief & Get Reference</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Confirmation Screen (BRD Sections 4, 7, 8, 9) */}
          {step === 5 && submittedRef && (
            <div className="space-y-6 text-center animate-fadeIn py-4">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-bold text-rosewood-500">
                  Enquiry Successfully Recorded
                </span>
                <h3 className="font-serif text-3xl font-semibold text-slatewarm-900">
                  Thank you, {submittedRef.senderName}!
                </h3>
                <p className="text-xs sm:text-sm text-slatewarm-600 max-w-lg mx-auto leading-relaxed">
                  Your personalised gifting brief has been received. Our lead curator is reviewing your notes.
                </p>
              </div>

              {/* Reference ID Badge */}
              <div className="inline-block bg-cream-100 border border-cream-300 rounded-2xl p-4 text-left shadow-xs max-w-md w-full">
                <div className="flex items-center justify-between border-b border-cream-200 pb-2 mb-2 text-xs">
                  <span className="text-slatewarm-500 font-medium">Your Reference Code:</span>
                  <span className="font-mono font-bold text-slatewarm-900 text-sm bg-white px-2 py-0.5 rounded border border-cream-300">
                    {submittedRef.referenceId}
                  </span>
                </div>
                
                <div className="space-y-1 text-xs text-slatewarm-700">
                  <p><strong>Occasion:</strong> {submittedRef.occasion} ({submittedRef.relationship})</p>
                  <p><strong>Budget Target:</strong> {submittedRef.budget}</p>
                  <p><strong>Delivery:</strong> {submittedRef.deliveryArea} {submittedRef.deliveryDate ? `by ${submittedRef.deliveryDate}` : ''}</p>
                </div>
              </div>

              {/* What Happens Next Card (BRD Section 7, Step B & C) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slatewarm-900 text-left text-cream-100 max-w-md mx-auto space-y-2">
                <h4 className="font-serif text-sm font-semibold text-gold-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>What happens next?</span>
                </h4>
                <ul className="text-xs text-cream-200 space-y-1.5 list-disc list-inside">
                  <li>Our curator prepares <strong>1 written bespoke concept</strong> with indicative contents and a firm price.</li>
                  <li>We share this via WhatsApp within <strong>2–4 business hours</strong>.</li>
                  <li><strong>Zero obligation:</strong> No payment or deposit is required until you approve the concept!</li>
                </ul>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="space-y-3 pt-2 max-w-md mx-auto">
                <a
                  href={createCurateWhatsAppUrl(submittedRef)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Brief to WhatsApp Concierge Now</span>
                </a>

                <button
                  type="button"
                  onClick={copyBriefText}
                  className="w-full py-2.5 px-4 rounded-xl bg-cream-200 hover:bg-cream-300 text-slatewarm-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Brief Summary for Records'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-cream-200">
                <button
                  onClick={() => { setStep(1); setSubmittedRef(null); }}
                  className="text-xs font-semibold text-slatewarm-500 hover:text-slatewarm-900 underline"
                >
                  Submit another gifting brief
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
