import React from 'react';
import { X, ShieldCheck, Lock, FileText, Check } from 'lucide-react';
import siteConfig from '../data/siteConfig.json';

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-slatewarm-900">
                Privacy Notice & Data Protection
              </h3>
              <p className="text-xs text-slatewarm-500">
                Compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-cream-200 text-slatewarm-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Legal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-5 text-xs sm:text-sm text-slatewarm-700 leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 space-y-1">
            <h4 className="font-semibold text-slatewarm-900">1. Data Controller</h4>
            <p>
              This website and brand (<strong>The Gift Curator</strong>) is operated by <strong>{siteConfig.legalEntity}</strong>, a registered entity in the United Arab Emirates. Contact: <a href={`mailto:${siteConfig.email}`} className="text-rosewood-600 underline">{siteConfig.email}</a>.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slatewarm-900 text-sm">2. Information We Collect</h4>
            <p>
              In accordance with data minimization principles, we only collect information strictly necessary to provide our gifting and concierge services:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slatewarm-600 pl-2">
              <li><strong>Sender Information:</strong> Your name, mobile/WhatsApp number, and email address.</li>
              <li><strong>Gifting Preferences:</strong> Occasion, recipient relationship (e.g., friend, colleague), budget range, general interests, and dietary exclusions/allergies.</li>
              <li><strong>Delivery Information:</strong> Recipient delivery emirate, address, and preferred delivery date.</li>
              <li><strong>Payment Information:</strong> We do NOT collect or store credit or debit card numbers on this website. All transactions are settled via direct bank transfer or official third-party UAE payment gateway links.</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slatewarm-900 text-sm">3. Purpose of Processing</h4>
            <p>We process your data exclusively to:</p>
            <ul className="list-disc list-inside space-y-1 text-slatewarm-600 pl-2">
              <li>Prepare and share complimentary gifting concepts via WhatsApp or email.</li>
              <li>Coordinate artisan sourcing, hamper assembly, and safe delivery across the UAE.</li>
              <li>Provide invoice receipts and customer service updates.</li>
            </ul>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slatewarm-900 text-sm">4. Data Sharing & Third Parties</h4>
            <p>
              We do not sell, rent, or trade your personal information. Data is only shared with authorized courier delivery partners (strictly recipient name, phone, and address) solely for fulfilling physical delivery.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-semibold text-slatewarm-900 text-sm">5. Your Rights Under UAE Law</h4>
            <p>
              Under UAE Federal Decree-Law No. 45 of 2021, you have the right to access, rectify, or request the deletion of your personal data at any time. To exercise these rights, please email us at <strong>{siteConfig.email}</strong>.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cream-200 bg-cream-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slatewarm-900 text-white text-xs font-semibold hover:bg-slatewarm-800 transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
