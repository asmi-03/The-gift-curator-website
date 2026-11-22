import React, { useState } from 'react';
import { Gift, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ImageFrame({ 
  src, 
  alt = "Product Photo", 
  title = "", 
  badge = null,
  category = "",
  className = "",
  aspectRatio = "aspect-square"
}) {
  const [imageError, setImageError] = useState(false);
  const hasValidSrc = src && src.trim() !== '' && !imageError;

  return (
    <div className={`relative ${aspectRatio} w-full overflow-hidden bg-cream-200/90 border-b border-cream-300 ${className}`}>
      
      {hasValidSrc ? (
        <img
          src={src}
          alt={alt || title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        /* Boutique Placeholder Frame (Keeps column layout 100% intact) */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-cream-100 via-cream-200/70 to-cream-300/50 relative select-none">
          
          {/* Subtle gold decorative inner border */}
          <div className="absolute inset-3 rounded-2xl border border-dashed border-gold-400/40 pointer-events-none"></div>

          {/* Center Gift Icon Crest */}
          <div className="w-14 h-14 rounded-2xl bg-white/90 border border-cream-300 text-rosewood-500 flex items-center justify-center shadow-xs mb-3 group-hover:scale-110 group-hover:bg-rosewood-50 transition-all duration-300">
            <Gift className="w-7 h-7 stroke-[1.5]" />
          </div>

          {/* Title & Category Cue */}
          <span className="text-[11px] font-serif font-semibold text-slatewarm-800 line-clamp-1 max-w-[85%] px-1">
            {title || "Curated Gift Box"}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-rosewood-500 font-semibold mt-0.5">
            {category || "Photo Slot"}
          </span>

          <span className="text-[9px] text-slatewarm-400 mt-2 font-mono bg-white/70 px-2 py-0.5 rounded border border-cream-300/60">
            Drop photo in PRODUCT_IMAGES/
          </span>
        </div>
      )}

      {/* Floating Badge (e.g. Bestseller / New Mum Favorite / Example Only) */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-rosewood-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-cream-200">
            <Sparkles className="w-3 h-3 text-gold-500" />
            <span>{badge}</span>
          </span>
        </div>
      )}

    </div>
  );
}
