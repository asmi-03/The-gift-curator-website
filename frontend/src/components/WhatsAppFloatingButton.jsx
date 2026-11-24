import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getCleanWhatsAppNumber } from '../utils/whatsapp';

export default function WhatsAppFloatingButton() {
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappPhone = getCleanWhatsAppNumber();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      
      {/* Speech Bubble / Tooltip */}
      {showTooltip && (
        <div className="bg-white/95 backdrop-blur-md text-slatewarm-800 text-xs px-3.5 py-2 rounded-2xl shadow-elevated border border-cream-300 flex items-center gap-2 max-w-[210px] animate-bounce-subtle">
          <span>Need help choosing a gift? Chat with us live!</span>
          <button
            onClick={(e) => { e.preventDefault(); setShowTooltip(false); }}
            className="text-slatewarm-400 hover:text-slatewarm-700"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={`https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent("Hello The Gift Curator! I'm browsing your website and have a quick question.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-elevated hover:scale-105 transition-all focus:outline-none"
        aria-label="Contact Concierge on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>

    </div>
  );
}
