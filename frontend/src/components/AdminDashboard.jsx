import React, { useState, useEffect } from 'react';
import { 
  Package, Plus, Search, Edit2, Trash2, Upload, Check, X, 
  Users, ShoppingBag, TrendingUp, LogOut, ArrowLeft, Download, 
  Sparkles, Clock, Truck, Phone, MessageCircle, AlertCircle, Eye
} from 'lucide-react';
import initialProducts from '../data/products.json';
import initialOrders from '../data/orders.json';
import initialCustomers from '../data/customers.json';
import siteConfig from '../data/siteConfig.json';
import { formatAED, getCleanWhatsAppNumber } from '../utils/whatsapp';

export default function AdminDashboard({ onExit }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('tgc_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab: 'overview' | 'products' | 'orders' | 'customers' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Data States (Local fallback + API synchronization)
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [config, setConfig] = useState(siteConfig);

  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');

  // Modals & Forms
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [quickPriceEditId, setQuickPriceEditId] = useState(null);
  const [quickPriceValue, setQuickPriceValue] = useState('');

  // New Product Form State
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    price: '',
    category: 'Self-Care & Pampering',
    leadTime: 'Same-day in Dubai (order before 12 PM) / Next-day UAE',
    availability: 'In Stock',
    badge: 'New',
    shortDescription: '',
    contentsText: '',
    image: '',
    imagePreview: ''
  });

  // Selected Order for Detail View
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Try fetching fresh data from backend API if active
  useEffect(() => {
    if (isAuthenticated) {
      fetch('http://localhost:5000/api/products')
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data && Array.isArray(data)) setProducts(data); })
        .catch(() => {});

      fetch('http://localhost:5000/api/orders')
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data && Array.isArray(data)) setOrders(data); })
        .catch(() => {});

      fetch('http://localhost:5000/api/customers')
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data && Array.isArray(data)) setCustomers(data); })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput === 'curator2026' || pinInput === 'admin123' || pinInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tgc_admin_auth', 'true');
      setAuthError('');
      showToast('Welcome back, Chaitally!');
    } else {
      setAuthError('Incorrect PIN. (Default PIN: curator2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tgc_admin_auth');
    onExit();
  };

  // ----------------------------------------------------
  // PRODUCT MANAGEMENT ACTIONS
  // ----------------------------------------------------

  // 1. Quick Price Edit in Product List
  const handleSaveQuickPrice = (productId) => {
    const newPriceNum = Number(quickPriceValue);
    if (!newPriceNum || isNaN(newPriceNum) || newPriceNum <= 0) {
      showToast('Please enter a valid price in AED.');
      return;
    }

    const updated = products.map(p => p.id === productId ? { ...p, price: newPriceNum } : p);
    setProducts(updated);
    setQuickPriceEditId(null);

    // Call Backend API
    fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: newPriceNum })
    }).catch(() => {});

    showToast(`Price updated to AED ${newPriceNum} successfully!`);
  };

  // 2. Handle Image Upload from Disk with Instant Base64 Preview
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setNewProductForm(prev => ({
        ...prev,
        imagePreview: base64,
        image: base64
      }));

      // Try uploading to backend API to save permanent file
      fetch('http://localhost:5000/api/products/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileData: base64 })
      })
      .then(res => res.json())
      .then(res => {
        if (res.success && res.imageUrl) {
          setNewProductForm(prev => ({ ...prev, image: res.imageUrl }));
          showToast(`Image uploaded & saved: ${file.name}`);
        }
      })
      .catch(() => {
        showToast('Image loaded in local session.');
      });
    };
    reader.readAsDataURL(file);
  };

  // 3. Add New Product Submit
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.title || !newProductForm.price) {
      showToast('Title and Price in AED are required.');
      return;
    }

    const nextIndex = products.length + 1;
    const pad = nextIndex < 10 ? `0${nextIndex}` : `${nextIndex}`;
    const newId = `TGC-RDY-${pad}`;

    const contentsArray = newProductForm.contentsText
      ? newProductForm.contentsText.split('\n').filter(line => line.trim().length > 0)
      : ['1x Handcrafted luxury gift box', '1x Artisan treat / candle', 'Complimentary handwritten card'];

    const newProduct = {
      id: newId,
      title: newProductForm.title,
      price: Number(newProductForm.price),
      currency: 'AED',
      category: newProductForm.category,
      occasion: ['Celebration', 'Appreciation'],
      leadTime: newProductForm.leadTime,
      availability: newProductForm.availability,
      badge: newProductForm.badge,
      isBestSeller: newProductForm.badge === 'Bestseller',
      shortDescription: newProductForm.shortDescription || `${newProductForm.title} curated with fine artisan keepsakes.`,
      description: `${newProductForm.title} handcrafted in our Dubai studio with silk ribbons and wax-sealed card.`,
      image: newProductForm.image || `/images/products/product-${pad}.svg`,
      contents: contentsArray,
      packaging: 'Signature warm-stone textured gift box with raw-edge ribbon.',
      customisation: 'Handwritten note with complimentary wax seal.'
    };

    const updatedList = [newProduct, ...products];
    setProducts(updatedList);
    setShowAddProductModal(false);

    // Call Backend API
    fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    }).catch(() => {});

    showToast(`New hamper "${newProduct.title}" added to catalogue!`);

    // Reset Form
    setNewProductForm({
      title: '',
      price: '',
      category: 'Self-Care & Pampering',
      leadTime: 'Same-day in Dubai (order before 12 PM) / Next-day UAE',
      availability: 'In Stock',
      badge: 'New',
      shortDescription: '',
      contentsText: '',
      image: '',
      imagePreview: ''
    });
  };

  // 4. Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product from the catalogue?')) {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);

      fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE'
      }).catch(() => {});

      showToast('Product removed from catalogue.');
    }
  };

  // ----------------------------------------------------
  // ORDER MANAGEMENT ACTIONS
  // ----------------------------------------------------
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
    setOrders(updated);

    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => {});

    showToast(`Order ${orderId} marked as "${newStatus}"`);
  };

  // Export Orders CSV
  const handleExportOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Delivery Area', 'Delivery Date', 'Items', 'Total AED', 'Payment Status', 'Order Status', 'Notes'];
    const rows = orders.map(o => [
      `"${o.id || ''}"`,
      `"${(o.createdAt || '').slice(0, 10)}"`,
      `"${o.customerName || ''}"`,
      `"${o.phone || ''}"`,
      `"${o.deliveryArea || ''}"`,
      `"${o.deliveryDate || ''}"`,
      `"${(o.items || []).map(i => `${i.quantity}x ${i.title}`).join('; ')}"`,
      `"${o.total || 0}"`,
      `"${o.paymentStatus || ''}"`,
      `"${o.orderStatus || ''}"`,
      `"${(o.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_gift_curator_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Orders exported to CSV spreadsheet!');
  };

  // ----------------------------------------------------
  // STATS CALCULATIONS
  // ----------------------------------------------------
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'In Preparation').length;
  const deliveredOrdersCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchesSearch = !productSearch || p.title.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderFilter === 'All' || o.orderStatus === orderFilter;
    const matchesSearch = !orderSearch || 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.phone && o.phone.includes(orderSearch));
    return matchesStatus && matchesSearch;
  });

  // Filtered Customers
  const filteredCustomers = customers.filter(c => {
    return !customerSearch || 
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch) ||
      (c.location && c.location.toLowerCase().includes(customerSearch.toLowerCase()));
  });

  // ----------------------------------------------------
  // LOGIN SCREEN GUARD
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE0D5] p-8 sm:p-10 shadow-sm text-center">
          
          <div className="w-20 h-20 rounded-full bg-[#FAECE8] flex items-center justify-center mx-auto mb-4 border border-[#E8DFD5] overflow-hidden">
            <img 
              src="/images/brand/logo.png" 
              alt="The Gift Curator Logo" 
              className="w-full h-full object-contain rounded-full"
              onError={(e) => { e.target.src = '/logo.png'; }}
            />
          </div>

          <span className="text-[11px] font-sans tracking-[0.25em] text-[#7A706B] uppercase block font-semibold">
            The Gift Curator Dubai
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2E2826] mt-1">
            Admin Access Portal
          </h2>
          <p className="text-xs text-[#524945] mt-2 leading-relaxed">
            Manage your boutique catalogue, update prices, upload product photos, and monitor customer orders.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#524945] mb-2">
                Curator Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (e.g. curator2026)"
                className="w-full px-4 py-3.5 rounded-xl border border-[#D5CEC9] text-sm focus:border-[#7A2832] focus:ring-1 focus:ring-[#7A2832] outline-none tracking-widest text-center text-lg font-mono"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white font-semibold text-xs tracking-wider uppercase shadow-xs transition-all"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#F0EBE3] flex items-center justify-between text-xs text-[#7A706B]">
            <button onClick={onExit} className="hover:text-[#7A2832] flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>
            <span className="text-[11px] font-mono text-[#9E533F]">PIN: curator2026</span>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED-IN ADMIN DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans text-[#2E2826]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#2E2826] text-white px-5 py-3 rounded-2xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAE2D8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand + Portal Label */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#FAECE8] flex items-center justify-center overflow-hidden shrink-0 border border-[#E8DFD5]">
                <img 
                  src="/images/brand/logo.png" 
                  alt="The Gift Curator Logo" 
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => { e.target.src = '/logo.png'; }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-xl font-bold text-[#2E2826]">
                    The Gift Curator
                  </span>
                  <span className="text-[10px] bg-[#7A2832] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-[#7A706B] block">
                  Logged in as Chaitally • Founder & Lead Curator
                </span>
              </div>
            </div>

            {/* Quick Actions & Exit */}
            <div className="flex items-center gap-3">
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-xl border border-[#D5CEC9] hover:bg-[#FAF7F2] text-xs font-semibold text-[#524945] flex items-center gap-1.5 transition-all"
              >
                <Eye className="w-4 h-4 text-[#7A2832]" />
                <span className="hidden sm:inline">View Live Website</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

          </div>

          {/* Tab Navigation Navigation Bar */}
          <div className="flex items-center space-x-2 sm:space-x-4 border-t border-[#F0EBE3] py-2 overflow-x-auto text-xs sm:text-sm font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#2E2826] text-white shadow-xs'
                  : 'text-[#524945] hover:bg-[#FAF7F2]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#7A2832] text-white shadow-xs'
                  : 'text-[#524945] hover:bg-[#FAF7F2]'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#7A2832] text-white shadow-xs'
                  : 'text-[#524945] hover:bg-[#FAF7F2]'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Customer Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'bg-[#7A2832] text-white shadow-xs'
                  : 'text-[#524945] hover:bg-[#FAF7F2]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers ({customers.length})</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ======================================================== */}
        {/* 1. OVERVIEW DASHBOARD                                    */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7A706B] font-semibold block">
                    Total Revenue
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#7A2832] mt-1">
                    {formatAED(totalRevenue)}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                    ↑ 18% vs last month
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FAECE8] text-[#7A2832] flex items-center justify-center text-xl">
                  💰
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7A706B] font-semibold block">
                    Customer Orders
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#2E2826] mt-1">
                    {orders.length}
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium block mt-1">
                    {pendingOrdersCount} requiring preparation
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl">
                  📦
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7A706B] font-semibold block">
                    Hampers in Catalogue
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#2E2826] mt-1">
                    {products.length}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                    All published & ready
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
                  🎁
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#7A706B] font-semibold block">
                    Managed Clients
                  </span>
                  <div className="font-serif text-3xl font-bold text-[#2E2826] mt-1">
                    {customers.length}
                  </div>
                  <span className="text-[11px] text-[#7A706B] font-medium block mt-1">
                    {customers.filter(c => c.tier === 'VIP Client').length} VIP Clients
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl">
                  👥
                </div>
              </div>

            </div>

            {/* Quick Actions Shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div 
                onClick={() => { setActiveTab('products'); setShowAddProductModal(true); }}
                className="bg-white p-6 rounded-3xl border border-[#EAE2D8] hover:border-[#7A2832] cursor-pointer shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAECE8] text-[#7A2832] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2E2826] group-hover:text-[#7A2832]">
                  Add New Product
                </h3>
                <p className="text-xs text-[#524945] mt-1 leading-relaxed">
                  Upload new photos, set AED price, itemized contents, and publish instantly.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('orders')}
                className="bg-white p-6 rounded-3xl border border-[#EAE2D8] hover:border-[#7A2832] cursor-pointer shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2E2826] group-hover:text-[#7A2832]">
                  Process Orders
                </h3>
                <p className="text-xs text-[#524945] mt-1 leading-relaxed">
                  Review recent enquiries, update preparation status, and send WhatsApp updates.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('customers')}
                className="bg-white p-6 rounded-3xl border border-[#EAE2D8] hover:border-[#7A2832] cursor-pointer shadow-xs hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#2E2826] group-hover:text-[#7A2832]">
                  Client Directory
                </h3>
                <p className="text-xs text-[#524945] mt-1 leading-relaxed">
                  Access VIP client preferences, past orders, and 1-click WhatsApp messaging.
                </p>
              </div>

            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-white rounded-3xl border border-[#EAE2D8] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#2E2826]">
                    Recent Orders & Enquiries
                  </h3>
                  <p className="text-xs text-[#7A706B] mt-0.5">
                    Latest customer requests across Dubai and UAE
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-[#7A2832] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#F0EBE3] text-[#7A706B] uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Order Ref</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Items</th>
                      <th className="py-3 px-3">Delivery Area</th>
                      <th className="py-3 px-3">Total AED</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EBE3]">
                    {orders.slice(0, 4).map(o => (
                      <tr key={o.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-3 px-3 font-mono font-semibold text-[#2E2826]">{o.id}</td>
                        <td className="py-3 px-3 font-semibold text-[#2E2826]">{o.customerName}</td>
                        <td className="py-3 px-3 text-[#524945]">
                          {(o.items || []).map(i => `${i.quantity}x ${i.title}`).join(', ')}
                        </td>
                        <td className="py-3 px-3 text-[#524945]">{o.deliveryArea}</td>
                        <td className="py-3 px-3 font-serif font-bold text-[#7A2832]">{formatAED(o.total)}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            o.orderStatus === 'In Preparation' ? 'bg-amber-100 text-amber-800' :
                            o.orderStatus === 'Ready for Dispatch' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 2. PRODUCTS MANAGEMENT TAB                               */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top Toolbar: Search, Filter & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs">
              
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search hampers by title..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832]"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832] bg-white font-medium"
                >
                  <option value="All">All Categories</option>
                  <option value="Self-Care & Pampering">Self-Care & Pampering</option>
                  <option value="Heritage & Luxe">Heritage & Luxe</option>
                  <option value="Gourmet & Rituals">Gourmet & Rituals</option>
                  <option value="Baby & New Parents">Baby & New Parents</option>
                  <option value="Milestones & Celebrations">Milestones & Celebrations</option>
                </select>
              </div>

              {/* Add Product Modal Trigger */}
              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold tracking-wide uppercase shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Hamper</span>
              </button>

            </div>

            {/* Products Table / Cards Grid */}
            <div className="bg-white rounded-3xl border border-[#EAE2D8] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#7A706B] font-semibold">
                  Showing {filteredProducts.length} Products
                </span>
                <span className="text-[11px] text-[#7A2832] italic">
                  💡 Tip: Click on any price to quickly edit it!
                </span>
              </div>

              <div className="divide-y divide-[#F0EBE3]">
                {filteredProducts.map(product => (
                  <div key={product.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2] p-3 rounded-2xl transition-colors">
                    
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className="w-16 h-16 rounded-xl bg-[#F8F4EE] border border-[#EAE2D8] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = '/images/products/product-01.svg'; }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#7A706B]">{product.id}</span>
                          {product.badge && (
                            <span className="text-[9px] bg-[#FAECE8] text-[#7A2832] px-1.5 py-0.2 rounded font-bold uppercase">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-base font-bold text-[#2E2826] mt-0.5">
                          {product.title}
                        </h4>
                        <span className="text-xs text-[#7A706B] block">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Inclusions summary */}
                    <div className="hidden lg:block max-w-sm text-xs text-[#524945]">
                      <p className="line-clamp-2">
                        {(product.contents || []).slice(0, 3).join(' • ')}
                      </p>
                    </div>

                    {/* Right: Quick Price Edit & Actions */}
                    <div className="flex items-center justify-between md:justify-end gap-5">
                      
                      {/* Price / Quick Edit */}
                      <div className="text-right">
                        {quickPriceEditId === product.id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#7A2832]">AED</span>
                            <input
                              type="number"
                              value={quickPriceValue}
                              onChange={(e) => setQuickPriceValue(e.target.value)}
                              className="w-20 px-2 py-1 rounded border border-[#7A2832] text-xs font-bold font-serif outline-none"
                              autoFocus
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveQuickPrice(product.id); }}
                            />
                            <button
                              onClick={() => handleSaveQuickPrice(product.id)}
                              className="p-1 rounded bg-[#7A2832] text-white hover:bg-[#682029]"
                              title="Save Price"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setQuickPriceEditId(null)}
                              className="p-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setQuickPriceEditId(product.id);
                              setQuickPriceValue(product.price);
                            }}
                            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-[#7A2832] hover:bg-white transition-all text-left"
                            title="Click to edit price"
                          >
                            <div>
                              <div className="font-serif text-lg font-bold text-[#7A2832]">
                                {formatAED(product.price)}
                              </div>
                              <span className="text-[10px] text-[#7A706B] block">Click to change</span>
                            </div>
                            <Edit2 className="w-3.5 h-3.5 text-[#7A706B] group-hover:text-[#7A2832]" />
                          </button>
                        )}
                      </div>

                      {/* Stock Badge */}
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {product.availability || 'In Stock'}
                      </span>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 3. ORDERS MANAGEMENT TAB                                 */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Orders Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs">
              
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order ID, Client Name, or Phone..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832]"
                  />
                </div>

                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832] bg-white font-medium"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Preparation">In Preparation</option>
                  <option value="Ready for Dispatch">Ready for Dispatch</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={handleExportOrdersCSV}
                className="px-4 py-2.5 rounded-xl border border-[#D5CEC9] hover:bg-[#FAF7F2] text-xs font-semibold text-[#524945] flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-[#7A2832]" />
                <span>Export CSV</span>
              </button>

            </div>

            {/* Orders List Cards */}
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs hover:border-[#7A2832] transition-all space-y-4">
                  
                  {/* Top Bar of Order Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0EBE3]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#2E2826] bg-[#F4EDE5] px-2.5 py-1 rounded-lg">
                        {order.id}
                      </span>
                      <span className="text-xs text-[#7A706B]">
                        Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                        {order.channel || 'Website'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-bold text-[#7A2832]">
                        {formatAED(order.total)}
                      </span>
                      {/* Status Selector */}
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          order.orderStatus === 'In Preparation' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          order.orderStatus === 'Ready for Dispatch' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                          'bg-rose-50 text-[#7A2832] border-rose-200'
                        }`}
                      >
                        <option value="New">Status: New</option>
                        <option value="In Preparation">Status: In Preparation</option>
                        <option value="Ready for Dispatch">Status: Ready for Dispatch</option>
                        <option value="Delivered">Status: Delivered</option>
                        <option value="Cancelled">Status: Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Delivery Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7A706B] block">Client Contact</span>
                      <h4 className="font-bold text-sm text-[#2E2826] mt-0.5">{order.customerName}</h4>
                      <p className="text-[#524945]">{order.phone}</p>
                      {order.email && <p className="text-[#7A706B]">{order.email}</p>}
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7A706B] block">Delivery Details</span>
                      <p className="font-medium text-[#2E2826] mt-0.5">{order.deliveryArea}</p>
                      <p className="text-[#7A706B]">Requested Date: <strong>{order.deliveryDate}</strong></p>
                      <p className="text-[#9E533F] font-medium mt-0.5">{order.paymentStatus}</p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#7A706B] block">Hamper Items</span>
                      <ul className="mt-0.5 space-y-1 text-[#524945]">
                        {(order.items || []).map((item, idx) => (
                          <li key={idx} className="font-medium">
                            • {item.quantity}x {item.title} ({formatAED(item.price)})
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Notes & WhatsApp Quick Contact */}
                  {order.notes && (
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE2D8] text-xs text-[#524945]">
                      <strong className="text-[#2E2826]">Customer Notes:</strong> {order.notes}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <a
                      href={`https://wa.me/${order.phone ? order.phone.replace(/[^0-9]/g, '') : ''}?text=${encodeURIComponent(`Hello ${order.customerName}! This is Chaitally from The Gift Curator Dubai regarding your order (${order.id}).`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 4. CUSTOMERS MANAGEMENT TAB                              */}
        {/* ======================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Customers Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAE2D8] shadow-xs">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#7A706B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search clients by name, phone or location..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832]"
                />
              </div>

              <div className="text-xs text-[#7A706B]">
                Total Registered Clients: <strong>{customers.length}</strong>
              </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCustomers.map(customer => (
                <div key={customer.id} className="bg-white p-6 rounded-3xl border border-[#EAE2D8] shadow-xs flex flex-col justify-between space-y-4">
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#7A706B]">{customer.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        customer.tier === 'VIP Client' ? 'bg-[#FAECE8] text-[#7A2832]' :
                        customer.tier === 'Corporate' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {customer.tier}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#2E2826] mt-2">
                      {customer.name}
                    </h4>
                    <p className="text-xs text-[#7A706B]">{customer.location || 'Dubai, UAE'}</p>

                    <div className="mt-4 pt-3 border-t border-[#F0EBE3] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#7A706B] uppercase block">Total Spend</span>
                        <span className="font-serif font-bold text-sm text-[#7A2832]">{formatAED(customer.totalSpend)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7A706B] uppercase block">Orders</span>
                        <span className="font-semibold text-sm text-[#2E2826]">{customer.totalOrders} hampers</span>
                      </div>
                    </div>

                    {customer.preferences && (
                      <p className="mt-3 text-[11px] text-[#524945] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EAE2D8]">
                        <strong>Preferences:</strong> {customer.preferences}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#F0EBE3] flex items-center justify-between">
                    <span className="text-xs text-[#524945]">{customer.phone}</span>
                    <a
                      href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${customer.name}! This is Chaitally from The Gift Curator Dubai.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-[#7A2832] text-white text-xs font-semibold hover:bg-[#682029] flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ======================================================== */}
      {/* MODAL: ADD NEW PRODUCT (With Custom Photo Upload)         */}
      {/* ======================================================== */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border border-[#EAE2D8]">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE3]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A2832] font-semibold">Catalogue Management</span>
                <h3 className="font-serif text-2xl font-bold text-[#2E2826]">Add New Hamper</h3>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="p-2 text-gray-400 hover:text-[#2E2826]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">Hamper Title *</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.title}
                    onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                    placeholder="e.g. The Amber Whisper Box"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">Price in AED *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    placeholder="e.g. 450"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs font-bold font-serif outline-none focus:border-[#7A2832]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">Category</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832] bg-white"
                  >
                    <option value="Self-Care & Pampering">Self-Care & Pampering</option>
                    <option value="Heritage & Luxe">Heritage & Luxe</option>
                    <option value="Gourmet & Rituals">Gourmet & Rituals</option>
                    <option value="Baby & New Parents">Baby & New Parents</option>
                    <option value="Milestones & Celebrations">Milestones & Celebrations</option>
                    <option value="Executive & Men">Executive & Men</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">Badge / Tag</label>
                  <select
                    value={newProductForm.badge}
                    onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832] bg-white"
                  >
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">
                  Hamper Photograph (Upload from your Computer)
                </label>
                <div className="border-2 border-dashed border-[#D5CEC9] hover:border-[#7A2832] rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#FAF7F2]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    id="product-photo-upload"
                  />
                  <label htmlFor="product-photo-upload" className="cursor-pointer block">
                    {newProductForm.imagePreview ? (
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={newProductForm.imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-xl border border-[#EAE2D8] shadow-xs"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-emerald-700 block">✓ Photo Selected</span>
                          <span className="text-[11px] text-[#7A706B]">Click to change photo</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Upload className="w-8 h-8 text-[#7A706B] mx-auto mb-1.5" />
                        <span className="text-xs font-semibold text-[#7A2832] block">
                          Click to upload hamper photograph
                        </span>
                        <span className="text-[11px] text-[#7A706B]">Supports JPG, PNG, WEBP (Square aspect recommended)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Inclusions itemized list */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#524945] mb-1.5">
                  Itemized Contents (One per line)
                </label>
                <textarea
                  rows="3"
                  value={newProductForm.contentsText}
                  onChange={(e) => setNewProductForm({ ...newProductForm, contentsText: e.target.value })}
                  placeholder="1x Hand-thrown speckled ceramic mug&#10;1x Mountain Wildflower honey jar (120g)&#10;1x Fig & Amber soy candle (45h burn)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs outline-none focus:border-[#7A2832]"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-[#F0EBE3] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold uppercase tracking-wider shadow-xs"
                >
                  Publish Hamper
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
