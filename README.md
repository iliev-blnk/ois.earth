# ois.earth

Single-page storefront for **OiS** — a small studio based in Istanbul.

Built as a static HTML/JS site with no build step. React + Babel loaded from CDN. All state is in-memory or `localStorage`.

---

## Stack

| Layer | Choice |
|---|---|
| Markup | Single `index.html` |
| Styles | Vanilla CSS (inline `<style>`) |
| JS | React 18 via CDN, JSX compiled by Babel standalone |
| Data | `js/data.js` — `window.OIS_DATA` global |
| App logic | `js/min-app.jsx` — all components in one file |
| Routing | Hash-based (`#/`, `#/p/:id`, `#/about`, etc.) |
| Cart | `localStorage` (`ois_cart_v1`) |
| Language | `localStorage` (`ois_lang`) — EN / TR |

---

## File structure

```
ois.earth/
├── index.html              # Entry point + all CSS
├── favicon.jpg
├── js/
│   ├── data.js             # Products, collections, drops
│   └── min-app.jsx         # All React components
└── images/
    ├── products/
    │   ├── white-front.png
    │   ├── white-back.png
    │   ├── black-front.png
    │   └── black-back.png
    └── lookbook/
        └── vol-01/
            ├── lookbook1.jpg
            ├── lookbook2.jpg
            ├── lookbook3.jpg
            └── lookbook4.jpg
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

Edit `js/data.js` — add an entry to the `products` array:

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

Images should be PNGs with transparent backgrounds placed in `images/products/`.

---

## Adding lookbook photos

Add images to `images/lookbook/vol-XX/` then update `LOOKBOOK_VOLS` in `min-app.jsx`:

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

Real orders are not wired up yet. To add a test/real order, add to the `TEST_ORDERS` object in `min-app.jsx`:

```js
const TEST_ORDERS = {
  "000000": { eta: "...", steps: [...] },
  "123456": { eta: "...", steps: [...] },
};
```

---

## Deployment

Live: **ois.earth**

To deploy: push to `master`.

---

## To-do

### Bugs
- [x] Missing modal CSS — SizeGuideModal renders unstyled (`.modal`, `.modal-scrim`, `.size-table` not defined)
- [x] Turkish About copy still says "spor giyim stüdyosu" (sportswear) — needs "stüdyo" only
- [x] Checkout order number regenerates on every re-render — moved to `useState`
- [x] Cart "Remove" button hardcoded English — now translated in TR mode
- [x] Swatch grouping uses `name` field — fixed with `variantGroup` field in data
- [x] `lb-img full wide` — removed nonexistent `.wide` class
- [x] Cart/Checkout total inconsistency — prices are KDV-inclusive, removed separate tax line

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
- [ ] Move from CDN React + Babel to Vite build
- [ ] Image optimization (WebP conversion, responsive srcset)
- [ ] `og:url` and `twitter:card` meta tags for proper social sharing
- [ ] Analytics (Plausible or GA4)

### Done ✓
- [x] All bugs above
- [x] Fullscreen image zoom on PDP — tap/click image, Escape to close
- [x] Page fade transition — 200ms fade+slide on every route change
- [x] Sold out state on sizes — data-driven `soldOut` array per product
- [x] Size guide modal — EN/TR, chest + length measurements
- [x] SEO meta tags — dynamic title, og:title/description/image per route
- [x] Image lazy loading
- [x] Mobile PDP image swipe (touch gesture, replaces arrow buttons on mobile)
- [x] Mobile responsive layout — header, scrollable nav, single-col grid

---

## Backlog

- Currency toggle (TL / USD / EUR)
