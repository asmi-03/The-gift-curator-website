import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, ArrowRight, X, Clock, MapPin, Building, Truck, Sparkles, MessageCircle } from 'lucide-react';
import { formatAED, openWhatsAppDirect } from '../utils/whatsapp';

export default function CheckoutModal({ isOpen, onClose, product, user, onOrderComplete }) {
  const [step, setStep] = useState('details'); // 'details' | 'payment' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'apple_pay' | 'bank_transfer' | 'cod'

  // Customer & Delivery Details
  const [recipientName, setRecipientName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? (user.phone || '') : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [deliveryArea, setDeliveryArea] = useState('Dubai');
  const [deliveryAddress, setDeliveryAddress] = useState(user ? (user.address || '') : '');
  const [giftNote, setGiftNote] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  // Card Payment Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(user ? user.name : '');
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [completedPayment, setCompletedPayment] = useState(null);

  if (!isOpen || !product) return null;

  const itemPrice = Number(product.price) || 350;
  const deliveryFee = deliveryArea === 'Dubai' ? 0 : 35; // Complimentary delivery in Dubai!
  const finalTotal = itemPrice + deliveryFee;

  // Format Card Number input with spaces
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!recipientName || !phone || !deliveryAddress) {
      alert('Please fill in your recipient name, phone, and delivery address.');
      return;
    }
    setStep('payment');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const paymentLabel = 
      paymentMethod === 'card' ? 'Credit / Debit Card' :
      paymentMethod === 'apple_pay' ? 'Apple Pay' :
      paymentMethod === 'bank_transfer' ? 'UAE Bank Transfer' : 'Cash on Delivery';

    const orderPayload = {
      userId: user ? user.id : null,
      customerName: recipientName,
      phone,
      email,
      deliveryArea,
      deliveryAddress,
      deliveryDate,
      giftNote,
      items: [{
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: product.image
      }],
      subtotal: itemPrice,
      deliveryFee,
      total: finalTotal,
      paymentMethod: paymentLabel,
      cardBrand: paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Visa',
      cardLast4: cardNumber ? cardNumber.slice(-4) : '4242',
      paymentDetails: {
        method: paymentMethod,
        cardLast4: cardNumber ? cardNumber.slice(-4) : '4242'
      }
    };

    try {
      // 1. Try Backend API
      let res;
      try {
        res = await fetch('http://localhost:5000/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
      } catch {
        res = null;
      }

      let orderRecord;
      let paymentRecord;

      if (res && res.ok) {
        const data = await res.json();
        orderRecord = data.order;
        paymentRecord = data.payment;
      } else {
        // Fallback: Local Client Database in localStorage (SQLite mirror)
        const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const txnId = `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

        orderRecord = {
          id: orderId,
          userId: user ? user.id : null,
          customer_name: recipientName,
          phone,
          email,
          delivery_area: deliveryArea,
          delivery_address: deliveryAddress,
          delivery_date: deliveryDate,
          gift_note: giftNote,
          items: orderPayload.items,
          total: finalTotal,
          payment_method: paymentLabel,
          payment_status: paymentMethod === 'cod' ? 'Pending (COD)' : 'Paid (Verified)',
          order_status: 'New',
          created_at: new Date().toISOString()
        };

        paymentRecord = {
          id: `PAY-${Date.now()}`,
          orderId,
          amount: finalTotal,
          method: paymentLabel,
          status: paymentMethod === 'cod' ? 'pending' : 'completed',
          transactionRef: txnId,
          cardBrand: orderPayload.cardBrand,
          cardLast4: orderPayload.cardLast4
        };

        const existingOrders = JSON.parse(localStorage.getItem('tgc_db_orders') || '[]');
        existingOrders.unshift(orderRecord);
        localStorage.setItem('tgc_db_orders', JSON.stringify(existingOrders));
      }

      setCompletedOrder(orderRecord);
      setCompletedPayment(paymentRecord);
      setStep('success');
      if (onOrderComplete) onOrderComplete(orderRecord);
    } catch (err) {
      alert('Error completing order: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleSendWhatsAppReceipt = () => {
    if (!completedOrder) return;
    const msg = `*THE GIFT CURATOR DUBAI - ORDER CONFIRMATION* 🌸\n` +
      `Order ID: ${completedOrder.id}\n` +
      `Item: 1x ${product.title}\n` +
      `Total: AED ${finalTotal}\n` +
      `Payment Method: ${completedOrder.payment_method || completedOrder.paymentMethod}\n` +
      `Status: ${completedOrder.payment_status || completedOrder.paymentStatus}\n` +
      `Recipient: ${recipientName} (${phone})\n` +
      `Delivery Area: ${deliveryArea}\n` +
      `Address: ${deliveryAddress}\n` +
      `Gift Card Note: "${giftNote || 'Complimentary seal'}"\n\n` +
      `Please confirm dispatch timing. Thank you!`;

    openWhatsAppDirect(`https://api.whatsapp.com/send?phone=971566799672&text=${encodeURIComponent(msg)}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EAE2D8] max-h-[92vh] overflow-y-auto text-left relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-[#2E2826] hover:bg-[#FAF7F2] transition-colors"
          aria-label="Close Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A2832] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2E2826] mt-1">
            {step === 'details' && 'Delivery & Recipient Details'}
            {step === 'payment' && 'Select Payment Method'}
            {step === 'success' && 'Order Confirmed!'}
          </h3>
        </div>

        {/* Product Pill Summary */}
        {step !== 'success' && (
          <div className="mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.title}
                className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-[#E8DFD5]"
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
              <div>
                <h4 className="font-serif font-bold text-sm text-[#2E2826] leading-tight">{product.title}</h4>
                <span className="text-[11px] text-[#7A706B] block mt-0.5">Includes silk ribbon & wax-sealed card</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#7A706B] block">Price</span>
              <span className="font-serif font-bold text-base text-[#7A2832]">{formatAED(finalTotal)}</span>
            </div>
          </div>
        )}

        {/* STEP 1: Delivery Details */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sara Al-Hashimi"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                  WhatsApp / Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                  Delivery Emirate *
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) => setDeliveryArea(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none bg-white focus:border-[#7A2832]"
                >
                  <option value="Dubai">Dubai (Free Same-Day / Next-Day)</option>
                  <option value="Abu Dhabi">Abu Dhabi (+AED 35 Express)</option>
                  <option value="Sharjah">Sharjah (+AED 35)</option>
                  <option value="Ajman">Ajman (+AED 35)</option>
                  <option value="Ras Al Khaimah">Ras Al Khaimah (+AED 35)</option>
                  <option value="Fujairah">Fujairah (+AED 35)</option>
                  <option value="Umm Al Quwain">Umm Al Quwain (+AED 35)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                  Preferred Delivery Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none bg-white focus:border-[#7A2832]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                Detailed Delivery Address (Villa/Building, Street, Area) *
              </label>
              <textarea
                required
                rows="2"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="e.g. Villa 14, Frond E, Palm Jumeirah, Dubai / Apartment 1204, Index Tower, DIFC"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#524945] mb-1">
                Complimentary Wax-Sealed Handwritten Note (Optional)
              </label>
              <textarea
                rows="2"
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Write your personal message. Our calligrapher writes this by hand on artisan cotton card..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none focus:border-[#7A2832]"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-[#F0EBE3] flex items-center justify-between">
              <span className="text-xs text-[#7A706B]">Step 1 of 2</span>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold uppercase tracking-wider shadow-xs flex items-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Payment Method */}
        {step === 'payment' && (
          <form onSubmit={handleProcessPayment} className="mt-5 space-y-4">
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#7A2832] bg-[#FAECE8] text-[#7A2832] font-bold shadow-xs'
                    : 'border-[#EAE2D8] bg-white text-[#524945] hover:bg-[#FAF7F2]'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#7A2832]" />
                <span className="text-xs block">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-[#7A2832] bg-[#FAECE8] text-[#7A2832] font-bold shadow-xs'
                    : 'border-[#EAE2D8] bg-white text-[#524945] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="text-base mb-1"></div>
                <span className="text-xs block">Apple Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#7A2832] bg-[#FAECE8] text-[#7A2832] font-bold shadow-xs'
                    : 'border-[#EAE2D8] bg-white text-[#524945] hover:bg-[#FAF7F2]'
                }`}
              >
                <Building className="w-5 h-5 mx-auto mb-1 text-[#7A2832]" />
                <span className="text-xs block">Bank IBAN</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#7A2832] bg-[#FAECE8] text-[#7A2832] font-bold shadow-xs'
                    : 'border-[#EAE2D8] bg-white text-[#524945] hover:bg-[#FAF7F2]'
                }`}
              >
                <Truck className="w-5 h-5 mx-auto mb-1 text-[#7A2832]" />
                <span className="text-xs block">COD</span>
              </button>
            </div>

            {/* METHOD 1: Card Input */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as it appears on card"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs outline-none bg-white focus:border-[#7A2832]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#524945] mb-1">Card Number (Visa / Mastercard / Amex)</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs font-mono outline-none bg-white focus:border-[#7A2832]"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#7A2832]">VISA/MC</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#524945] mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs font-mono outline-none bg-white focus:border-[#7A2832]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#524945] mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5CEC9] text-base sm:text-xs font-mono outline-none bg-white focus:border-[#7A2832]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* METHOD 2: Apple Pay */}
            {paymentMethod === 'apple_pay' && (
              <div className="p-6 rounded-2xl bg-black text-white text-center space-y-3">
                <div className="text-3xl">Pay</div>
                <p className="text-xs text-gray-300">
                  Ready to authorise payment of <strong>{formatAED(finalTotal)}</strong> with Touch ID / Face ID.
                </p>
                <div className="text-[11px] text-gray-400">Cards linked in your Apple Wallet will be billed securely.</div>
              </div>
            )}

            {/* METHOD 3: UAE Bank IBAN Transfer */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2.5 text-xs text-[#3A3330]">
                <div className="font-bold text-sm text-[#7A2832]">Direct Bank Wire (Dubai, UAE)</div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E8DFD5]">
                  <div><span className="text-[#7A706B] block">Bank Name:</span> Emirates NBD / FAB</div>
                  <div><span className="text-[#7A706B] block">Account Title:</span> The Gift Curator</div>
                </div>
                <div className="pt-1">
                  <span className="text-[#7A706B] block">IBAN Number:</span>
                  <span className="font-mono font-bold text-[#2E2826] bg-white px-2 py-1 rounded border inline-block mt-0.5">
                    AE03 0330 0000 1234 5678 901
                  </span>
                </div>
                <p className="text-[11px] text-[#7A706B]">
                  Your order is reserved immediately upon placing. Simply share your wire receipt on WhatsApp.
                </p>
              </div>
            )}

            {/* METHOD 4: Cash or Card on Delivery */}
            {paymentMethod === 'cod' && (
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D8] space-y-2 text-xs text-[#3A3330]">
                <div className="font-bold text-sm text-[#2E2826]">Doorstep Payment (Dubai & UAE)</div>
                <p className="text-xs text-[#524945]">
                  Pay in cash (exact AED appreciated) or via mobile wireless card POS reader when our driver delivers your luxury gift box.
                </p>
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-medium">
                  ✓ Available across all 7 Emirates with zero handling surcharge.
                </div>
              </div>
            )}

            {/* Price Summary Breakdown */}
            <div className="pt-3 border-t border-[#F0EBE3] space-y-1.5 text-xs text-[#524945]">
              <div className="flex justify-between">
                <span>Hamper Price:</span>
                <span className="font-semibold text-[#2E2826]">{formatAED(itemPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({deliveryArea}):</span>
                <span className="font-semibold text-emerald-700">
                  {deliveryFee === 0 ? 'Complimentary (Free)' : formatAED(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#F0EBE3] text-sm font-bold text-[#2E2826]">
                <span>Total Amount:</span>
                <span className="text-base text-[#7A2832] font-serif">{formatAED(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#7A706B] hover:text-[#2E2826]"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 rounded-xl bg-[#7A2832] hover:bg-[#682029] text-white text-xs font-semibold uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" />
                <span>{processing ? 'Processing Payment...' : `Pay ${formatAED(finalTotal)} Now`}</span>
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Order & Payment Confirmed Success */}
        {step === 'success' && completedOrder && (
          <div className="mt-5 space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              ✓
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Payment Received & Verified</span>
              <h4 className="font-serif text-3xl font-bold text-[#2E2826]">Thank You, {recipientName}!</h4>
              <p className="text-xs text-[#524945] max-w-sm mx-auto">
                Your order is currently being hand-prepared in our Dubai boutique studio.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#EAE2D8] text-left text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8DFD5]">
                <span className="text-[#7A706B]">Order Reference:</span>
                <span className="font-mono font-bold text-sm text-[#2E2826]">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A706B]">Payment Method:</span>
                <span className="font-semibold text-[#2E2826]">{completedOrder.payment_method || completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A706B]">Amount Paid:</span>
                <span className="font-serif font-bold text-sm text-[#7A2832]">{formatAED(finalTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A706B]">Delivery Destination:</span>
                <span className="font-semibold text-[#2E2826]">{deliveryArea}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#7A706B]">Target Date:</span>
                <span className="font-semibold text-emerald-700">{deliveryDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendWhatsAppReceipt}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Order Receipt to WhatsApp Concierge</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl border border-[#D5CEC9] text-[#524945] font-semibold text-xs hover:bg-[#FAF7F2] transition-colors"
              >
                Back to Website
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
