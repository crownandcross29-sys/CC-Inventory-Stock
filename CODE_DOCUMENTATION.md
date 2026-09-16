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

Uses Node.js `child_process.spawn` to coordinate both Next.js applications in a non-blocking cross-platform manner:
- **Node v24 Windows Compatibility:** Dispatches using `npx.cmd` and `{ shell: true }` on Windows (`win32`) to prevent Node v24 `EINVAL` spawn errors.
- **Port Allocation:** Spawns `Admin` on `http://localhost:3000` and `Storefront` on `http://localhost:3001`.
- **HTTP Health Polling (`checkPortReady`):** Periodically issues lightweight HTTP requests to `localhost:3000` and `localhost:3001`.
- **Automated Browser Opener (`openBrowser`):** Once both servers return HTTP 200 responses, automatically launches the default web browser to both portals via `start` (Windows), `open` (macOS), or `xdg-open` (Linux).
- **Process Cleanup:** Registers a `SIGINT` listener to gracefully terminate all child processes and port bindings upon pressing `Ctrl + C`.

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

---

## 7. Universal WhatsApp Engine: `CC-Hosting-Public/lib/whatsapp.js`

Provides unified deep-linking that guarantees pre-filled recipient phone (`+91 76959 24602`) and pre-typed order messages across all client operating systems:

- **Protocol Launching (`whatsapp://send`):**
  - Directly opens native WhatsApp applications on Windows, macOS, Android, and iOS (iPhone/iPad).
  - Bypasses intermediate landing pages that require extra clicks.
- **Universal Link Fallback (`api.whatsapp.com/send`):**
  - Uses official universal endpoint without `app_absent=0` parameter (which was disabling autoload).
  - Automatically falls back to WhatsApp Web in desktop browsers if the native application is not installed.
- **Message Sanitization (`sanitizeWhatsAppText`):**
  - Converts multi-byte Unicode box characters (`━`, `─`, `═`) into standard ASCII hyphens (`-`).
  - Prevents query parameter truncation and URL decoding failures across mobile browser intent handlers.

---

## 8. Multi-Screen Responsive Architecture

1. **Viewport Scaling:** Exported Next.js 14 `viewport` metadata in `app/layout.jsx` ensures strict `1:1` device-width scaling across mobile and tablets.
2. **Fluid Grids:** Replaced fixed minimums with fluid constraints: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` on catalog, PDP, and footer sections.
3. **Gesture Navigation:** `JerseyCarousel.jsx` features touch swipe listeners (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with a 45px distance threshold.
4. **Adaptive Modals:** `UpiModal.jsx` incorporates `maxHeight: '90vh'` and `overflowY: 'auto'` to maintain usability on compact and landscape mobile screens.
