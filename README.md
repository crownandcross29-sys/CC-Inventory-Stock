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

## ✨ Features

- **Full Product CRUD**: Add, edit, and delete football jerseys with live image preview.
- **Taxonomy Management**:
  - **Categories**: Club, Country, Retro
  - **Quality Tiers**: Player Version, Master Copy, Fan Version Set, Embroidered, Sublimation
- **Inline Stock Status Toggle**: Instant toggle between `In Stock` (green), `Low Stock` (amber), and `Out of Stock` (red).
- **KPI Metrics Dashboard**: Total catalog count, items in stock, out of stock alerts, and total inventory retail valuation (₹ INR).
- **Search & Multi-Filter**: Filter catalog by search terms, primary category, quality tier, or stock status.
- **One-Click Re-Sync**: Force reload and push updates to `products.json`.

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