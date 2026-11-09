# 🧵 Garment End-Line QC & Defect Heatmap System (Clothing Export)

A specialized End-Line Quality Control (QC) and Defect Pinpoint Heatmap system designed for apparel export factories. It provides tablet-friendly inspection for factory floor QC operators, a live shop-floor TV dashboard with garment heatmaps, and comprehensive end-of-day analytics with defect type percentage pie charts.

---

## 🌟 Key Features

### 1. 📱 Mobile & Android Tablet End-Line QC Screen (`/` or `/qc`)
- **One-Tap PASS (OK)**:
  - Big tactile green button increments good piece count instantly.
  - Audio and visual feedback for high-speed line inspection.
- **DEFECT (REWORK)**:
  - High-visibility red button opens the interactive Tech Pack inspection canvas.
  - **Touch / Click Defect Pinpointing**: Touch any spot on the garment tech pack (Front or Back) to place numbered pins (`#1`, `#2`, ...). Supports multiple defect spots per garment like a heatmap.
  - **Multi-Select Defect Dropdown**: Choose from standard export defect types (Broken stitch, Open seam, Oil stain, Skip stitch, Puckering, Shading, etc.).
  - **In-Line Manual Defect Addition**: Add brand-new defect types on the fly! Manually added defects are saved to the database immediately and tracked in pie charts.
  - **Sewing Operation Assignment**: Link defects to root operations (Neck Rib Attach, Sleeve Hemming, Shoulder Join, Side Seam, etc.).
  - **Undo Last Action**: Easily revert accidental clicks without corrupting daily counters.

### 2. 📺 Shop-Floor TV Dashboard (`/tv`)
- Built for 55" / 65" TV screens on factory sewing floors with auto-refresh every 5 seconds.
- **Garment Defect Heat Map**: Visual glowing heat cluster overlay directly on the buyer tech pack flat sketch showing defect hotspots.
- **Top Defect Operations**: Real-time ranking of offending sewing operations (e.g., Neck rib attach 32%, Bottom hem 24%) with visual progress bars.
- **Defect Category Pie Chart**: Live percentage breakdown of issues.
- **Real-Time KPIs**: Total Inspected, Good Pieces, Rework Pieces, Pass Rate %, Defect Rate %.
- **1-Click Fullscreen TV Mode**: Optimized for TV browsers with high contrast dark mode.

### 3. 📊 End-of-Day Summary & Defect Percentage Analytics (`/dashboard`)
- Total inspected, Good pieces, Rework pieces, and Pass/Rework percentage rates.
- **Interactive Defect Pie Chart**: Displays every defect type (both standard and manually added) with exact piece count and percentage distribution.
- **Sewing Operation Root Cause Ranking**: Pinpoint which machine operators or operations need retraining.
- **Historical Inspection Log**: Filterable by Date (Today, Yesterday, Custom), Line, and Style / PO.
- **Export to CSV**: Download complete inspection logs for buyer compliance reports.

### 4. 🌐 4-Language Translation Switcher
Full instant translation across every screen, button, and report:
1. **English** (`en`)
2. **Tamil - தமிழ்** (`ta`)
3. **Hindi - हिन्दी** (`hi`)
4. **Odia - ଓଡ଼ିଆ** (`or`)

Switch anytime from the header globe icon; language selection is persisted in `localStorage`.

### 5. 👕 Buyer Tech Pack Management (`/techpacks`)
- Preloaded with export vector flat sketches:
  - Crew Neck T-Shirt (Front & Back)
  - Pique Polo Shirt with Collar & Placket (Front & Back)
- Upload or create new styles with buyer names, order quantities, and operation lists.

### 6. 🏷️ Defect Master Library (`/defects`)
- Complete library of defect types categorized by Stitching, Fabric, Stain / Soil, Measurement, Trims.
- Shows manually added defects with a "Manual Entry" badge.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router (`react-router-dom`), Tailwind CSS, Chart.js (`react-chartjs-2`), Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB (with automated seed data).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Start Both Backend & Frontend Concurrently (Single Command)
From the project root:
```bash
cd D:\Sathish\Projects\garment-endline-qc
npm run dev
```

This launches:
- **Client (Tablet & TV UI)**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

### 2. Or Start Separately:

**Backend Server**:
```bash
cd D:\Sathish\Projects\garment-endline-qc\server
npm run dev
```

**Client Frontend**:
```bash
cd D:\Sathish\Projects\garment-endline-qc\client
npm run dev
```

---

## 🧭 Page Routes

| Route | Description |
|---|---|
| `/` or `/qc` | Mobile / Tablet End-Line QC Touch Inspection Screen |
| `/tv` | Shop-Floor Live Factory TV Dashboard |
| `/dashboard` | End of Day Summary & Defect Percentage Pie Chart |
| `/techpacks` | Buyer Tech Pack & Garment Silhouette Manager |
| `/defects` | Defect Library & Multi-Language Master |

---

## 🗄️ Database Auto-Seeding
When first connected to MongoDB, the backend automatically seeds:
- 15 Standard Apparel Export Defect Types (with English, Tamil, Hindi, and Odia translations).
- 3 Production Lines (Line 01 Sewing, Line 02 Sewing, Line 03 Finishing).
- 2 Buyer Tech Packs (H&M Crew Neck T-Shirt & Zara Polo Shirt).
- Realistic sample inspection logs so the TV Dashboard and Pie Chart light up immediately!

