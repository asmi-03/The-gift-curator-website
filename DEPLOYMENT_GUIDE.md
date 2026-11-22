# The Gift Curator (Dubai) — Decoupled Architecture & Deployment Guide

This project is structured into **separate Frontend and Backend services** for clean, independent development and deployment.

```
c:\didi website/
├── frontend/                  # React 18 + Vite 6 + Tailwind CSS
│   ├── dist/                  # Production static build
│   ├── src/                   # React components & API client
│   ├── index.html
│   ├── package.json
│   ├── vercel.json            # Vercel deployment config
│   ├── netlify.toml           # Netlify deployment config
│   └── .env.example
│
├── backend/                   # Node.js + Express.js REST API
│   ├── data/                  # Persistent JSON data stores
│   │   ├── products.json      # Catalogue data
│   │   ├── creations.json     # Portfolio data
│   │   ├── faqs.json          # FAQs & policies
│   │   ├── siteConfig.json    # Business config & phone
│   │   └── enquiries.json     # Saved leads & briefs
│   ├── server.js              # REST API endpoints & CSV exporter
│   ├── package.json
│   ├── Dockerfile             # Docker container definition
│   └── .env.example
│
├── preview.html               # 1-Click zero-dependency offline preview
├── start-website.bat          # 1-Click local runner (starts both services)
└── DEPLOYMENT_GUIDE.md        # This guide
```

---

## 🚀 How to Run Locally

### The Easiest Way:
Just double-click **`start-website.bat`**. It will:
1. Start the **Backend API** on `http://localhost:5000`
2. Start the **Frontend** on `http://localhost:3000`
3. Automatically open your browser to `http://localhost:3000`

### Or Manually via Terminal:

**Backend:**
```bash
cd backend
npm start
# Runs at http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm.cmd run dev
# Runs at http://localhost:3000
```

---

## 🌐 Production Deployment Guide

### Part 1: Deploying the Frontend (Client)
The frontend builds into a static edge bundle (`frontend/dist/`), which can be hosted for **$0/month** on high-performance global CDN edge networks with servers in Dubai.

#### Option A: Vercel (Recommended)
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://api.thegiftcuratordubai.com/api` (or your deployed backend URL)
5. Click **Deploy**.
6. In **Settings > Domains**, attach: `www.thegiftcuratordubai.com`.

#### Option B: Netlify
1. Log in to [Netlify](https://netlify.com) and select **"Add new site > Import an existing project"**.
2. Set **Base directory** to `frontend`.
3. Set **Publish directory** to `frontend/dist`.
4. Add environment variable `VITE_API_URL` = your backend URL.
5. Deploy and attach custom domain.

#### Option C: Cloudflare Pages
1. Go to Cloudflare Dashboard > **Workers & Pages**.
2. Connect Git repo, set root to `frontend`, build command `npm run build`, output `dist`.

---

### Part 2: Deploying the Backend (API Server)
The backend is a lightweight Node.js Express server that serves product data, persists enquiries, and exports leads to CSV.

#### Option A: Render (Free Tier Available)
1. Log in to [Render](https://render.com) and click **"New Web Service"**.
2. Connect your Git repository.
3. Configure settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Under **Environment Variables**, add:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `https://www.thegiftcuratordubai.com`
5. Click **Create Web Service**.
6. Attach custom domain (e.g. `api.thegiftcuratordubai.com`).

#### Option B: Railway
1. Log in to [Railway.app](https://railway.app) and click **"New Project"**.
2. Select **"Deploy from GitHub repo"**.
3. In settings, set **Root Directory** to `/backend`.
4. Railway will automatically detect Node.js and run `node server.js`.
5. Generate a public domain or attach `api.thegiftcuratordubai.com`.

---

## 🛡️ Zero-Failure Fallback Guarantee

The frontend has been built with a **graceful fallback architecture** ([frontend/src/api/apiClient.js](file:///c:/didi%20website/frontend/src/api/apiClient.js)):
* If the backend server is ever restarting, updating, or offline, the frontend **never crashes or shows a blank screen**.
* It automatically falls back to bundled data (`products.json`, `siteConfig.json`) and saves leads to local storage, ensuring **100% uptime for customers ordering on WhatsApp**.
