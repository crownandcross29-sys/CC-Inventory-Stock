# Crown & Cross — Code Documentation (CC-Inventory-Stock)

This document details the code architecture, API contracts, data layers, and process workflows for the private administration repository `CC-Inventory-Stock`.

---

## 1. Directory Structure

```
CC-Inventory-Stock/
├── admin/
│   ├── app/
│   │   ├── api/products/route.js    # Next.js App Router API endpoint
│   │   ├── globals.css              # Olive Green & Gold design tokens
│   │   ├── layout.jsx               # Root HTML & metadata wrapper
│   │   └── page.jsx                 # Client-side Admin Dashboard & CRUD UI
│   ├── lib/
│   │   └── generateJson.js          # File I/O & data formatting layer
│   ├── public/
│   │   └── images/logo.jpeg         # Crown & Cross brand emblem
│   └── package.json                 # Admin project manifest
├── CC-Hosting-Public/               # Git submodule (Public Storefront repo)
│   └── public/data/products.json    # Target data contract
├── scripts/
│   ├── start.js                     # Unified Node.js child_process launcher
│   ├── start.bat                    # Windows shell launcher wrapper
│   └── start.sh                     # Unix/macOS shell launcher wrapper
├── .gitignore                       # Multi-tier ignore rules
├── package.json                     # Root orchestrator manifest
└── Crown-and-Cross-Execution-Plan.md
```

---

## 2. Data Layer: `admin/lib/generateJson.js`

Provides atomic file read/write operations targeting `CC-Hosting-Public/public/data/products.json`.

```javascript
// Resolves the repository root by upward directory traversal
const jsonFilePath = getJsonFilePath();
```

### Exported Functions:
- **`findRepoRoot()`**: Recursively ascends directory tree from `process.cwd()` and `__dirname` to locate the repository root containing `CC-Hosting-Public`.
- **`getJsonFilePath()`**: Dynamically returns absolute path to `CC-Hosting-Public/public/data/products.json`.
- **`getProductsData()`**: Reads and parses `products.json`. Throws informative error if file is missing or contains invalid JSON.
- **`saveProductsData(fullData)`**: Safely formats with 2-space indentation and writes `fullData` synchronously to `jsonFilePath`. Returns `{ success: true, timestamp }`.
- **`createSlug(name)`**: Converts jersey names to clean SEO URL slugs (e.g. `"Real Madrid 23/24 Home"` → `"real-madrid-23-24-home"`).

---

## 3. API Contract: `admin/app/api/products/route.js`

| Method | Purpose | Request Body / Params | Response |
|---|---|---|---|
| **`GET`** | Load complete catalog & settings | None | Complete JSON object containing `brand`, `categories`, `subCategories`, and `products` |
| **`POST`** | Add product | `{ product: { name, price, ... } }` | `{ success: true, product, total }` |
| **`POST`** | Update brand settings | `{ action: "updateBrand", brand: { ... } }` | `{ success: true, message, data }` |
| **`POST`** | Update shipping & exchanges | `{ action: "updateShippingExchange", shipping: { ... }, exchange: { ... } }` | `{ success: true, message, data }` |
| **`POST`** | Update taxonomy | `{ action: "updateTaxonomy", categories: [ ... ], subCategories: [ ... ] }` | `{ success: true, message, data }` |
| **`POST`** | Direct raw JSON edit | `{ action: "updateRawJson", rawJson: "{ ... }" }` | `{ success: true, message, data }` |
| **`POST`** | Full catalog sync | `{ fullSync: true, data: { ... } }` | `{ success: true, message, data }` |
| **`PUT`** | Update existing product | `{ id: "cc-001", updates: { price: 1499, ... } }` | `{ success: true, product }` |
| **`PATCH`** | Quick stock status toggle | `{ id: "cc-001", stockStatus: "Low Stock", inStock: true }` | `{ success: true, product }` |
| **`DELETE`** | Remove product | Query Param: `?id=cc-001` | `{ success: true, remaining }` |

---

## 4. `products.json` Schema Contract

```json
{
  "brand": {
    "name": "Crown & Cross",
    "tagline": "Some wear fashion. We wear football.",
    "phone": "+917695924602",
    "email": "crownandcross29@gmail.com",
    "location": "Chennai, Tamil Nadu",
    "upiId": "jasonclement.jm-1@okhdfcbank",
    "payeeName": "Jason Clement",
    "shipping": {
      "standardFee": 80,
      "freeShippingThreshold": 1499
    }
  },
  "products": [
    {
      "id": "cc-001",
      "slug": "real-madrid-23-24-home-bellingham",
      "name": "Real Madrid 23/24 Home Kit — Bellingham #5",
      "category": "Club",
      "subCategory": "Player Version",
      "team": "Real Madrid",
      "season": "2023/24",
      "price": 1499,
      "mrp": 2499,
      "inStock": true,
      "stockStatus": "In Stock",
      "stockQuantity": 24,
      "sizes": ["S", "M", "L", "XL", "XXL"],
      "images": ["https://..."],
      "featured": true,
      "description": "..."
    }
  ]
}
```

---

## 5. Launcher Architecture: `scripts/start.js`

Uses Node.js `child_process.spawn` to spawn both Next.js applications in a non-blocking cross-platform manner:
- Checks `process.platform === 'win32'` to dispatch commands with `.cmd` extension on Windows.
- Spawns `Admin` on `http://localhost:3000`.
- Spawns `Storefront` on `http://localhost:3001` via `npm run dev -- -p 3001`.
- Registers a `SIGINT` listener to gracefully kill both child processes upon pressing `Ctrl + C`.

---

## 6. Vercel Deployment & Secret Configuration

The public storefront (`CC-Hosting-Public`) is designed for automatic continuous deployment on Vercel:

### Environment Variables on Vercel:
Add these in **Vercel Dashboard** → `CC-Hosting-Public` → **Settings** → **Environment Variables**:

| Variable Name | Required | Description | Example |
|---|---|---|---|
| `RESEND_API_KEY` | **Yes** (for estimates) | Secret API key from [Resend](https://resend.com/api-keys) | `re_123456789...` |
| `ESTIMATE_NOTIFICATION_EMAIL` | Optional | Inbox receiving team jersey quotation requests | `crownandcross29@gmail.com` |
| `RESEND_FROM_EMAIL` | Optional | Custom verified sender address once domain is verified | `Crown & Cross <orders@yourdomain.com>` |

> **Note on Security:** Secret keys should **never** be committed to Git. `.env.local` remains in `.gitignore`. Vercel securely injects these variables into the serverless environment at build/runtime. After setting or updating keys in Vercel, trigger a **Redeploy** on the latest deployment.
