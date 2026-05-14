const { useState, useEffect, useCallback, useMemo } = React;

const CART_KEY = "ois_cart_v1";
const cart = {
  items: [],
  ls: new Set(),
  load() { try { this.items = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { this.items = []; } },
  save() { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); this.ls.forEach((f) => f()); },
  add(p, size) {
    const key = p.id + "::" + size;
    const e = this.items.find((i) => i.key === key);
    if (e) e.qty += 1;
    else this.items.push({ key, id: p.id, size, qty: 1, name: p.name, colorName: p.colorName, price: p.price, colorway: p.colorway, thumb: p.images[0] });
    this.save();
  },
  remove(k) { this.items = this.items.filter((i) => i.key !== k); this.save(); },
  setQty(k, q) { const i = this.items.find((x) => x.key === k); if (i) { i.qty = Math.max(1, q); this.save(); } },
  count() { return this.items.reduce((a, b) => a + b.qty, 0); },
  subtotal() { return this.items.reduce((a, b) => a + b.qty * b.price, 0); },
  sub(f) { this.ls.add(f); return () => this.ls.delete(f); }
};
cart.load();

function useCart() {
  const [, f] = useState(0);
  useEffect(() => cart.sub(() => f((n) => n + 1)), []);
  return cart;
}

function phClass(cw) {
  return cw === "ink" ? "dark" : cw === "cream" ? "cream" : "";
}

function Shell({ route, navigate, children, lang, setLang }) {
  const c = useCart();
  const is = (r) => route === r || (r !== "/" && route.startsWith(r));

  const t = lang === "tr" ? {
    shop: "Mağaza", lookbook: "Lookbook", about: "Hakkında", track: "Takip", contact: "İletişim",
    cart: "Çanta", instagram: "Instagram",
  } : {
    shop: "Shop", lookbook: "Lookbook", about: "About", track: "Track", contact: "Contact",
    cart: "Cart", instagram: "Instagram",
  };

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <a href="#/" onClick={(e) => { e.preventDefault(); if (route === "/") { window.scrollTo({ top: 0, behavior: "smooth" }); } else { navigate("/"); } }}>
            OiS<br />
            <span className="sub">earth</span>
          </a>
        </div>
        <nav className="primary">
          <ul>
            <li><a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className={route === "/" ? "active" : ""}>{t.shop}</a></li>
            <li><a href="#/lookbook" onClick={(e) => { e.preventDefault(); navigate("/lookbook"); }} className={is("/lookbook") ? "active" : ""}>{t.lookbook}</a></li>
            <li><a href="#/about" onClick={(e) => { e.preventDefault(); navigate("/about"); }} className={is("/about") ? "active" : ""}>{t.about}</a></li>
            <li><a href="#/track" onClick={(e) => { e.preventDefault(); navigate("/track"); }} className={is("/track") ? "active" : ""}>{t.track}</a></li>
          </ul>
        </nav>
      </aside>

      <main>{children}</main>

      <aside className="side-right">
        <a href="#/cart" onClick={(e) => { e.preventDefault(); navigate("/cart"); }}>
          {t.cart} (<span className="cart-count">{c.count()}</span>)
        </a>
        <a href="https://instagram.com/ois.earth" target="_blank" rel="noreferrer">{t.instagram}</a>
        <a href="#/contact" onClick={(e) => { e.preventDefault(); navigate("/contact"); }}>{t.contact}</a>
        <button
          onClick={() => setLang(lang === "en" ? "tr" : "en")}
          style={{ color: "var(--muted)", marginTop: 12, fontSize: 10 }}
        >
          {lang === "en" ? "TR" : "EN"}
        </button>
        <div style={{ color: "var(--muted)", marginTop: 8, fontSize: 10 }}>
          © 2026<br />Istanbul
        </div>
      </aside>
    </div>
  );
}

function Home({ navigate }) {
  return (
    <div className="home">
      {OIS_DATA.products.map((p) => (
        <a key={p.id} className="tile" href={"#/p/" + p.id} onClick={(e) => { e.preventDefault(); navigate("/p/" + p.id); }}>
          <img src={p.images[0]} alt={p.name + " " + p.colorName} className="tile-img" />
          <div className="meta">
            <span>{p.name} / {p.colorName}</span>
            <span>₺{p.price}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

function PDP({ id, navigate, openDrawer, lang }) {
  const p = OIS_DATA.products.find((x) => x.id === id);
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [size, setSize] = useState(null);
  const variants = useMemo(() => OIS_DATA.products.filter((x) => x.name === p?.name), [p?.name]);

  if (!p) return <div>Not found.</div>;

  const total = p.images.length;
  const prev = () => setImgIdx((imgIdx - 1 + total) % total);
  const next = () => setImgIdx((imgIdx + 1) % total);

  const t = lang === "tr" ? {
    color: "Renk", size: "Beden", selectSize: "Beden seçin", add: "Ekle",
    details: "Detaylar", care: "Bakım", shipping: "Kargo",
  } : {
    color: "Color", size: "Size", selectSize: "Select size", add: "Add",
    details: "Details", care: "Care", shipping: "Shipping",
  };

  const onAdd = () => {
    if (!size) return;
    cart.add(p, size);
    const dst = document.querySelector(".cart-count");
    if (dst) { dst.classList.add("bump"); setTimeout(() => dst.classList.remove("bump"), 180); }
    setExpanded(false);
    setSize(null);
    openDrawer();
  };

  return (
    <div className="pdp">
      <div className="pdp-media">
        <img src={p.images[imgIdx]} alt={p.name} className="pdp-media-img" />
        {total > 1 && (
          <div className="pdp-nav">
            <button onClick={prev}>←</button>
            <button onClick={next}>→</button>
          </div>
        )}
        {total > 1 && (
          <div className="pdp-dots">
            {p.images.map((_, i) => (
              <button key={i} className={imgIdx === i ? "active" : ""} onClick={() => setImgIdx(i)} />
            ))}
          </div>
        )}
      </div>

      <div className="pdp-info">
        <h1>{p.name}</h1>
        <div className="price">₺{p.price}</div>

        <div className="group">
          <div className="group-label">{t.color}</div>
          <div className="swatches">
            {variants.map((v) => (
              <button
                key={v.id}
                className={"swatch " + (v.id === p.id ? "active" : "")}
                onClick={() => navigate("/p/" + v.id)}
                style={{ background: v.colorway === "ink" ? "#0a0a0a" : v.colorway === "cream" ? "#ede5d3" : "#bbb" }}
                title={v.colorName}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          {!expanded ? (
            <button className="pdp-expand-btn" onClick={() => setExpanded(true)}>+</button>
          ) : (
            <>
              <div className="group">
                <div className="group-label">{t.size}</div>
                <div className="options">
                  {p.sizes.map((s) => (
                    <button key={s} className={size === s ? "active" : ""} onClick={() => setSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <button className={"pdp-add-btn " + (!size ? "disabled" : "")} onClick={onAdd} disabled={!size}>
                {size ? `${t.add} ${size}` : t.selectSize}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: 32 }}>
          <details>
            <summary>{t.details}</summary>
            <p>{p.details}</p>
          </details>
          <details>
            <summary>{t.care}</summary>
            <p>{p.care}</p>
          </details>
          <details>
            <summary>{t.shipping}</summary>
            <p>{p.ship}</p>
          </details>
        </div>
      </div>
    </div>
  );
}

function Drawer({ open, onClose, navigate, lang }) {
  const c = useCart();
  const total = c.subtotal();
  const t = lang === "tr" ? {
    bag: "Çanta", empty: "Boş.", close: "Kapat", remove: "Kaldır", checkout: "ÖDEME",
  } : {
    bag: "Bag", empty: "Empty.", close: "Close", remove: "Remove", checkout: "CHECKOUT",
  };

  return (
    <>
      <div className={"drawer-scrim " + (open ? "open" : "")} onClick={onClose} />
      <aside className={"drawer " + (open ? "open" : "")}>
        <header>
          <span>{t.bag} ({c.count()})</span>
          <button onClick={onClose}>{t.close}</button>
        </header>
        {c.items.length === 0 && <p style={{ color: "var(--muted)" }}>{t.empty}</p>}
        {c.items.map((i) => {
          const product = OIS_DATA.products.find((p) => p.id === i.id);
          return (
            <div className="drawer-line" key={i.key}>
              {product ? (
                <img src={product.images[0]} alt={i.name} className="drawer-thumb" />
              ) : (
                <div className={"drawer-thumb-ph " + phClass(i.colorway)} />
              )}
              <div className="info">
                <div className="top"><span>{i.name} / {i.colorName}</span><span>₺{i.price * i.qty}</span></div>
                <div style={{ color: "var(--muted)" }}>Size {i.size}</div>
                <div className="ctrls">
                  <button onClick={() => c.setQty(i.key, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => c.setQty(i.key, i.qty + 1)}>+</button>
                  <button onClick={() => c.remove(i.key)} style={{ marginLeft: "auto" }}>{t.remove}</button>
                </div>
                {product && (
                  <div className="details">
                    <p>{product.details}</p>
                    <p>{product.care}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {c.items.length > 0 && (
          <div className="drawer-foot">
            <div className="row"><span style={{ color: "var(--muted)" }}>Subtotal</span><span>₺{total}</span></div>
            <div className="row total"><span>Total</span><span>₺{total}</span></div>
            <a className="drawer-checkout" href="#/checkout" onClick={(e) => { e.preventDefault(); onClose(); navigate("/checkout"); }}>{t.checkout} →</a>
          </div>
        )}
      </aside>
    </>
  );
}

function Cart({ navigate, lang }) {
  const c = useCart();
  const t = lang === "tr" ? { empty: "Çanta boş.", shop: "Alışverişe devam", checkout: "Ödemeye geç" }
    : { empty: "Bag is empty.", shop: "Shop all", checkout: "Checkout" };

  if (c.items.length === 0) {
    return (
      <div className="cart-page">
        <p>{t.empty}</p>
        <p style={{ marginTop: 16 }}>
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>{t.shop}</a>
        </p>
      </div>
    );
  }
  return (
    <div className="cart-page">
      {c.items.map((i) => {
        const product = OIS_DATA.products.find((p) => p.id === i.id);
        return (
          <div className="cart-line" key={i.key}>
            {product ? (
              <img src={product.images[0]} alt={i.name} className="img" style={{ width: 60, height: 80, objectFit: "cover", flexShrink: 0 }} />
            ) : (
              <div className={"img-ph " + phClass(i.colorway)} />
            )}
            <div className="info">
              <div className="top">
                <span>{i.name} / {i.colorName}</span>
                <span>₺{i.price * i.qty}</span>
              </div>
              <div style={{ color: "var(--muted)" }}>Size {i.size}</div>
              <div className="ctrls">
                <button onClick={() => c.setQty(i.key, i.qty - 1)}>−</button>
                <span>{i.qty}</span>
                <button onClick={() => c.setQty(i.key, i.qty + 1)}>+</button>
                <button onClick={() => c.remove(i.key)} style={{ marginLeft: "auto" }}>Remove</button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="cart-summary">
        <div className="row"><span>Subtotal</span><span>₺{c.subtotal()}</span></div>
        <div className="row"><span>Shipping</span><span>Free</span></div>
        <div className="row total"><span>Total</span><span>₺{c.subtotal()}</span></div>
        <a href="#/checkout" onClick={(e) => { e.preventDefault(); navigate("/checkout"); }} className="cart-cta">{t.checkout}</a>
      </div>
    </div>
  );
}

function Checkout({ navigate, lang }) {
  const c = useCart();
  const [placed, setPlaced] = useState(false);
  const shipCost = 0;
  const tax = Math.round(c.subtotal() * 0.18);
  const total = c.subtotal() + shipCost + tax;

  const orderNum = "OIS-" + Math.floor(10000 + Math.random() * 90000);

  if (placed) {
    return (
      <div className="text-page">
        <p>Order confirmed. {orderNum}</p>
        <p style={{ marginTop: 16 }}>A confirmation email is on its way. Tracking follows within 2–3 business days.</p>
        <p style={{ marginTop: 24 }}>
          <a href="#/track" onClick={(e) => { e.preventDefault(); navigate("/track"); }} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Track order</a>
          {" · "}
          <a href="#/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>Keep shopping</a>
        </p>
      </div>
    );
  }

  if (c.items.length === 0) return <div className="text-page"><p>Bag is empty.</p></div>;

  return (
    <div className="checkout-grid">
      <div>
        <div style={{ color: "var(--muted)", marginBottom: 6 }}>Contact</div>
        <div className="field"><label>Email</label><input type="email" placeholder="you@domain.com" /></div>

        <div style={{ color: "var(--muted)", marginTop: 24, marginBottom: 6 }}>Delivery</div>
        <div className="field"><label>Name</label><input /></div>
        <div className="field"><label>Address</label><input /></div>
        <div className="field-row">
          <div className="field"><label>City</label><input /></div>
          <div className="field"><label>Postal</label><input /></div>
        </div>
        <div className="field"><label>Country</label><input defaultValue="Türkiye" /></div>

        <div style={{ color: "var(--muted)", marginTop: 24, marginBottom: 6 }}>Shipping</div>
        <div className="radio-row active">
          <span>Standard · 2–3 days</span>
          <span>Ücretsiz</span>
        </div>

        <div style={{ color: "var(--muted)", marginTop: 24, marginBottom: 6 }}>Payment</div>
        <div className="field"><label>Card number</label><input placeholder="•••• •••• •••• ••••" /></div>
        <div className="field-row">
          <div className="field"><label>Expiry</label><input placeholder="MM / YY" /></div>
          <div className="field"><label>CVC</label><input /></div>
        </div>

        <button className="btn-plain" style={{ marginTop: 24 }} onClick={() => setPlaced(true)}>
          Place order · ₺{total}
        </button>
      </div>

      <aside>
        <div style={{ color: "var(--muted)", marginBottom: 8 }}>Order · {c.count()} items</div>
        {c.items.map((i) => {
          const product = OIS_DATA.products.find((p) => p.id === i.id);
          return (
            <div key={i.key} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid #eee" }}>
              {product ? (
                <img src={product.images[0]} alt={i.name} style={{ width: 44, height: 58, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 44, height: 58, background: i.colorway === "ink" ? "#0a0a0a" : "#ede5d3", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>{i.name}</span><span>₺{i.price * i.qty}</span></div>
                <span style={{ color: "var(--muted)" }}>{i.colorName} / {i.size} / ×{i.qty}</span>
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span style={{ color: "var(--muted)" }}>Subtotal</span><span>₺{c.subtotal()}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span style={{ color: "var(--muted)" }}>Shipping</span><span>Ücretsiz</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}><span style={{ color: "var(--muted)" }}>KDV (%18)</span><span>₺{tax}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0", marginTop: 4, borderTop: "1px solid #000" }}><span>Total</span><span>₺{total}</span></div>
        </div>
      </aside>
    </div>
  );
}

function Track({ lang }) {
  const [id, setId] = useState("OIS-48291");
  const [found, setFound] = useState(null);
  const t = lang === "tr" ? { label: "Sipariş numarası girin.", btn: "Takip Et →", order: "Sipariş", eta: "Tahmini Teslim" }
    : { label: "Enter order number. Format OIS-XXXXX.", btn: "Track →", order: "Order", eta: "ETA" };

  const lookup = () => {
    if (id.trim().length < 3) return;
    setFound({
      id: id.toUpperCase(),
      eta: "Apr 23, 2026",
      steps: [
        { t: "Apr 19 09:12", label: "Order confirmed", state: "done" },
        { t: "Apr 20 14:30", label: "Packed at the studio", state: "done" },
        { t: "Apr 21 08:00", label: "In transit · DHL Express", state: "active" },
        { t: "—", label: "Out for delivery", state: "" },
        { t: "—", label: "Delivered", state: "" },
      ],
    });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 48px)" }}>
    <div className="text-page wide">
      <p>{t.label}</p>
      <div className="track-input">
        <input value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={lookup}>{t.btn}</button>
      </div>
      {found && (
        <>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between" }}>
            <span>{t.order} {found.id}</span>
            <span>{t.eta} {found.eta}</span>
          </div>
          <div className="track-steps">
            {found.steps.map((s, i) => (
              <div key={i} className={"track-step " + s.state}>
                <span className="t">{s.t}</span>
                <span className="label"><span className="dot" />{s.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  );
}

function Lookbook() {
  return (
    <div>
      <div className="lookbook">
        <div className="ph full wide cream" />
        <div className="ph cream" />
        <div className="ph dark" />
        <div className="ph full wide dark" />
        <div className="ph cream" />
        <div className="ph dark" />
      </div>
      <div className="text-page" style={{ marginTop: 32 }}>
        <p style={{ color: "var(--muted)" }}>Volume 01 · Shot in Istanbul · 2026</p>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>Photography · @dascinscaia.studio</p>
      </div>
    </div>
  );
}

function About({ lang }) {
  const t = lang === "tr" ? {
    paras: [
      "ois Istanbul'da kurulmuş küçük bir spor giyim stüdyosudur.",
      "Bir kazak, bir sweatshirt, bir tişört, bir eşofman — bir seferde bir parça üretiyoruz.",
      "Koleksiyon yapmıyoruz.",
      "Bir parça hazır olduğunda piyasaya çıkarıyoruz ve giyildiği sürece üretiyoruz.",
      "Kaliteli konfor için tasarlandı.",
      "Tüm ürünler stüdyomuzun 40 km yakınındaki iki küçük aile atölyesinde kesilip dikilmektedir.",
      "Kumaş İzmir ve Bursa'dan temin edilmektedir.",
    ],
    contact: "İletişim", general: "Genel", studio: "Stüdyo",
    policies: "Politikalar", shipping: "Kargo", returns: "İade", care: "Bakım",
    shippingVal: "Ücretsiz", returnsVal: "14 gün içinde iade", careVal: "Soğuk yıkayın, serin kurutun",
  } : {
    paras: [
      "ois is a small sportswear studio based in Istanbul.",
      "We make one hoodie, one crewneck, one tee, one sweatpant — at a time.",
      "We don't run seasons.",
      "We release a piece when it's ready and we keep making it as long as it's worn.",
      "Designed for quality comfort.",
      "All garments are cut and sewn within 40km of the studio, at two small family-run ateliers.",
      "Fabric is sourced from İzmir and Bursa.",
    ],
    contact: "Contact", general: "General", studio: "Studio",
    policies: "Policies", shipping: "Shipping", returns: "Returns", care: "Care",
    shippingVal: "Free", returnsVal: "14 days unworn", careVal: "Wash cold, line dry",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 48px)" }}>
      <div className="text-page">
        {t.paras.map((p, i) => (
          <p key={i} style={{ textTransform: "none", fontSize: 14, lineHeight: 1.7, marginTop: i === 0 ? 0 : 14 }}>{p}</p>
        ))}

        <h2 style={{ marginTop: 36, fontSize: 13 }}>{t.contact}</h2>
        <div className="row"><span>{t.general}</span><span>contact@ois.earth</span></div>
        <div className="row"><span>Instagram</span><span>@ois.earth</span></div>
        <div className="row"><span>{t.studio}</span><span>Bahçelievler, Istanbul</span></div>

        <h2 style={{ marginTop: 36, fontSize: 13 }}>{t.policies}</h2>
        <div className="row"><span>{t.shipping}</span><span>{t.shippingVal}</span></div>
        <div className="row"><span>{t.returns}</span><span>{t.returnsVal}</span></div>
        <div className="row"><span>{t.care}</span><span>{t.careVal}</span></div>
      </div>
    </div>
  );
}

function Contact({ lang }) {
  const [copied, setCopied] = useState(null);
  const copy = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 1500);
  };

  const emails = lang === "tr" ? [
    { addr: "contact@ois.earth", label: "Genel" },
    { addr: "business@ois.earth", label: "İş birlikleri & toptan satış" },
    { addr: "olga.dascinscaia@ois.earth", label: "Kreatif yönetim & fotoğraf" },
  ] : [
    { addr: "contact@ois.earth", label: "General" },
    { addr: "business@ois.earth", label: "Partnerships & wholesale" },
    { addr: "olga.dascinscaia@ois.earth", label: "Creative direction & photography" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 48px)" }}>
      <div className="text-page">
        {emails.map(({ addr, label }) => (
          <div key={addr} className="row" onClick={() => copy(addr)} style={{ cursor: "pointer" }}>
            <div>
              <div>{copied === addr ? "Copied" : addr}</div>
              <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Tweaks({ open, lang, setLang }) {
  const [theme, setTheme] = useState("default");
  const [size, setSize] = useState("default");

  useEffect(() => {
    document.body.classList.toggle("theme-inverse", theme === "inverse");
    document.body.classList.remove("size-sm", "size-md", "size-lg");
    if (size !== "default") document.body.classList.add("size-" + size);
  }, [theme, size]);

  return (
    <aside className={"tweaks " + (open ? "open" : "")}>
      <h4>Tweaks</h4>
      <div className="t-row">
        <span style={{ color: "var(--muted)" }}>language</span>
        <button onClick={() => setLang(lang === "en" ? "tr" : "en")}
          style={{ background: "transparent", border: "1px solid var(--muted)", padding: "4px 8px", color: "var(--ink)", cursor: "pointer" }}>
          {lang === "en" ? "TR" : "EN"}
        </button>
      </div>
      <div className="t-row">
        <span style={{ color: "var(--muted)" }}>theme</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="default">paper</option>
          <option value="inverse">inverse</option>
        </select>
      </div>
      <div className="t-row">
        <span style={{ color: "var(--muted)" }}>size</span>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="default">default</option>
          <option value="sm">small</option>
          <option value="md">medium</option>
          <option value="lg">large</option>
        </select>
      </div>
    </aside>
  );
}

function HomeSplash({ children }) {
  useEffect(() => {
    const vh = () => window.innerHeight;
    let snappedDown = false;
    let animating = false;
    let accumUp = 0;
    const UP_THRESHOLD = 900;
    let upTimer;

    const animateTo = (y) => {
      animating = true;
      const start = window.scrollY;
      const dist = y - start;
      const dur = 700;
      const t0 = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, start + dist * ease(t));
        if (t < 1) requestAnimationFrame(step);
        else { animating = false; snappedDown = y > 0; }
      };
      requestAnimationFrame(step);
    };

    const onWheel = (e) => {
      if (animating) { e.preventDefault(); return; }
      const y = window.scrollY;
      const cut = vh();
      if (!snappedDown && y < cut * 0.5 && e.deltaY > 0) {
        e.preventDefault();
        animateTo(cut);
        return;
      }
      if (snappedDown && y <= cut + 2 && e.deltaY < 0) {
        e.preventDefault();
        accumUp += -e.deltaY;
        clearTimeout(upTimer);
        upTimer = setTimeout(() => { accumUp = 0; }, 350);
        if (accumUp >= UP_THRESHOLD) { accumUp = 0; animateTo(0); }
        return;
      }
    };

    let touchY = null;
    let touchAccumUp = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (animating || touchY == null) { if (animating) e.preventDefault(); return; }
      const y = window.scrollY;
      const cut = vh();
      const dy = touchY - e.touches[0].clientY;
      if (!snappedDown && y < cut * 0.5 && dy > 40) {
        e.preventDefault(); animateTo(cut); touchY = null;
      } else if (snappedDown && y <= cut + 2 && dy < 0) {
        e.preventDefault();
        touchAccumUp += -dy;
        if (touchAccumUp >= UP_THRESHOLD / 2) { touchAccumUp = 0; animateTo(0); touchY = null; }
      }
    };
    const onTouchEnd = () => { touchY = null; touchAccumUp = 0; };
    const onScroll = () => { if (!animating) snappedDown = window.scrollY >= vh() * 0.5; };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(upTimer);
    };
  }, []);

  return (
    <div className="snap-wrap">
      <section className="snap-section splash">
        <div className="logo">
          OiS
          <span className="sub">EARTH</span>
        </div>
        <div className="hint">scroll ↓</div>
      </section>
      <section>{children}</section>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash.replace(/^#/, "") || "/");
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lang, setLang] = useState("tr");

  const navigate = useCallback((to) => {
    window.location.hash = to;
    setRoute(to);
    if (to === "/") {
      setTimeout(() => window.scrollTo(0, window.innerHeight), 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const on = () => { setRoute(window.location.hash.replace(/^#/, "") || "/"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    const on = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", on);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", on);
  }, []);

  const isHome = route === "/" || route === "";

  let page;
  if (isHome) page = <Home navigate={navigate} />;
  else if (route.startsWith("/p/")) page = <PDP id={route.slice(3)} navigate={navigate} openDrawer={() => setDrawerOpen(true)} lang={lang} />;
  else if (route === "/cart") page = <Cart navigate={navigate} lang={lang} />;
  else if (route === "/checkout") page = <Checkout navigate={navigate} lang={lang} />;
  else if (route === "/track") page = <Track lang={lang} />;
  else if (route === "/lookbook") page = <Lookbook />;
  else if (route === "/about") page = <About lang={lang} />;
  else if (route === "/contact") page = <Contact lang={lang} />;
  else page = <div className="text-page"><p>Not found.</p></div>;

  return (
    <>
      {isHome ? (
        <HomeSplash>
          <Shell route={route} navigate={navigate} lang={lang} setLang={setLang}>{page}</Shell>
        </HomeSplash>
      ) : (
        <Shell route={route} navigate={navigate} lang={lang} setLang={setLang}>{page}</Shell>
      )}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} navigate={navigate} lang={lang} />
      <Tweaks open={tweaksOpen} lang={lang} setLang={setLang} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
