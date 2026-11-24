import React, { useState } from 'react';
import { Building2, MessageCircle, Send, CheckCircle2, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { generateReferenceId, createCorporateWhatsAppUrl, saveEnquiryLocally } from '../utils/whatsapp';
import { submitCorporateRfq } from '../api/apiClient';

export default function CorporateGifting() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    quantity: '25 – 50',
    budgetPerUnit: 'AED 250 – 400',
    purpose: 'Client Appreciation',
    targetDate: '',
    brandingRequired: true,
    notes: ''
  });

  const [submittedRFQ, setSubmittedRFQ] = useState(null);

  const quantityRanges = [
    '10 – 25 units',
    '25 – 50 units',
    '50 – 100 units',
    '100+ units (Custom Run)'
  ];

  const budgetTiers = [
    'AED 150 – 250 / unit',
    'AED 250 – 400 / unit',
    'AED 400 – 600 / unit',
    'AED 600+ / VIP Curation'
  ];

  const occasions = [
    'Client Appreciation & Onboarding',
    'Employee Milestones & Recognition',
    'Ramadan / Eid Gifting',
    'Year-End / Festive Holiday Gifts',
    'VIP Summit / Conference Gifts'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitCorporateRfq(formData);
    const rfqRecord = result.rfq || {
      ...formData,
      referenceId: result.referenceId,
      createdAt: new Date().toISOString()
    };
    setSubmittedRFQ(rfqRecord);
  };

  return (
    <section id="corporate" className="py-16 sm:py-24 bg-cream-50 border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: B2B Overview & Trust */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slatewarm-800 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Bespoke Corporate Services</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900 leading-tight">
              Elevate Your Corporate & Bulk Gifting
            </h2>

            <p className="text-sm sm:text-base text-slatewarm-600 leading-relaxed">
              We partner with UAE enterprises, law firms, real estate agencies, and tech startups to create custom branded gifting experiences that strengthen client relationships and delight teams.
            </p>

            {/* Corporate Advantages List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slatewarm-900 uppercase tracking-wide">
                    Custom Branding & Foil Monogramming
                  </h4>
                  <p className="text-xs text-slatewarm-600 mt-0.5">
                    Co-branded luxury boxes, company logo ribbon, custom wax seals, and printed CEO welcome letters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slatewarm-900 uppercase tracking-wide">
                    Multi-Address UAE Drop Shipping
                  </h4>
                  <p className="text-xs text-slatewarm-600 mt-0.5">
                    We can deliver all units to your headquarters or ship individually to individual employee/client homes across Dubai and Abu Dhabi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slatewarm-900 uppercase tracking-wide">
                    Formal Tax Invoicing & Bank Wire
                  </h4>
                  <p className="text-xs text-slatewarm-600 mt-0.5">
                    B2B quotation, UAE VAT tax invoice, and direct corporate wire transfer options.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Structured RFQ Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-cream-300 p-6 sm:p-8 shadow-card">
              
              {!submittedRFQ ? (
                <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
                  
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-slatewarm-900">
                      Request a Bulk Proposal
                    </h3>
                    <p className="text-xs text-slatewarm-500 mt-1">
                      Receive an itemized deck, mockups, and volume discount quote within 24 hours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Company Name */}
                    <div className="space-y-1">
                      <label htmlFor="company-name-input" className="text-xs font-semibold text-slatewarm-800 block">
                        Company / Organization: *
                      </label>
                      <input
                        id="company-name-input"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Al Futtaim Group / Emaar"
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-1">
                      <label htmlFor="contact-person-input" className="text-xs font-semibold text-slatewarm-800 block">
                        Contact Person: *
                      </label>
                      <input
                        id="contact-person-input"
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="contact-email-input" className="text-xs font-semibold text-slatewarm-800 block">
                        Corporate Email: *
                      </label>
                      <input
                        id="contact-email-input"
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        placeholder="sarah@company.ae"
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="contact-phone-input" className="text-xs font-semibold text-slatewarm-800 block">
                        WhatsApp / Mobile: *
                      </label>
                      <input
                        id="contact-phone-input"
                        type="tel"
                        required
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      />
                    </div>
                  </div>

                  {/* Quantity & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="quantity-select" className="text-xs font-semibold text-slatewarm-800 block">
                        Estimated Units:
                      </label>
                      <select
                        id="quantity-select"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      >
                        {quantityRanges.map((q) => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="budget-per-unit-select" className="text-xs font-semibold text-slatewarm-800 block">
                        Target Budget per Unit:
                      </label>
                      <select
                        id="budget-per-unit-select"
                        value={formData.budgetPerUnit}
                        onChange={(e) => setFormData({ ...formData, budgetPerUnit: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      >
                        {budgetTiers.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Purpose & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="purpose-select" className="text-xs font-semibold text-slatewarm-800 block">
                        Occasion / Purpose:
                      </label>
                      <select
                        id="purpose-select"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      >
                        {occasions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="target-date-input" className="text-xs font-semibold text-slatewarm-800 block">
                        Target Delivery Deadline:
                      </label>
                      <input
                        id="target-date-input"
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                      />
                    </div>
                  </div>

                  {/* Branding Toggle */}
                  <div className="pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-slatewarm-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.brandingRequired}
                        onChange={(e) => setFormData({ ...formData, brandingRequired: e.target.checked })}
                        className="rounded text-rosewood-500 focus:ring-rosewood-400"
                      />
                      <span>Include corporate logo ribbon and branded welcome cards in proposal</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-slatewarm-900 hover:bg-slatewarm-800 text-white font-semibold text-xs tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4 text-gold-400" />
                      <span>Request Corporate Quotation</span>
                    </button>
                  </div>

                </form>
              ) : (
                /* Submitted Corporate RFQ Confirmation */
                <div className="space-y-6 text-center py-6 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-serif text-2xl font-semibold text-slatewarm-900">
                      Quotation Request Received!
                    </h3>
                    <p className="text-xs text-slatewarm-600 max-w-md mx-auto">
                      Thank you, {submittedRFQ.contactName}. We have logged reference{' '}
                      <strong className="text-slatewarm-900 font-mono">{submittedRFQ.referenceId}</strong> for {submittedRFQ.companyName}.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 text-xs text-left max-w-md mx-auto space-y-1">
                    <p><strong>Quantity:</strong> {submittedRFQ.quantity}</p>
                    <p><strong>Target Budget:</strong> {submittedRFQ.budgetPerUnit}</p>
                    <p><strong>Occasion:</strong> {submittedRFQ.purpose}</p>
                  </div>

                  <div className="space-y-3 pt-2 max-w-md mx-auto">
                    <a
                      href={createCorporateWhatsAppUrl(submittedRFQ)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Speed Up via WhatsApp B2B Desk</span>
                    </a>
                    
                    <button
                      onClick={() => setSubmittedRFQ(null)}
                      className="text-xs text-slatewarm-500 hover:text-slatewarm-800 underline"
                    >
                      Submit another enquiry
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
