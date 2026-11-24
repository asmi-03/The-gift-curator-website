import React, { useState, useMemo } from 'react';
import productsData from '../data/products.json';
import { formatAED, createProductWhatsAppUrl } from '../utils/whatsapp';
import { Filter, ShoppingBag, Eye, MessageCircle, Clock, Check, Sparkles, CreditCard } from 'lucide-react';
import ProductModal from './ProductModal';
import ImageFrame from './ImageFrame';

export default function ShopReadyToGift({ onNavigateToCurate, onCheckoutProduct }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudget, setSelectedBudget] = useState('All');
  const [activeProduct, setActiveProduct] = useState(null);

  const categories = [
    'All',
    'Self-Care & Pampering',
    'Wellness & Calm',
    'Newborn & Motherhood',
    'Corporate & Milestones',
    'Home & Celebration',
    'Celebration & Romance'
  ];

  const budgetTiers = [
    { label: 'All Budgets', value: 'All' },
    { label: 'Under AED 250', value: 'under-250' },
    { label: 'AED 250 – 350', value: '250-350' },
    { label: 'AED 350+', value: 'above-350' },
  ];

  const filteredProducts = useMemo(() => {
    return productsData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Budget filter
      if (selectedBudget === 'under-250' && item.price >= 250) return false;
      if (selectedBudget === '250-350' && (item.price < 250 || item.price > 350)) return false;
      if (selectedBudget === 'above-350' && item.price <= 350) return false;

      return true;
    });
  }, [selectedCategory, selectedBudget]);

  return (
    <section id="shop" className="py-16 sm:py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-cream-300">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-rosewood-500 uppercase tracking-widest">
              <span>Ready-to-Order Collection</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rosewood-400"></span>
              <span className="text-emerald-700 font-medium">Actual Product Photos</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-slatewarm-900 mt-2">
              Ready-to-Gift Hampers
            </h2>
            <p className="text-slatewarm-600 text-sm sm:text-base mt-2 max-w-xl">
              Hand-assembled boutique gift boxes available for immediate dispatch. All prices in AED with complete itemized contents and complimentary handwritten card.
            </p>
          </div>

          {/* Quick link to Curate if they want bespoke */}
          <div className="shrink-0 bg-white p-4 rounded-2xl border border-cream-300 shadow-soft max-w-xs">
            <span className="text-xs font-semibold text-slatewarm-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              Need something completely custom?
            </span>
            <p className="text-[11px] text-slatewarm-500 mt-1">
              Have specific items or custom budget in mind? Let our concierge curate it.
            </p>
            <button
              onClick={onNavigateToCurate}
              className="mt-2 text-xs font-semibold text-rosewood-600 hover:text-rosewood-700 underline"
            >
              Start Personalised Concierge →
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="py-6 space-y-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-slatewarm-900 text-white shadow-sm'
                    : 'bg-white text-slatewarm-700 border border-cream-300 hover:border-slatewarm-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Budget Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slatewarm-600">
            <span className="font-semibold text-slatewarm-800 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Price Range:
            </span>
            {budgetTiers.map((tier) => (
              <button
                key={tier.value}
                onClick={() => setSelectedBudget(tier.value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedBudget === tier.value
                    ? 'bg-rosewood-500 text-white shadow-xs'
                    : 'bg-cream-200 text-slatewarm-700 hover:bg-cream-300'
                }`}
              >
                {tier.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slatewarm-500">
              Showing <strong>{filteredProducts.length}</strong> curated hampers
            </span>
          </div>

        </div>

        {/* Product Grid (Responsive: 1-col on mobile, 2-col on tablet, 3-col on laptops, 4-col on wide screens) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 pt-4">
          {filteredProducts.map((product) => {
            const whatsappUrl = createProductWhatsAppUrl(product);

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
              >
                {/* Image Frame with Boutique Placeholder (Keeps Columns Intact) */}
                <div className="cursor-pointer relative group" onClick={() => setActiveProduct(product)}>
                  <ImageFrame
                    src={product.image}
                    alt={product.title}
                    title={product.title}
                    category={product.category}
                    badge={product.badge}
                  />

                  {/* Quick View Floating Button */}
                  <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 rounded-full bg-white/95 text-slatewarm-800 text-xs font-semibold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Inclusions</span>
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slatewarm-500">
                      <span className="uppercase tracking-wider font-semibold text-rosewood-500">
                        {product.category}
                      </span>
                      <span className="text-emerald-700 font-medium">
                        {product.availability}
                      </span>
                    </div>

                    <h3 
                      onClick={() => setActiveProduct(product)}
                      className="font-serif text-lg font-semibold text-slatewarm-900 group-hover:text-rosewood-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>

                    <p className="text-xs text-slatewarm-500 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Highlights & Price */}
                  <div className="space-y-3 pt-3 border-t border-cream-200">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slatewarm-400 block uppercase">Price (AED)</span>
                        <span className="font-serif text-xl font-bold text-slatewarm-900">
                          {formatAED(product.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slatewarm-400 block">Lead Time</span>
                        <span className="text-[11px] text-slatewarm-700 font-medium flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3 text-rosewood-400" />
                          Same-day Dubai
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => onCheckoutProduct ? onCheckoutProduct(product) : setActiveProduct(product)}
                        className="w-full py-2.5 px-3 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Order & Pay Now ({formatAED(product.price)})</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setActiveProduct(product)}
                          className="py-2 px-3 rounded-xl bg-cream-200 hover:bg-cream-300 text-slatewarm-800 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-medium transition-all flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-cream-300 p-8">
            <ShoppingBag className="w-12 h-12 text-slatewarm-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-slatewarm-800">
              No hampers match this exact filter
            </h3>
            <p className="text-xs text-slatewarm-500 mt-1">
              Try adjusting your price range or category, or use our bespoke concierge.
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedBudget('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-slatewarm-800 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Modal Dialog */}
      {activeProduct && (
        <ProductModal 
          product={activeProduct} 
          onClose={() => setActiveProduct(null)} 
        />
      )}
    </section>
  );
}
