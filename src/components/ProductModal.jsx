import React, { useState } from 'react';
import { X, Check, MessageCircle, Truck, Clock, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { createProductWhatsAppUrl, formatAED } from '../utils/whatsapp';
import ImageFrame from './ImageFrame';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(product.image);
  const [customNote, setCustomNote] = useState('');
  const [selectedRibbon, setSelectedRibbon] = useState('Sage Green');

  const allImages = [product.image, ...(product.additionalImages || [])];
  const whatsappUrl = createProductWhatsAppUrl(
    product, 
    customNote ? `${customNote} (Ribbon: ${selectedRibbon})` : `(Ribbon: ${selectedRibbon})`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div 
        className="relative bg-cream-50 w-full max-w-4xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slatewarm-700 hover:text-slatewarm-900 flex items-center justify-center shadow-md transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Product Images Gallery */}
            <div className="md:col-span-6 space-y-4">
              {/* Product Image Frame */}
              <div className="rounded-2xl overflow-hidden border border-cream-300 shadow-sm">
                <ImageFrame 
                  src={activeImage} 
                  alt={product.title} 
                  title={product.title}
                  category={product.category}
                  badge={product.badge}
                />
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === img ? 'border-rosewood-500 scale-95 ring-2 ring-rosewood-200' : 'border-cream-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Delivery Information Box */}
              <div className="p-4 rounded-xl bg-white border border-cream-300 text-xs text-slatewarm-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slatewarm-900">
                  <Truck className="w-4 h-4 text-rosewood-500" />
                  <span>Delivery Expectations (UAE)</span>
                </div>
                <p className="text-slatewarm-600 leading-relaxed">
                  • <strong>Dubai:</strong> Same-day delivery for orders confirmed by 12 PM GST. Standard next-day available.<br />
                  • <strong>Abu Dhabi & Other Emirates:</strong> 1–2 business days.
                </p>
                <p className="text-[11px] text-slatewarm-500 pt-1 border-t border-cream-200">
                  Delivery fee (Dubai AED 35 / Other Emirates AED 50) confirmed before payment.
                </p>
              </div>

            </div>

            {/* Right: Product Details, Inclusions, and WhatsApp Action */}
            <div className="md:col-span-6 space-y-6">
              
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rosewood-500">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-slatewarm-900 mt-1">
                  {product.title}
                </h2>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-slatewarm-900">
                    {formatAED(product.price)}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {product.availability}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slatewarm-600 leading-relaxed">
                {product.description}
              </p>

              {/* Itemized Inclusions (BRD Requirement) */}
              <div className="space-y-2 bg-white p-4 rounded-2xl border border-cream-300">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slatewarm-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                  <span>Exact Contents Included:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slatewarm-700">
                  {product.contents.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Packaging & Keepsake Specs */}
              <div className="text-xs text-slatewarm-600 space-y-1 bg-cream-100 p-3 rounded-xl border border-cream-300">
                <span className="font-semibold text-slatewarm-800 block">Packaging:</span>
                <p>{product.packaging}</p>
              </div>

              {/* Ribbon Choice */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slatewarm-800 block">
                  Complimentary Silk Ribbon Color:
                </label>
                <div className="flex gap-2 text-xs">
                  {['Sage Green', 'Dusty Rose', 'Champagne Gold'].map((ribbon) => (
                    <button
                      key={ribbon}
                      type="button"
                      onClick={() => setSelectedRibbon(ribbon)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedRibbon === ribbon
                          ? 'bg-rosewood-500 text-white border-rosewood-500 shadow-sm'
                          : 'bg-white text-slatewarm-700 border-cream-300 hover:border-slatewarm-400'
                      }`}
                    >
                      {ribbon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Custom Card Note */}
              <div className="space-y-1.5">
                <label htmlFor="modal-card-note" className="text-xs font-semibold text-slatewarm-800 flex justify-between">
                  <span>Card Message (Optional):</span>
                  <span className="text-slatewarm-400 font-normal">Hand-written with wax seal</span>
                </label>
                <textarea
                  id="modal-card-note"
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g. Happy Birthday Dearest Sarah! So proud of all your achievements..."
                  className="w-full text-xs p-3 rounded-xl bg-white border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400"
                />
              </div>

              {/* WhatsApp Order Action */}
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Order on WhatsApp • {formatAED(product.price)}</span>
                </a>
                <p className="text-[11px] text-center text-slatewarm-500 leading-tight">
                  Opens WhatsApp with this hamper pre-filled. Our team will verify delivery timing, total with delivery, and share manual bank transfer / card payment link.
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
