# ois.earth

Single-page storefront for **OiS** — a small studio based in Istanbul.

Built with React + Vite. All state is in-memory or `localStorage`.

---

## Stack

| Layer | Choice |
|---|---|
| Markup | `index.html` |
| Styles | Vanilla CSS (inline `<style>`) |
| JS | React 18, JSX via Vite + `@vitejs/plugin-react` |
| Data | `src/data.js` — named export `OIS_DATA` |
| App logic | `src/app.jsx` — all components in one file |
| Routing | Hash-based (`#/`, `#/p/:id`, `#/about`, etc.) |
| Cart | `localStorage` (`ois_cart_v1`) |
| Language | `localStorage` (`ois_lang`) — EN / TR |
| Build | Vite — `npm run build` → `dist/` |
| Deploy | GitHub Actions → `gh-pages` branch → ois.earth |

---

## File structure

```
ois.earth/
├── index.html                  # Entry point + all CSS
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx                # ReactDOM.createRoot
│   ├── app.jsx                 # All React components
│   └── data.js                 # Products, collections, drops
├── public/
│   ├── favicon.jpg
│   └── images/
│       ├── products/
│       │   ├── white-front.png
│       │   ├── white-back.png
│       │   ├── black-front.png
│       │   └── black-back.png
│       └── lookbook/
│           └── vol-01/
│               ├── lookbook1.jpg
│               └── …
└── .github/
    └── workflows/
        └── deploy.yml          # Build + deploy to gh-pages
```

---

## Dev

```bash
npm install
npm run dev        # localhost:5173
npm run build      # dist/
npm run preview    # preview dist/
```

---

## Pages / Routes

| Route | Component | Notes |
|---|---|---|
| `#/` | `Home` | Product grid with splash scroll |
| `#/p/:id` | `PDP` | Product detail — image, size, add to cart |
| `#/cart` | `Cart` | Cart page |
| `#/checkout` | `Checkout` | Checkout form (no real payment) |
| `#/lookbook` | `Lookbook` | Photo grid by volume |
| `#/about` | `About` | Studio story + policies |
| `#/contact` | `Contact` | Emails with clipboard copy |
| `#/track` | `Track` | Order lookup — test order: `000000` |

---

## Adding a product

Edit `src/data.js` — add an entry to the `products` array:

```js
{
  id: "product-slug",           // used in URL
  name: "Product Name",
  colorName: "Color",
  price: 2000,                  // in TL
  collection: "essentials",
  colorway: "ink",              // "ink" | "cream" — drives swatch color
  images: [
    "images/products/front.png",
    "images/products/back.png",
  ],
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  details: "...",
  care: "...",
  ship: "Ücretsiz kargo — 2–3 iş günü içinde İstanbul'dan gönderilir.",
}
```

Images go in `public/images/products/` as PNGs with transparent backgrounds, referenced directly by path in the `images` array. Resize to ~1600px wide for web before adding.

---

## Adding lookbook photos

Add images to `public/images/lookbook/vol-XX/` then update `LOOKBOOK_VOLS` in `src/app.jsx`:

```js
{
  vol: "Vol. 02",
  location: "Istanbul · 2026",
  photos: [
    "images/lookbook/vol-02/1.jpg",
    ...
  ],
}
```

---

## Order tracking

Real orders are not wired up yet. To add a test/real order, add to the `TEST_ORDERS` object in `src/app.jsx`:

```js
const TEST_ORDERS = {
  "000000": { eta: "...", steps: [...] },
  "123456": { eta: "...", steps: [...] },
};
```

---

## Deployment

Live: **ois.earth**

Push to `master` → GitHub Actions builds `dist/` → deploys to `gh-pages` branch → served at ois.earth via CNAME.

GitHub Pages source must be set to the `gh-pages` branch (Settings → Pages).

---

## To-do

### Core
- [ ] Real payment integration (iyzico)
- [ ] Real order management + order tracking backend
- [ ] Email confirmation on order placed
- [ ] Inventory / stock per size (per-size quantities in data)

### Shop
- [ ] More products — crewneck, tee, sweatpant
- [ ] Product back image for white hoodie (only black has a back shot)
- [ ] Wishlist / save for later (localStorage, no backend needed)
- [ ] Notify me on sold-out sizes — email capture form

### UX
- [ ] Product video support on PDP (autoplay loop, muted)

### Content
- [ ] Lookbook Vol. 02+
- [ ] About page — team / studio photos
- [ ] Turkish copy native speaker review

### Tech
- [ ] `og:url` and `twitter:card` meta tags for proper social sharing
- [ ] Analytics (Plausible or GA4)

### Done ✓
- [x] Vite build pipeline (replaces CDN React + Babel)
- [x] GitHub Actions CI/CD — builds and deploys on push to master
- [x] Fullscreen image zoom on PDP — tap/click image, Escape to close
- [x] Page fade transition — 200ms fade+slide on every route change
- [x] Sold out state on sizes — data-driven `soldOut` array per product
- [x] Size guide modal — EN/TR, chest + length measurements
- [x] SEO meta tags — dynamic title, og:title/description/image per route
- [x] Image lazy loading
- [x] Mobile PDP image swipe (touch gesture)
- [x] Mobile responsive layout — header, scrollable nav, single-col grid

---

## Backlog

- Currency toggle (TL / USD / EUR)
