import { useEffect, useMemo, useState } from "react";
import {
  CaretRight,
  CheckCircle,
  Funnel,
  Heart,
  List,
  MagnifyingGlass,
  Minus,
  Plus,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  UserCircle,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";

const A = "/assets/";
const WHATSAPP_NUMBER = "250784001835";
const DISPLAY_PHONE = "+250 784 001 835";
const INSTAGRAM = "nidodos";

const STORAGE_KEY = "dodo-technologies-admin-phones";

const nav = ["Deals", "iPhones", "Samsung", "Google Pixel", "Pre-owned", "Warranty", "Admin", "Instagram"];

const categories = [
  ["iPhones", "dodo-iphone.png"],
  ["Samsung Galaxy", "dodo-samsung.png"],
  ["Google Pixel", "dodo-pixel.png"],
  ["Flagship Phones", "dodo-samsung.png"],
  ["Budget Phones", "dodo-pixel.png"],
  ["Clean Pre-owned", "dodo-iphone.png"],
];

const tabs = ["All Phones", "iPhone", "Samsung", "Pixel", "Flagship", "Best Deals"];

const products = [
  ["iPhone 16 Pro Max", "256GB, Desert Titanium, eSIM, Unlocked", 1680000, "dodo-iphone.png", "New Arrival"],
  ["iPhone 15 Pro Max", "256GB, Blue Titanium, Unlocked", 1260000, "dodo-iphone.png", "Hot Deal"],
  ["iPhone 14 Pro Max", "128GB, Deep Purple, Unlocked", 780000, "dodo-iphone.png", "Best Seller"],
  ["iPhone 13", "128GB, Starlight, Unlocked", 495000, "dodo-iphone.png", "Clean Stock"],
  ["Samsung Galaxy S24 Ultra", "256GB, Titanium Gray, Dual SIM", 1380000, "dodo-samsung.png", "Flagship"],
  ["Samsung Galaxy S23 Ultra", "256GB, Phantom Black, Dual SIM", 980000, "dodo-samsung.png", "Hot Deal"],
  ["Samsung Galaxy S22", "128GB, Green, Dual SIM", 560000, "dodo-samsung.png", "Clean Stock"],
  ["Samsung Galaxy A55", "128GB, Awesome Iceblue, Dual SIM", 430000, "dodo-samsung.png", "Budget Pick"],
  ["Google Pixel 9 Pro", "256GB, Obsidian, Unlocked", 1120000, "dodo-pixel.png", "New Arrival"],
  ["Google Pixel 8 Pro", "128GB, Porcelain, Unlocked", 760000, "dodo-pixel.png", "Hot Deal"],
  ["Google Pixel 7", "128GB, Snow, Unlocked", 420000, "dodo-pixel.png", "Value Deal"],
  ["Google Pixel 6a", "128GB, Charcoal, Unlocked", 290000, "dodo-pixel.png", "Budget Pick"],
];

const filters = ["Series", "Storage", "Color", "Condition", "Battery Health", "SIM Type", "Price Range"];

function loadAdminProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveAdminProducts(nextProducts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
}

function currency(value) {
  return `Rwf ${value.toLocaleString("en-RW")}`;
}

function imageSrc(img) {
  if (!img) return `${A}dodo-iphone.png`;
  return img.startsWith("http") || img.startsWith("data:") ? img : `${A}${img}`;
}

function whatsappUrl(product) {
  const [name, specs, price] = product;
  const text = `Hi DODO TECHNOLOGIES, I am interested in ${name}. Specs: ${specs}. Listed price: ${currency(price)}. Please send availability and payment details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function AppLogo({ compact = false }) {
  return (
    <button className={`logo ${compact ? "compact" : ""}`} onClick={() => { location.hash = "#/"; }}>
      <span className="logoMain">DODO</span>
      <span className="logoSub">TECHNOLOGIES</span>
    </button>
  );
}

function Header({ setRoute, products }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [cart, setCart] = useState(false);
  const go = (next) => setRoute(next);
  return (
    <>
      <header className="topbar">
        <div className="topline">
          <button className="iconButton mobileOnly" onClick={() => setMenu(true)} aria-label="Open menu"><List size={22} /></button>
          <AppLogo />
          <button className="search" onClick={() => setSearch(true)}>
            <span>Search phone model, color, storage...</span>
            <MagnifyingGlass size={24} />
          </button>
          <button className="help" onClick={() => go("help")}>Need help?</button>
          <button className="iconButton" aria-label="Account"><UserCircle size={25} /></button>
          <button className="iconButton" onClick={() => setCart(true)} aria-label="Cart"><ShoppingCart size={27} /></button>
        </div>
        <nav className="navline">
          <button className="allItems" onClick={() => setMenu(true)}><List size={18} /> All phones</button>
          {nav.map((item) => item === "Instagram" ? <a key={item} href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer">{item}</a> : <button key={item} onClick={() => go(item === "Deals" ? "deals" : item === "Admin" ? "admin" : "collection")}>{item}</button>)}
          <a className="sell whatsappTop" href={whatsappUrl(products[0])} target="_blank" rel="noreferrer"><WhatsappLogo size={18} weight="fill" /> WhatsApp</a>
        </nav>
      </header>
      {menu && <MenuDrawer onClose={() => setMenu(false)} go={go} />}
      {search && <SearchModal onClose={() => setSearch(false)} go={go} products={products} />}
      {cart && <CartDrawer onClose={() => setCart(false)} product={products[0]} />}
    </>
  );
}

function MenuDrawer({ onClose, go }) {
  return (
    <aside className="overlay">
      <div className="drawer leftDrawer">
        <button className="close" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        <AppLogo compact />
        <h2>Shop phones</h2>
        <button className="menuRow adminMenuRow" onClick={() => { go("admin"); onClose(); }}>
          <span className="menuIcon">+</span>
          <span>Admin panel</span>
          <CaretRight />
        </button>
        {categories.map(([name, img]) => (
          <button className="menuRow" key={name} onClick={() => { go("collection"); onClose(); }}>
            <img src={imageSrc(img)} alt="" />
            <span>{name}</span>
            <CaretRight />
          </button>
        ))}
      </div>
    </aside>
  );
}

function SearchModal({ onClose, go, products }) {
  const [term, setTerm] = useState("");
  const results = products.filter((p) => `${p[0]} ${p[1]}`.toLowerCase().includes(term.toLowerCase())).slice(0, 6);
  return (
    <aside className="overlay centerOverlay">
      <div className="searchPanel">
        <button className="close" onClick={onClose} aria-label="Close search"><X size={20} /></button>
        <label className="searchField">
          <MagnifyingGlass size={22} />
          <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search Pixel 8 Pro, S24 Ultra, iPhone 15..." />
        </label>
        <div className="quickTerms">
          {["iPhone 16", "Galaxy S24", "Pixel 9", "Pro Max", "128GB"].map((item) => <button key={item} onClick={() => setTerm(item)}>{item}</button>)}
        </div>
        <div className="searchResults">
          {(term ? results : products.slice(0, 4)).map((p) => <ProductMini key={p[0]} product={p} onClick={() => { go("product"); onClose(); }} />)}
        </div>
      </div>
    </aside>
  );
}

function CartDrawer({ onClose, product }) {
  return (
    <aside className="overlay">
      <div className="drawer">
        <button className="close" onClick={onClose} aria-label="Close cart"><X size={20} /></button>
        <h2>Your shortlist</h2>
        <p className="muted">Send your chosen phone to DODO TECHNOLOGIES on WhatsApp to confirm stock.</p>
        <ProductMini product={product} />
        <div className="cartLine"><span>Estimated price</span><strong>{currency(product[2])}</strong></div>
        <a className="primary wide whatsappCta" href={whatsappUrl(product)} target="_blank" rel="noreferrer"><WhatsappLogo size={20} weight="fill" /> Chat on WhatsApp</a>
        <button className="secondary wide" onClick={onClose}>Keep browsing</button>
      </div>
    </aside>
  );
}

function TrustBar() {
  return (
    <div className="trustBar">
      <span><CheckCircle size={16} /> Tested phones</span>
      <span>Battery health checked</span>
      <span>Local WhatsApp support</span>
      <strong>Fast replies on {DISPLAY_PHONE}</strong>
    </div>
  );
}

function Hero({ product }) {
  return (
    <section className="hero">
      <img className="heroLeft" src={imageSrc("dodo-samsung.png")} alt="" />
      <div className="heroCopy">
        <p className="heroBrand">DODO TECHNOLOGIES</p>
        <h1>Premium Phones in RWF</h1>
        <p>iPhones, Samsung Galaxy, and Google Pixel. Direct WhatsApp help.</p>
        <a className="primary whatsappCta" href={whatsappUrl(product)} target="_blank" rel="noreferrer"><WhatsappLogo size={20} weight="fill" /> Ask on WhatsApp</a>
      </div>
      <img className="heroRight" src={imageSrc("dodo-pixel.png")} alt="" />
    </section>
  );
}

function HomePage({ setRoute, products }) {
  return (
    <>
      <Hero product={products[0]} />
      <TrustBar />
      <section className="section white">
        <h2>Shop by Phone Family</h2>
        <div className="categoryGrid">
          {categories.map(([name, img]) => <button key={name} className="category" onClick={() => setRoute("collection")}><img src={imageSrc(img)} alt="" /><span>{name}</span></button>)}
        </div>
      </section>
      <ProductStrip title="Customer Favorites" products={products.slice(0, 6)} setRoute={setRoute} tabs />
      <ProductStrip title="Today's Phone Deals" products={products.slice(4, 10)} setRoute={setRoute} dealCard />
      <PromiseBand />
      <ProductStrip title="Flagship Picks" products={products.filter((p) => p[0].includes("Ultra") || p[0].includes("Pro")).concat(products.slice(0, 2))} setRoute={setRoute} />
      <ProductStrip title="Budget Phones" products={products.slice(7, 12)} setRoute={setRoute} />
      <section className="videoBand">
        <h2>How DODO TECHNOLOGIES Works</h2>
        <p>Pick the phone you like, tap WhatsApp, and the model name with simple specs is prepared for chat.</p>
        <div className="storyCards">
          <div><WhatsappLogo size={42} weight="fill" /><span>Send the exact phone details.</span></div>
          <div><CheckCircle size={42} /><span>Confirm stock, condition, and payment.</span></div>
        </div>
      </section>
    </>
  );
}

function ProductStrip({ title, products: list, setRoute, tabs: showTabs = false, dealCard = false }) {
  return (
    <section className="section">
      <div className="sectionHead">
        <h2>{title}</h2>
        <button onClick={() => setRoute("collection")}>See all <CaretRight size={16} /></button>
      </div>
      {showTabs && <div className="tabs">{tabs.map((tab, i) => <button className={i === 0 ? "active" : ""} key={tab}>{tab}</button>)}</div>}
      <div className="strip">
        {dealCard && <div className="dealCard"><p>DODO Deals</p><strong>iPhone, Samsung, Pixel</strong><button onClick={() => setRoute("collection")}>Shop deals</button></div>}
        {list.map((product) => <ProductCard key={`${title}-${product[0]}`} product={product} onView={() => setRoute("product")} />)}
      </div>
    </section>
  );
}

function ProductCard({ product, onView }) {
  const [name, meta, price, img, tag] = product;
  return (
    <article className="productCard">
      <span className="badge">{tag}</span>
      <button className="productView" onClick={onView}>
        <img src={imageSrc(img)} alt={name} />
        <strong>{name}</strong>
        <small>{meta}</small>
        <span className="price">{currency(price)} <em>Ask stock</em></span>
      </button>
      <a className="whatsappButton" href={whatsappUrl(product)} target="_blank" rel="noreferrer"><WhatsappLogo weight="fill" /> WhatsApp</a>
    </article>
  );
}

function ProductMini({ product, onClick }) {
  return (
    <button className="miniProduct" onClick={onClick}>
      <img src={imageSrc(product[3])} alt="" />
      <span><strong>{product[0]}</strong><small>{product[1]}</small></span>
      <b>{currency(product[2])}</b>
    </button>
  );
}

function PromiseBand() {
  return (
    <section className="promise">
      <div>
        <h2>Phones only.<br />Clear specs.</h2>
        <p>Message <strong>{DISPLAY_PHONE}</strong> for availability and condition photos.</p>
        <strong>DODO TECHNOLOGIES direct support</strong>
      </div>
      <ul>
        {["Only iPhone, Samsung, and Pixel", "Battery health checked", "Unlocked options highlighted", "Simple WhatsApp enquiry", "Condition confirmed before payment"].map((item) => <li key={item}><CheckCircle size={18} /> {item}</li>)}
      </ul>
    </section>
  );
}

function CollectionPage({ setRoute, products }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [active, setActive] = useState("All");
  const list = useMemo(() => products.concat(products.slice(0, 8)), []);
  return (
    <>
      <section className="collectionHero dodoHero">
        <div>
          <h1>DODO TECHNOLOGIES <span>Phones</span></h1>
          <strong>iPhone, Samsung, Pixel</strong><b>|</b><strong>WhatsApp support</strong><b>|</b><strong>{DISPLAY_PHONE}</strong>
        </div>
        <div className="heroTrust">Clean stock <Star weight="fill" /> Fast replies</div>
        <img src={imageSrc("dodo-pixel.png")} alt="" />
      </section>
      <div className="mobileFilter">
        <button onClick={() => setFilterOpen(true)}><Funnel size={18} /> Filters</button>
        <button><SlidersHorizontal size={18} /> Best Deals</button>
      </div>
      <main className="collectionLayout">
        <aside className={`filters ${filterOpen ? "open" : ""}`}>
          <button className="close mobileOnly" onClick={() => setFilterOpen(false)}><X /></button>
          <h3>PRICE RANGE</h3>
          <div className="priceInputs"><span>Rwf 250,000</span><span>Rwf 1,700,000</span></div>
          <input type="range" min="250000" max="1700000" defaultValue="760000" />
          {filters.map((item) => <details key={item}><summary>{item}<Plus size={16} /></summary><label><input type="checkbox" /> Pro Max</label><label><input type="checkbox" /> 128GB</label></details>)}
        </aside>
        <section className="collectionProducts">
          <div className="brandRow">
            {["All", "iPhone", "Samsung", "Pixel", "Flagship", "Budget"].map((brand) => <button className={active === brand ? "active" : ""} onClick={() => setActive(brand)} key={brand}>{brand}</button>)}
            <select aria-label="Sort"><option>Best Deals</option><option>Lowest Price</option><option>Newest Phones</option></select>
          </div>
          <div className="productGrid">
            {list.map((p, i) => <ProductCard product={p} key={`${p[0]}-${i}`} onView={() => setRoute("product")} />)}
          </div>
          <div className="pagination">{[1, 2, 3, 4].map((n) => <button className={n === 1 ? "active" : ""} key={n}>{n}</button>)}<button><CaretRight /></button></div>
        </section>
      </main>
      <PromiseBand />
      <InfoCopy />
    </>
  );
}

function ProductPage({ products }) {
  const [qty, setQty] = useState(1);
  const p = products[0];
  return (
    <main className="productPage">
      <section className="gallery">
        <img src={imageSrc(p[3])} alt={p[0]} />
        <div>{[p[3], "dodo-samsung.png", "dodo-pixel.png"].map((img) => <button key={img}><img src={imageSrc(img)} alt="" /></button>)}</div>
      </section>
      <section className="purchase">
        <p className="crumb">Home / Phones / DODO TECHNOLOGIES</p>
        <h1>{p[0]}</h1>
        <p>{p[1]}</p>
        <div className="rating">Condition and availability confirmed on WhatsApp</div>
        <h2>{currency(p[2])}</h2>
        <div className="optionGroup"><b>Condition</b>{["Excellent", "Very Good", "Good"].map((x) => <button key={x}>{x}</button>)}</div>
        <div className="optionGroup"><b>Storage</b>{["128GB", "256GB", "512GB"].map((x) => <button key={x}>{x}</button>)}</div>
        <div className="quantity"><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></button><span>{qty}</span><button onClick={() => setQty(qty + 1)}><Plus /></button></div>
        <a className="primary wide whatsappCta" href={whatsappUrl(p)} target="_blank" rel="noreferrer"><WhatsappLogo size={20} weight="fill" /> Chat on WhatsApp</a>
        <button className="secondary wide"><Heart size={18} /> Save phone</button>
        <PromiseBand />
      </section>
    </main>
  );
}

function SimplePage({ kind, products }) {
  const copy = {
    help: ["Help Center", "Ask DODO TECHNOLOGIES about stock, battery health, delivery, collection, and payment on WhatsApp."],
    deals: ["Phone Deals", "Only iPhones, Samsung Galaxy, and Google Pixel. Tap any WhatsApp button to send the phone details."],
    sell: ["WhatsApp DODO TECHNOLOGIES", `Send the phone model you want and we will reply from ${DISPLAY_PHONE}.`],
  }[kind] || ["About DODO TECHNOLOGIES", "A phone shop for iPhone, Samsung Galaxy, and Google Pixel with simple listings and direct WhatsApp enquiries."];
  return (
    <main className="simplePage">
      <h1>{copy[0]}</h1>
      <p>{copy[1]}</p>
      <div className="supportGrid">
        {["Check availability", "Ask for photos", "Confirm battery health", "Chat on WhatsApp"].map((item) => <a key={item} href={whatsappUrl(products[0])} target="_blank" rel="noreferrer">{item}<CaretRight /></a>)}
      </div>
      <PromiseBand />
    </main>
  );
}

function InfoCopy() {
  return (
    <section className="infoCopy">
      <h2>Explore DODO TECHNOLOGIES Phone Deals</h2>
      <p>DODO TECHNOLOGIES focuses on iPhones, Samsung Galaxy, and Google Pixel phones, making it easier to compare model, storage, color, condition, and price without unrelated products.</p>
      <p>When a client likes a phone, the WhatsApp button opens a chat with the phone name, simple specs, and listed price already prepared.</p>
    </section>
  );
}

function Footer({ products }) {
  return (
    <footer className="footer">
      <div><h3>DODO TECHNOLOGIES</h3><a>iPhone, Samsung, Pixel</a><a>Customer support</a><a>WhatsApp {DISPLAY_PHONE}</a><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer">Instagram @{INSTAGRAM}</a></div>
      <div><h3>SHOP</h3><a>iPhones</a><a>Samsung Galaxy</a><a>Google Pixel</a><a>Budget Phones</a></div>
      <div><h3>HELP</h3><a>Battery health</a><a>Condition photos</a><a>Availability</a><a className="footerWhatsapp" href={whatsappUrl(products[0])} target="_blank" rel="noreferrer">CONTACT ON WHATSAPP</a></div>
      <form><h3>Get phone deal updates.</h3><input placeholder="Enter your email" /><button>Subscribe</button><p>Or message {DISPLAY_PHONE} for faster help.</p></form>
    </footer>
  );
}

function AdminPanel({ adminProducts, addAdminProduct, removeAdminProduct, setRoute }) {
  const [draft, setDraft] = useState({
    name: "",
    brand: "iPhone",
    specs: "",
    price: "",
    image: "",
    tag: "New Stock",
  });
  const [error, setError] = useState("");
  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    const price = Number(String(draft.price).replaceAll(",", ""));
    if (!draft.name.trim()) {
      setError("Add the phone model name.");
      return;
    }
    if (!draft.specs.trim()) {
      setError("Add simple specs for WhatsApp.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Add a valid RWF price.");
      return;
    }
    if (!draft.image.trim() || !draft.image.startsWith("http")) {
      setError("Paste a Cloudinary image URL starting with https://.");
      return;
    }
    addAdminProduct([
      draft.name.trim(),
      draft.specs.trim(),
      price,
      draft.image.trim(),
      draft.tag.trim() || draft.brand,
    ]);
    setDraft({ name: "", brand: draft.brand, specs: "", price: "", image: "", tag: "New Stock" });
    setError("");
  };

  return (
    <main className="adminPage">
      <section className="adminHero">
        <div>
          <p className="heroBrand">DODO TECHNOLOGIES ADMIN</p>
          <h1>Upload new phones</h1>
          <p>Paste a Cloudinary-hosted image URL, add the phone details, and the listing appears in the shop immediately.</p>
        </div>
        <button className="secondary" onClick={() => setRoute("home")}>View shop</button>
      </section>

      <section className="adminLayout">
        <form className="adminForm" onSubmit={submit}>
          <label>
            Phone name
            <input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="Samsung Galaxy S24 Ultra" />
          </label>
          <label>
            Brand
            <select value={draft.brand} onChange={(event) => update("brand", event.target.value)}>
              <option>iPhone</option>
              <option>Samsung Galaxy</option>
              <option>Google Pixel</option>
            </select>
          </label>
          <label>
            Simple specs
            <input value={draft.specs} onChange={(event) => update("specs", event.target.value)} placeholder="256GB, Titanium Gray, Dual SIM" />
          </label>
          <label>
            Price in RWF
            <input inputMode="numeric" value={draft.price} onChange={(event) => update("price", event.target.value)} placeholder="1380000" />
          </label>
          <label>
            Cloudinary image URL
            <input value={draft.image} onChange={(event) => update("image", event.target.value)} placeholder="https://res.cloudinary.com/.../phone.jpg" />
          </label>
          <label>
            Badge
            <input value={draft.tag} onChange={(event) => update("tag", event.target.value)} placeholder="New Stock" />
          </label>
          {error && <p className="formError">{error}</p>}
          <button className="primary wide" type="submit"><Plus size={18} /> Add phone</button>
        </form>

        <aside className="adminPreview">
          <h2>Preview</h2>
          <ProductCard
            product={[
              draft.name || "Phone model",
              draft.specs || "Storage, color, SIM status",
              Number(draft.price) || 0,
              draft.image || "dodo-samsung.png",
              draft.tag || "New Stock",
            ]}
            onView={() => {}}
          />
          <div className="adminTip">
            <strong>Cloudinary workflow</strong>
            <p>Upload the phone photo to Cloudinary, copy the secure image URL, then paste it into the image field.</p>
          </div>
        </aside>
      </section>

      <section className="adminInventory">
        <div className="sectionHead">
          <h2>Admin-added phones</h2>
          <span>{adminProducts.length} saved locally</span>
        </div>
        {adminProducts.length === 0 ? (
          <p className="emptyState">No admin phones yet. Add one with a Cloudinary URL to see it here and in the shop.</p>
        ) : (
          <div className="adminList">
            {adminProducts.map((product, index) => (
              <article className="adminRow" key={`${product[0]}-${index}`}>
                <img src={imageSrc(product[3])} alt="" />
                <div>
                  <strong>{product[0]}</strong>
                  <small>{product[1]}</small>
                  <b>{currency(product[2])}</b>
                </div>
                <a href={whatsappUrl(product)} target="_blank" rel="noreferrer">Test WhatsApp</a>
                <button onClick={() => removeAdminProduct(index)}>Remove</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export function App() {
  const [route, setRoute] = useState("home");
  const [adminProducts, setAdminProducts] = useState(loadAdminProducts);
  const allProducts = useMemo(() => [...adminProducts, ...products], [adminProducts]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const addAdminProduct = (product) => {
    const nextProducts = [product, ...adminProducts];
    setAdminProducts(nextProducts);
    saveAdminProducts(nextProducts);
  };
  const removeAdminProduct = (index) => {
    const nextProducts = adminProducts.filter((_, itemIndex) => itemIndex !== index);
    setAdminProducts(nextProducts);
    saveAdminProducts(nextProducts);
  };
  const page = route === "collection"
    ? <CollectionPage setRoute={setRoute} products={allProducts} />
    : route === "product"
      ? <ProductPage products={allProducts} />
      : route === "admin"
        ? <AdminPanel adminProducts={adminProducts} addAdminProduct={addAdminProduct} removeAdminProduct={removeAdminProduct} setRoute={setRoute} />
        : route === "home"
          ? <HomePage setRoute={setRoute} products={allProducts} />
          : <SimplePage kind={route} products={allProducts} />;
  return (
    <>
      <Header setRoute={setRoute} products={allProducts} />
      {page}
      <Footer products={allProducts} />
    </>
  );
}
