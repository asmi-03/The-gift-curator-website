import React, { useState, useEffect } from 'react';
import { X, Lock, Download, Phone, RefreshCw, CheckCircle, FileSpreadsheet, Eye, Save, Trash2 } from 'lucide-react';
import { getStoredEnquiries, updateEnquiryStatus } from '../utils/whatsapp';
import siteConfig from '../data/siteConfig.json';

export default function OwnerPortalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [enquiries, setEnquiries] = useState([]);
  const [activeTab, setActiveTab] = useState('enquiries'); // 'enquiries' | 'settings' | 'guide'
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const statuses = [
    'New',
    'Awaiting Details',
    'Concept Shared',
    'Awaiting Deposit',
    'Confirmed',
    'In Preparation',
    'Ready for Dispatch',
    'Completed',
    'Closed / Not Proceeding'
  ];

  useEffect(() => {
    setEnquiries(getStoredEnquiries());
    const saved = localStorage.getItem('tgc_owner_whatsapp') || siteConfig.whatsappNumber;
    setWhatsappPhone(saved);
  }, [isOpen]);

  const handleStatusChange = (refId, newStatus) => {
    const updated = updateEnquiryStatus(refId, newStatus);
    setEnquiries(updated);
  };

  const handleSavePhone = (e) => {
    e.preventDefault();
    localStorage.setItem('tgc_owner_whatsapp', whatsappPhone);
    setSaveMessage('WhatsApp Business number updated successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const exportToCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export yet.');
      return;
    }

    const headers = ['Reference ID', 'Timestamp', 'Status', 'Sender Name', 'WhatsApp / Phone', 'Occasion', 'Recipient', 'Budget', 'Interests', 'Exclusions', 'Delivery Area', 'Delivery Date'];
    
    const rows = enquiries.map(e => [
      `"${e.referenceId || ''}"`,
      `"${e.timestamp || ''}"`,
      `"${e.status || 'New'}"`,
      `"${e.senderName || e.contactName || ''}"`,
      `"${e.senderContact || e.contactPhone || ''}"`,
      `"${e.occasion || e.purpose || ''}"`,
      `"${e.relationship || ''}"`,
      `"${e.budget || e.budgetPerUnit || ''}"`,
      `"${(e.interests || []).join('; ')}"`,
      `"${e.exclusions || ''}"`,
      `"${e.deliveryArea || ''}"`,
      `"${e.deliveryDate || e.targetDate || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_gift_curator_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearDemoLeads = () => {
    if (confirm('Are you sure you want to clear stored enquiries from this browser?')) {
      localStorage.removeItem('tgc_enquiries');
      setEnquiries([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-cream-300 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between bg-slatewarm-900 text-cream-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400/20 text-gold-300 flex items-center justify-center border border-gold-400/40">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-semibold text-cream-50">
                  Business Owner Management Portal
                </h3>
                <span className="text-[10px] bg-rosewood-500 text-white px-2 py-0.5 rounded font-sans font-semibold">
                  Phase 1 MVP
                </span>
              </div>
              <p className="text-xs text-slatewarm-400">
                Manage website enquiries, export to Excel/CSV, and update contact settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slatewarm-800 hover:bg-slatewarm-700 text-cream-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-cream-300 bg-cream-50 px-6 pt-3 gap-4 text-xs font-semibold text-slatewarm-600">
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-rosewood-500 text-rosewood-600'
                : 'border-transparent hover:text-slatewarm-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Customer Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-rosewood-500 text-rosewood-600'
                : 'border-transparent hover:text-slatewarm-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>WhatsApp & Contact Config</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-rosewood-500 text-rosewood-600'
                : 'border-transparent hover:text-slatewarm-900'
            }`}
          >
            <span>Catalogue Updating Guide</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {/* TAB 1: Enquiries & Lead Management */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cream-100 p-4 rounded-2xl border border-cream-300">
                <div>
                  <h4 className="font-semibold text-sm text-slatewarm-900">
                    Lead Pipeline (BRD Section 9)
                  </h4>
                  <p className="text-xs text-slatewarm-500 mt-0.5">
                    Structured enquiries submitted via Curate My Gift & Corporate forms.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export to Excel / CSV</span>
                  </button>
                  {enquiries.length > 0 && (
                    <button
                      onClick={clearDemoLeads}
                      className="p-2 text-rosewood-600 hover:text-rosewood-800 text-xs"
                      title="Clear local list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Table or Empty State */}
              {enquiries.length > 0 ? (
                <div className="border border-cream-300 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slatewarm-700">
                      <thead className="bg-cream-200 text-slatewarm-800 uppercase tracking-wider font-semibold border-b border-cream-300">
                        <tr>
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Client</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Occasion & Budget</th>
                          <th className="p-3">Delivery Area</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cream-200 bg-white">
                        {enquiries.map((item, idx) => (
                          <tr key={idx} className="hover:bg-cream-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slatewarm-900">
                              {item.referenceId}
                            </td>
                            <td className="p-3 font-medium">
                              {item.senderName || item.contactName || item.companyName || '—'}
                            </td>
                            <td className="p-3">
                              {item.senderContact || item.contactPhone || '—'}
                            </td>
                            <td className="p-3">
                              <span className="font-semibold block">{item.occasion || item.purpose || 'Custom'}</span>
                              <span className="text-slatewarm-500">{item.budget || item.budgetPerUnit}</span>
                            </td>
                            <td className="p-3">
                              {item.deliveryArea || 'Dubai'}
                            </td>
                            <td className="p-3">
                              <select
                                value={item.status || 'New'}
                                onChange={(e) => handleStatusChange(item.referenceId, e.target.value)}
                                className="text-xs p-1.5 rounded-lg border border-cream-300 bg-cream-50 font-medium text-slatewarm-800"
                              >
                                {statuses.map((st) => (
                                  <option key={st} value={st}>{st}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-cream-50 rounded-2xl border border-cream-200 p-6 space-y-2">
                  <p className="text-sm font-semibold text-slatewarm-700">
                    No website enquiries recorded in this browser yet.
                  </p>
                  <p className="text-xs text-slatewarm-500">
                    Test submitting the "Curate My Gift" questionnaire to see your test enquiry pop up here with instant CSV export!
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: WhatsApp & Contact Config */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div>
                <h4 className="font-serif text-lg font-semibold text-slatewarm-900">
                  Update WhatsApp Destination
                </h4>
                <p className="text-xs text-slatewarm-500 mt-1">
                  All website buttons ("Order on WhatsApp" and "Curate My Gift") will send leads directly to this number.
                </p>
              </div>

              {saveMessage && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <form onSubmit={handleSavePhone} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="owner-whatsapp-input" className="text-xs font-semibold text-slatewarm-800 block">
                    WhatsApp Business Mobile (include country code):
                  </label>
                  <input
                    id="owner-whatsapp-input"
                    type="text"
                    required
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+971566799672"
                    className="w-full text-xs p-3 rounded-xl bg-cream-50 border border-cream-300 focus:outline-none focus:ring-2 focus:ring-rosewood-400 font-mono text-sm"
                  />
                  <span className="text-[11px] text-slatewarm-400">
                    Example: +971566799672 (UAE country code 971 followed by mobile number)
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slatewarm-900 hover:bg-slatewarm-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save WhatsApp Number</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Catalogue Updating Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-5 text-xs sm:text-sm text-slatewarm-700 leading-relaxed max-w-3xl">
              <div>
                <h4 className="font-serif text-lg font-semibold text-slatewarm-900">
                  How to Update Products, Prices & Photos (Without Coding)
                </h4>
                <p className="text-xs text-slatewarm-500 mt-0.5">
                  Fulfilling BRD Section 4 & 11: Documented owner workflow for routine changes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 space-y-2 text-xs">
                <span className="font-bold text-slatewarm-900 uppercase">File Location:</span>
                <p className="font-mono bg-white p-2 rounded border border-cream-300">
                  src/data/products.json
                </p>
                <p className="text-slatewarm-600">
                  Each product has simple fields: <code>title</code>, <code>price</code> (in AED), <code>category</code>, <code>contents</code> (list of items), and <code>image</code> URL.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 space-y-2 text-xs">
                <span className="font-bold text-slatewarm-900 uppercase">Updating Global Info & Branding:</span>
                <p className="font-mono bg-white p-2 rounded border border-cream-300">
                  src/data/siteConfig.json
                </p>
                <p className="text-slatewarm-600">
                  Edit business email, Instagram handle, delivery lead times, and deposit rules in one single file.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cream-200 bg-cream-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slatewarm-800 text-white text-xs font-semibold hover:bg-slatewarm-700 transition-colors"
          >
            Close Portal
          </button>
        </div>

      </div>
    </div>
  );
}
