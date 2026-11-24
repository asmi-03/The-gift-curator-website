import fallbackProducts from '../data/products.json';
import fallbackCreations from '../data/creations.json';
import fallbackFaqs from '../data/faqs.json';
import fallbackConfig from '../data/siteConfig.json';
import { generateReferenceId, saveEnquiryLocally, getStoredEnquiries, updateEnquiryStatus as updateLocalStatus } from '../utils/whatsapp';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Safe fetch with timeout and automatic fallback to local JSON data
async function safeFetch(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Backend offline or unreachable — use graceful fallback
    return null;
  }
}

// 1. Fetch Products
export async function getProducts(filters = {}) {
  const query = new URLSearchParams();
  if (filters.category && filters.category !== 'All') query.append('category', filters.category);
  if (filters.budget && filters.budget !== 'All') query.append('budget', filters.budget);

  const data = await safeFetch(`/products?${query.toString()}`);
  if (data) return data;

  // Fallback to local data
  return fallbackProducts.filter(item => {
    if (filters.category && filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.budget === 'under-250' && item.price >= 250) return false;
    if (filters.budget === '250-350' && (item.price < 250 || item.price > 350)) return false;
    if (filters.budget === 'above-350' && item.price <= 350) return false;
    return true;
  });
}

// 2. Fetch Portfolio Creations
export async function getCreations() {
  const data = await safeFetch('/creations');
  return data || fallbackCreations;
}

// 3. Fetch FAQs & Policies
export async function getFaqs() {
  const data = await safeFetch('/faqs');
  return data || fallbackFaqs;
}

// 4. Fetch Site Config
export async function getConfig() {
  const data = await safeFetch('/config');
  return data || fallbackConfig;
}

// 5. Submit Curate Enquiry
export async function submitEnquiry(enquiryData) {
  const remote = await safeFetch('/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(enquiryData)
  });

  if (remote && remote.success) {
    // Also save in local storage for offline owner portal access
    saveEnquiryLocally(remote.enquiry);
    return remote;
  }

  // If backend is offline, generate ref and save locally
  const refId = generateReferenceId('TGC-CUR');
  const record = {
    ...enquiryData,
    referenceId: refId,
    timestamp: new Date().toISOString(),
    status: 'New'
  };
  saveEnquiryLocally(record);
  return { success: true, referenceId: refId, enquiry: record };
}

// 6. Submit Corporate RFQ
export async function submitCorporateRfq(rfqData) {
  const remote = await safeFetch('/corporate-rfq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rfqData)
  });

  if (remote && remote.success) {
    saveEnquiryLocally(remote.rfq);
    return remote;
  }

  const refId = generateReferenceId('TGC-CORP');
  const record = {
    ...rfqData,
    referenceId: refId,
    timestamp: new Date().toISOString(),
    status: 'New'
  };
  saveEnquiryLocally(record);
  return { success: true, referenceId: refId, rfq: record };
}

// 7. Get Enquiries for Owner
export async function getOwnerEnquiries() {
  const remote = await safeFetch('/enquiries');
  if (remote && Array.isArray(remote)) return remote;
  return getStoredEnquiries();
}

// 8. Update Enquiry Status
export async function updateStatus(refId, newStatus) {
  const remote = await safeFetch(`/enquiries/${refId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  updateLocalStatus(refId, newStatus);
  return remote || { success: true };
}
