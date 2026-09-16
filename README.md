# Crown & Cross — Admin & Inventory System

> **Private administration portal and inventory engine for Crown & Cross football jerseys.**  
> *"Some wear fashion. We wear football."*

---

## ⚡ Quick Start (< 5 Minutes)

### Prerequisites
- **Node.js**: v18.0+ (Tested on v24)
- **npm**: v9.0+

### 1. Install All Dependencies
Dependencies are co-located in their respective project directories (`admin/node_modules/` and `CC-Hosting-Public/node_modules/`):

```bash
npm run install:all
```

### 2. Launch Local Environment
Run the unified cross-platform launcher:

```bash
npm run launch
```
*(Or on Windows, double click `scripts/start.bat`)*

- **Admin Portal:** [http://localhost:3000](http://localhost:3000)
- **Public Storefront:** [http://localhost:3001](http://localhost:3001)

---

## 🏗️ Architecture & JSON Pipeline

Crown & Cross uses a lean, serverless, no-backend-database architecture:

```
CC-Inventory-Stock/                 (Repo 1 — Private Admin)
├── admin/                          Next.js Admin Dashboard (Port 3000)
│   ├── app/                        App router & UI pages
│   ├── app/api/products/route.js   CRUD & JSON sync API
│   └── lib/generateJson.js         JSON file read/write layer
├── CC-Hosting-Public/               (Repo 2 — Public Git Submodule, Port 3001)
│   ├── ...                          (Vercel Next.js storefront)
│   └── public/data/products.json    <-- Admin directly writes here
├── scripts/
│   ├── start.js                    Cross-platform Node launcher
│   ├── start.bat                   Windows double-click launcher
│   └── start.sh                    Mac/Linux launcher
└── package.json
```

### How the Data Hand-Off Works:
1. **Admin CRUD**: When you add, edit, or toggle stock in the Admin UI, the API directly updates `CC-Hosting-Public/public/data/products.json`.
2. **Submodule Git Commit**: Commit the updated `products.json` inside `CC-Hosting-Public` and push to its GitHub repository.
3. **Vercel Auto-Deploy**: Vercel is connected solely to `CC-Hosting-Public` — every push automatically triggers a fresh deployment of the public store within 60 seconds.

---

## ✨ Comprehensive Admin Modules

The Crown & Cross Admin Portal (`http://localhost:3000`) provides comprehensive control over all data stored in `products.json`:

1. **👕 Jerseys & Inventory Catalog**:
   - Add, edit, and delete football jerseys with multi-image previews and size tags (`S`, `M`, `L`, `XL`, `XXL`).
   - Inline stock status toggle (`In Stock`, `Low Stock`, `Out of Stock`) and quantity tracking.
   - Dynamic KPI counters: Total jerseys, active stock, sold-out alerts, and aggregate retail valuation (₹).
   - Real-time search and multi-facet filtering by category, quality grade, and stock level.

2. **🏛️ Brand & Store Identity**:
   - Store Name, primary hero tagline, and secondary story value proposition.
   - WhatsApp direct ordering phone number (`+917695924602`), official support email, and store headquarters.
   - Merchant UPI ID (`jasonclement.jm-1@okhdfcbank`) and registered payee name that power client-side dynamic QR code payments.

3. **🚚 Shipping & Exchange Rules**:
   - Standard shipping fee (₹80) and free shipping threshold (₹1,499) that dynamically adjusts the Cart Drawer progress meter.
   - Metro city (`3-5 Business Days`) and Pan-India (`5-8 Business Days`) delivery timeframes.
   - Sizing exchange window (`5-7 Days`) and mandatory return conditions.

4. **🏷️ Categories & Quality Grades**:
   - Add, edit, and delete primary categories (`Club`, `Country`, `Retro`) with auto-slug generation.
   - Configure the 5 quality sub-categories (`Player Version`, `Master Copy`, `Fan Version Set`, `Embroidered`, `Sublimation`) and their customer-facing spec descriptions.
   - Dynamically populates jersey forms and filter buttons across the application.

5. **💻 Raw JSON Inspector & Backups**:
   - Live formatted JSON viewer and emergency syntax editor for `products.json`.
   - In-browser JSON formatter, syntax validator, and clipboard copy.
   - One-click `.json` snapshot download for manual backups.

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm run launch` | Launches both Admin (`:3000`) and Storefront (`:3001`) simultaneously |
| `npm run install:all` | Installs dependencies in both `admin/` and `CC-Hosting-Public/` |
| `npm run dev --prefix admin` | Runs only the Admin dashboard on `:3000` |
| `npm run build --prefix admin` | Creates an optimized production build for the Admin portal |

---

## 📚 Documentation
- [Code Documentation (Architecture & APIs)](CODE_DOCUMENTATION.md)
- [Design Philosophy (Architecture & Ideology)](DESIGN_PHILOSOPHY.md)
- [Full Execution Plan](Crown-and-Cross-Execution-Plan.md)

---

## 👤 Owner & Team
- **Owner:** Jason Clement (`crownandcross29@gmail.com`)
- **Location:** Chennai, Tamil Nadu, India