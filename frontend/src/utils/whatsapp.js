import siteConfig from '../data/siteConfig.json';

// Detect whether user is on a mobile device or desktop
export const isMobileDevice = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Clean phone number for WhatsApp URL (digits only)
export const getCleanWhatsAppNumber = (overrideNumber) => {
  let stored = null;
  if (typeof window !== 'undefined') {
    stored = localStorage.getItem('tgc_owner_whatsapp');
    // Wipe old placeholder if present in user's browser
    if (stored && (stored.includes('1234567') || stored.includes('123 4567') || stored.includes('+971501234567'))) {
      try { localStorage.removeItem('tgc_owner_whatsapp'); } catch (_) {}
      stored = null;
    }
  }
  const num = overrideNumber || stored || siteConfig.whatsappNumber || '971566799672';
  return (num || '971566799672').replace(/[^0-9]/g, '');
};

// Open WhatsApp link with fallback for pop-up blockers
export const openWhatsAppDirect = (url) => {
  if (typeof window === 'undefined') return;
  const win = window.open(url, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = url;
  }
};

// Build smart direct WhatsApp link:
// - On Desktop: opens WhatsApp Web directly with chat & pre-filled message (no "Download app" barrier)
// - On Mobile: opens WhatsApp native app directly
export const buildWhatsAppUrl = (text = '', customNumber = null) => {
  const phone = getCleanWhatsAppNumber(customNumber);
  const encoded = encodeURIComponent(text || '');
  if (typeof window !== 'undefined' && !isMobileDevice()) {
    // Desktop: Direct to WhatsApp Web chat
    return `https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`;
  }
  // Mobile: Direct to WhatsApp app
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`;
};

// Generate unique enquiry reference TGC-2026-XXXX
export const generateReferenceId = (prefix = 'TGC') => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

// Format Currency
export const formatAED = (amount) => {
  if (typeof amount !== 'number') return amount;
  return `AED ${amount.toLocaleString('en-AE')}`;
};

// Generate WhatsApp link for Ready-to-Gift hamper
export const createProductWhatsAppUrl = (product, customNote = '') => {
  const message = `Hello The Gift Curator! 🎁

I would like to order / enquire about a Ready-to-Gift hamper:

• Hamper: ${product.title}
• Reference: ${product.id}
• Price: AED ${product.price}
• Availability: ${product.availability || 'In Stock'}
${customNote ? `• Card Note: "${customNote}"\n` : ''}
Could you please confirm availability, delivery charges for my address, and payment details?

Thank you!`;

  return buildWhatsAppUrl(message);
};

// Generate WhatsApp link for Curate My Gift enquiry
export const createCurateWhatsAppUrl = (enquiry) => {
  const message = `Hello The Gift Curator! 🌸

I would like to request a Personalised Gifting Concept:

• Reference ID: ${enquiry.referenceId}
• Occasion: ${enquiry.occasion || 'Not specified'}
• Recipient: ${enquiry.relationship || 'Not specified'}
• Budget Range: ${enquiry.budget || 'AED 150 – 250'}
• Recipient Interests: ${enquiry.interests && enquiry.interests.length > 0 ? enquiry.interests.join(', ') : 'Open to ideas'}
${enquiry.exclusions ? `• Dietary / Exclusions: ${enquiry.exclusions}\n` : ''}• Preferred Delivery Date: ${enquiry.deliveryDate || 'Flexible / To be confirmed'}
• Delivery Emirate: ${enquiry.deliveryArea || 'Dubai'}
${enquiry.deliveryAddress ? `• Delivery Address: ${enquiry.deliveryAddress}\n` : ''}• Sender Name: ${enquiry.senderName || 'Anonymous'}

Looking forward to your complimentary concept and indicative quotation!`;

  return buildWhatsAppUrl(message);
};

// Generate WhatsApp link for Corporate Enquiry
export const createCorporateWhatsAppUrl = (corporateData) => {
  const message = `Hello The Gift Curator! 🏢

We would like to request a Corporate / Bulk Gifting Quote:

• Reference ID: ${corporateData.referenceId}
• Company Name: ${corporateData.companyName}
• Contact Person: ${corporateData.contactName}
• Estimated Quantity: ${corporateData.quantity} units
• Target Budget per Unit: ${corporateData.budgetPerUnit}
• Purpose / Occasion: ${corporateData.purpose || 'Client / Employee Appreciation'}
• Target Delivery Date: ${corporateData.targetDate || 'To be aligned'}
• Custom Branding Needed: ${corporateData.brandingRequired ? 'Yes (Logo Ribbon / Branded Card)' : 'No / Neutral'}

Please share your proposal and catalogue for bulk volume.`;

  return buildWhatsAppUrl(message);
};

// Store enquiry to local storage for Owner Dashboard / CSV export (Section 9)
export const saveEnquiryLocally = (enquiryData) => {
  try {
    const existing = JSON.parse(localStorage.getItem('tgc_enquiries') || '[]');
    const record = {
      ...enquiryData,
      timestamp: new Date().toISOString(),
      status: 'New',
    };
    existing.unshift(record);
    localStorage.setItem('tgc_enquiries', JSON.stringify(existing));
    return record;
  } catch (err) {
    console.error('Failed to save enquiry locally:', err);
    return enquiryData;
  }
};

// Get stored enquiries
export const getStoredEnquiries = () => {
  try {
    return JSON.parse(localStorage.getItem('tgc_enquiries') || '[]');
  } catch {
    return [];
  }
};

// Update status of enquiry
export const updateEnquiryStatus = (refId, newStatus) => {
  try {
    const list = getStoredEnquiries();
    const updated = list.map(item => item.referenceId === refId ? { ...item, status: newStatus } : item);
    localStorage.setItem('tgc_enquiries', JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};
