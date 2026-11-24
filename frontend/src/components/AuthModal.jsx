import React, { useState } from 'react';
import { User, Lock, Mail, Phone, MapPin, X, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Try backend API first
      const endpoint = mode === 'login' ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      let res;
      try {
        res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch {
        // Backend not reachable, fall back to client database in localStorage
        res = null;
      }

      if (res && res.ok) {
        const data = await res.json();
        localStorage.setItem('tgc_auth_token', data.token);
        localStorage.setItem('tgc_auth_user', JSON.stringify(data.user));
        onAuthSuccess(data.user);
        onClose();
        return;
      } else if (res && !res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || 'Authentication failed. Please verify your credentials.');
        setLoading(false);
        return;
      }

      // 2. Offline / Local fallback store (mirrors SQLite)
      const storedUsers = JSON.parse(localStorage.getItem('tgc_db_users') || '[]');
      
      if (mode === 'login') {
        // Check for Admin PIN bypass
        if (formData.password === 'curator2026' || formData.password === 'admin123') {
          const adminUser = {
            id: 'USR-ADMIN-01',
            name: 'Chaitally (Curator Admin)',
            email: formData.email || 'concierge@thegiftcuratordubai.com',
            role: 'admin',
            phone: '+971 56 679 9672'
          };
          localStorage.setItem('tgc_auth_user', JSON.stringify(adminUser));
          onAuthSuccess(adminUser);
          onClose();
          return;
        }

        const user = storedUsers.find(u => u.email.toLowerCase() === formData.email.trim().toLowerCase());
        if (!user || user.password !== formData.password) {
          setError('Invalid email or password. (Demo: client@example.com / client123)');
          setLoading(false);
          return;
        }

        const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'customer', address: user.address };
        localStorage.setItem('tgc_auth_user', JSON.stringify(safeUser));
        onAuthSuccess(safeUser);
        onClose();
      } else {
        // Registration
        if (storedUsers.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
          setError('An account with this email already exists.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: `USR-${Date.now()}`,
          name: formData.name,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone,
          password: formData.password,
          address: formData.address,
          role: 'customer',
          createdAt: new Date().toISOString()
        };

        storedUsers.push(newUser);
        localStorage.setItem('tgc_db_users', JSON.stringify(storedUsers));

        const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: 'customer', address: newUser.address };
        localStorage.setItem('tgc_auth_user', JSON.stringify(safeUser));
        onAuthSuccess(safeUser);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
      id: 'USR-CUST-001',
      name: 'Fatima Al-Maktoum',
      email: 'client@example.com',
      phone: '+971 50 892 1144',
      role: 'customer',
      address: 'Villa 12, Frond E, Palm Jumeirah, Dubai'
    };
    localStorage.setItem('tgc_auth_user', JSON.stringify(demoUser));
    onAuthSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EAE2D8] relative text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-[#2E2826] hover:bg-[#FAF7F2] transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center pb-4 border-b border-[#F0EBE3]">
          <div className="w-14 h-14 rounded-full bg-[#FAECE8] flex items-center justify-center mx-auto mb-2 border border-[#E8DFD5] overflow-hidden">
            <img 
              src="/images/brand/logo.png" 
              alt="The Gift Curator Logo" 
              className="w-full h-full object-contain rounded-full"
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
          </div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#7A706B] uppercase font-semibold block">
            The Gift Curator Dubai
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2E2826] mt-0.5">
            {mode === 'login' ? 'Customer Sign In' : 'Create Boutique Account'}
          </h3>
          <p className="text-xs text-[#524945] mt-1">
            {mode === 'login' 
              ? 'Access your orders, saved delivery addresses & concierge notes.' 
              : 'Join our private gifting directory for bespoke curations & priority delivery.'}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex bg-[#FAF7F2] p-1 rounded-xl mt-4 border border-[#EAE2D8]">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-[#7A2832] shadow-xs' : 'text-[#7A706B] hover:text-[#2E2826]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-[#7A2832] shadow-xs' : 'text-[#7A706B] hover:text-[#2E2826]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <span className="shrink-0 text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Fatima Al-Maktoum"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                WhatsApp / Mobile Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                Default UAE Delivery Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="e.g. Villa 14, Frond E, Palm Jumeirah, Dubai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Processing...' : (mode === 'login' ? 'Sign In to Account' : 'Complete Registration')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Login Option */}
        <div className="mt-4 pt-3 border-t border-[#F0EBE3] flex items-center justify-between text-xs text-[#7A706B]">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="text-[#7A2832] font-semibold hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Demo Client</span>
          </button>
          <span className="text-[11px] text-[#9E533F]">Curator PIN: curator2026</span>
        </div>

      </div>
    </div>
  );
}
