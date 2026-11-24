import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Phone, Mail, LogOut, X, Clock, CheckCircle2, ChevronRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { formatAED, openWhatsAppDirect } from '../utils/whatsapp';

export default function UserProfileModal({ isOpen, onClose, user, onLogout, onNavigateToShop }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders();
    }
  }, [isOpen, user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      // 1. Try backend API
      let res;
      try {
        res = await fetch(`http://localhost:5000/api/user/orders?userId=${encodeURIComponent(user.id)}`);
      } catch {
        res = null;
      }

      if (res && res.ok) {
        const data = await res.json();
        setUserOrders(data.orders || []);
      } else {
        // Fallback to client localStorage orders
        const allOrders = JSON.parse(localStorage.getItem('tgc_db_orders') || '[]');
        const filtered = allOrders.filter(o => o.userId === user.id || (o.phone && user.phone && o.phone.replace(/[^0-9]/g, '') === user.phone.replace(/[^0-9]/g, '')));
        setUserOrders(filtered);
      }
    } catch (err) {
      console.warn('Could not fetch user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE2D8] max-h-[90vh] overflow-y-auto text-left relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FAECE8] text-[#7A2832] flex items-center justify-center font-serif text-lg font-bold border border-[#E8DFD5]">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#2E2826]">{user.name}</h3>
                <span className="text-[10px] bg-[#FAECE8] text-[#7A2832] font-bold px-2 py-0.5 rounded-full uppercase">
                  {user.role === 'admin' ? 'Curator Admin' : 'Boutique Client'}
                </span>
              </div>
              <span className="text-xs text-[#7A706B]">{user.email}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#2E2826] rounded-full hover:bg-[#FAF7F2]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs: My Orders / Profile Details */}
        <div className="flex items-center gap-2 mt-4 pb-2 border-b border-[#F0EBE3]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'orders' ? 'bg-[#7A2832] text-white' : 'text-[#524945] hover:bg-[#FAF7F2]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({userOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'profile' ? 'bg-[#7A2832] text-white' : 'text-[#524945] hover:bg-[#FAF7F2]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Delivery Details</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="mt-5 space-y-4">
            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-[#7A706B]">Loading your orders...</div>
            ) : userOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-[#FAF7F2] rounded-2xl border border-[#EAE2D8] p-6">
                <div className="w-12 h-12 rounded-full bg-white text-[#7A2832] flex items-center justify-center mx-auto text-xl shadow-xs">
                  🎁
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2E2826]">No Orders Yet</h4>
                <p className="text-xs text-[#524945] max-w-sm mx-auto">
                  Browse our hand-assembled ready-to-gift hampers or create a bespoke curation with our concierge.
                </p>
                <button
                  onClick={() => { onClose(); onNavigateToShop && onNavigateToShop(); }}
                  className="px-5 py-2.5 rounded-xl bg-[#7A2832] text-white text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 hover:bg-[#682029]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Browse Ready Hampers</span>
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div key={ord.id} className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE2D8] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#E8DFD5]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#2E2826] bg-white px-2 py-0.5 rounded border border-[#EAE2D8]">
                        {ord.id}
                      </span>
                      <span className="text-xs text-[#7A706B]">
                        {(ord.created_at || ord.createdAt || '').slice(0, 10)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ord.payment_status || ord.paymentStatus || 'Paid (Verified)'}
                      </span>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        {ord.order_status || ord.orderStatus || 'In Preparation'}
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-[#3A3330]">
                    {(ord.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity || 1}x {item.title}</span>
                        <span className="font-semibold">{formatAED(item.price * (item.quantity || 1))}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Location & Total */}
                  <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between text-xs">
                    <span className="text-[#524945] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#7A2832]" />
                      <span>{ord.delivery_area || ord.deliveryArea || 'Dubai'}</span>
                    </span>
                    <span className="font-serif font-bold text-base text-[#7A2832]">
                      Total: {formatAED(ord.total)}
                    </span>
                  </div>

                  {/* WhatsApp Help Button for Order */}
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => openWhatsAppDirect(`https://api.whatsapp.com/send?phone=971566799672&text=Hello%20The%20Gift%20Curator!%20I%20have%20an%20enquiry%20regarding%20my%20order%20(${ord.id}).`)}
                      className="text-xs text-[#7A2832] font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>💬 Chat with Concierge about this Order</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile Details */}
        {activeTab === 'profile' && (
          <div className="mt-5 space-y-4">
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE2D8] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A706B] tracking-wider block">Full Name</span>
                <span className="text-sm font-semibold text-[#2E2826]">{user.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A706B] tracking-wider block">Email</span>
                <span className="text-sm font-semibold text-[#2E2826]">{user.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A706B] tracking-wider block">WhatsApp Phone</span>
                <span className="text-sm font-semibold text-[#2E2826]">{user.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A706B] tracking-wider block">Default UAE Delivery Address</span>
                <span className="text-sm font-semibold text-[#2E2826]">{user.address || 'None saved yet'}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Your profile is protected under UAE Personal Data Protection laws.</span>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#F0EBE3] flex items-center justify-between">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#2E2826] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#1A1716]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
