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
const jsonFilePath = path.resolve(__dirname, '../../CC-Hosting-Public/public/data/products.json');
```

### Exported Functions:
- **`getProductsData()`**: Reads and parses `products.json`. Throws error if file is missing or contains invalid JSON.
- **`saveProductsData(fullData)`**: Safely formats with 2-space indentation and writes `fullData` synchronously to `jsonFilePath`. Returns `{ success: true, timestamp }`.
- **`createSlug(name)`**: Converts jersey names to clean SEO URL slugs (e.g. `"Real Madrid 23/24 Home"` → `"real-madrid-23-24-home"`).

---

## 3. API Contract: `admin/app/api/products/route.js`

| Method | Purpose | Request Body / Params | Response |
|---|---|---|---|
| **`GET`** | Load catalog | None | Complete JSON object containing `brand`, `categories`, `subCategories`, and `products` |
| **`POST`** | Add product or Full Sync | `{ product: { ... } }` or `{ fullSync: true, data: { ... } }` | `{ success: true, product, total }` |
| **`PUT`** | Update existing product | `{ id: "cc-001", updates: { price: 1499, ... } }` | `{ success: true, product }` |
| **`PATCH`** | Quick Stock Status toggle | `{ id: "cc-001", stockStatus: "Low Stock", inStock: true }` | `{ success: true, product }` |
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
