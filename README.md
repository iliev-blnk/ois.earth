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

### Core
- [ ] Real payment integration (iyzico)
- [ ] Real order management + order tracking backend
- [ ] Email confirmation on order placed
- [ ] Inventory / stock per size (????)
- [ ] Sold out state on sizes and products

### Shop
- [ ] More products
- [ ] Product back images for black hoodie
- [ ] Size guide
- [ ] Currency toggle (TL / USD / EUR)

### Content
- [ ] Lookbook Vol. 02+

### Tech
- [ ] Move from CDN React + Babel to a proper build (Vite)
- [ ] Image optimization (WebP, lazy loading)
- [ ] SEO meta tags (og:image, description per page)
- [ ] Analytics
