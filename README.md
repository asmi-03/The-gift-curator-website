# The Gift Curator (Dubai, UAE) — Official Website

> **"Thoughtfully chosen. Beautifully gifted."**  
> Boutique ready-to-order gift hampers & bespoke personalised gifting concierge.  
> **Brand:** The Gift Curator | **Instagram:** [@thegiftcuratordubai](https://instagram.com/thegiftcuratordubai) | **Legal Entity:** Anrudaya Gifts FZE  
> **Website Domain:** [https://www.thegiftcuratordubai.com](https://www.thegiftcuratordubai.com)  
> **GitHub Repository:** [https://github.com/asmi-03/The-gift-curator-website.git](https://github.com/asmi-03/The-gift-curator-website.git)

---

## 🌟 Key Features Implemented (Phase 1 MVP)

1. **Brand-Aligned Header (Exact Match to thegiftcuratordubai.com):**
   - Brand Logo & Monogram with serif typography.
   - Distinct tabs: `Home`, `Our Hampers`, `Personalised Gifting`, `Corporate Gifting`, `Our Story`, `Contact`.
   - Distinct solid wine/burgundy (`#7A2832`) `WhatsApp` concierge action button.
2. **"Our Story" & Founder Showcase:**
   - Featuring Chaitally, Founder of The Gift Curator Dubai.
   - Narrative covering the brand origins, hand-tying ribbons, and artisan curation philosophy.
   - Signature arched photo card frame.
3. **Dual Core Customer Journeys:**
   - **Our Hampers (Ready-to-Gift):** Real hampers with AED prices, itemized lists of contents, lead times, and WhatsApp direct checkout.
   - **Personalised Gifting (Concierge):** 4-step guided questionnaire generating structured briefs with unique reference codes (`TGC-CUR-2026-XXXX`) and one-tap WhatsApp dispatch.
4. **Transparent Commercial Policies & UAE Compliance:**
   - 50% advance deposit policy clearly explained (free initial concept; balance upon final photo approval before dispatch).
   - Clear distinction between actual products and portfolio inspiration ("Example Only" badges).
   - Delivery transparency for all 7 Emirates (Dubai same-day cut-off at 12 PM GST; AED 35 Dubai / AED 50 other Emirates).
   - UAE PDPL (Federal Decree-Law No. 45 of 2021) privacy modal and minimal data collection.
5. **Corporate & Bulk Gifting Desk:**
   - Dedicated RFQ generator with unit counts, budget tiers, and corporate branding toggles.
6. **Dedicated Photo Drop System:**
   - Drop new product photos directly into `PRODUCT_IMAGES/` (`product-01.jpg` ... `product-08.jpg`).
   - The grid columns are strictly locked (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) so columns will never collapse or distort.

---

## 📁 Project Architecture

```
c:\didi website/
├── frontend/                  # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/images/         # Static assets, logos & product placeholders
│   ├── src/components/        # Navbar, OurStory, ShopReadyToGift, CurateMyGift, etc.
│   ├── src/data/              # products.json, siteConfig.json, faqs.json
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json            # Vercel 1-click deployment config
│   └── netlify.toml           # Netlify 1-click deployment config
│
├── backend/                   # Node.js + Express API Backend
│   ├── routes/                # Enquiries, Products, Healthcheck
│   ├── data/                  # products.json, enquiries.json
│   ├── server.js              # Express app on port 5000
│   ├── Dockerfile             # Container configuration for Render/Railway/Fly.io
│   └── package.json
│
├── PRODUCT_IMAGES/            # Dedicated root folder to drop product photos
│   ├── HOW_TO_ADD_PHOTOS.txt
│   ├── founder-chaitally.jpg
│   └── product-01.svg ... product-08.svg
│
├── preview.html               # Self-contained standalone offline preview
├── open-preview.bat           # 1-click launcher for instant browser preview
├── start-website.bat          # 1-click launcher for Frontend (3000) + Backend (5000)
├── DEPLOYMENT_GUIDE.md        # Comprehensive deployment manual for Vercel & Render
└── README.md
```

---

## 🚀 How to Run Locally

### Option 1: Instant Offline Browser Preview (No Node.js Needed)
Double-click `open-preview.bat` or open `preview.html` directly in your browser.

### Option 2: Full Development Stack
Double-click `start-website.bat` or run:
```bash
# In frontend directory
cd frontend
npm run dev

# In backend directory (in another terminal)
cd backend
npm start
```

---

## ☁️ Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions to deploy:
- **Frontend:** Vercel, Netlify, or GitHub Pages.
- **Backend:** Render, Railway, or Fly.io.

---

## ⚖️ Legal Attribution
- **Brand:** The Gift Curator Dubai
- **Legal Entity:** Anrudaya Gifts FZE (Dubai, United Arab Emirates)
- **Instagram:** [@thegiftcuratordubai](https://instagram.com/thegiftcuratordubai)
