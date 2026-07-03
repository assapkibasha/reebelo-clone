"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  List,
  MagnifyingGlass,
  Pause,
  Play,
  Plus,
  Star,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react";

const A = "/assets/";
const STORE_NAME = "KG Phone Store";
const WHATSAPP_NUMBER = "250784001835";
const DISPLAY_PHONE = "+250 784 001 835";
const INSTAGRAM = "nidodos";

const nav = [
  { label: "All phones", route: "collection" },
  { label: "Deals", route: "deals" },
  { label: "Warranty", route: "help" },
  { label: "Admin", route: "admin" },
  { label: "Instagram", href: `https://instagram.com/${INSTAGRAM}` },
];

const BASE_BRANDS = ["iPhone", "Samsung", "Samsung Galaxy", "Pixel", "Google Pixel"];

const DEMO_PRODUCTS = [
  ["iPhone 15 Pro Max", "256GB, Natural Titanium, 93% battery, unlocked", 1280000, "iphone-79.png", "Demo stock", "demo-iphone-15-pro-max", "demo", "iPhone"],
  ["iPhone 14 Pro", "128GB, Deep Purple, 90% battery, unlocked", 870000, "iphone-27.png", "Demo deal", "demo-iphone-14-pro", "demo", "iPhone"],
  ["Samsung Galaxy S24 Ultra", "256GB, Titanium Gray, dual SIM, clean box", 1360000, "dodo-samsung.png", "Demo flagship", "demo-s24-ultra", "demo", "Samsung"],
  ["Samsung Galaxy S23", "256GB, Phantom Black, dual SIM, excellent", 790000, "phones-49.png", "Demo pick", "demo-s23", "demo", "Samsung"],
  ["Google Pixel 8 Pro", "128GB, Obsidian, unlocked, excellent camera", 760000, "dodo-pixel.png", "Demo camera", "demo-pixel-8-pro", "demo", "Pixel"],
  ["Google Pixel 7", "128GB, Snow, unlocked, clean condition", 420000, "smartphones-40.png", "Demo value", "demo-pixel-7", "demo", "Pixel"],
  ["iPhone 13", "128GB, Midnight, 89% battery, unlocked", 520000, "dodo-iphone.png", "Demo budget", "demo-iphone-13", "demo", "iPhone"],
  ["Samsung Galaxy A55", "128GB, Ice Blue, dual SIM, like new", 430000, "smartphones-16.png", "Demo budget", "demo-a55", "demo", "Samsung"],
];

function currency(value) {
  return `Rwf ${Number(value || 0).toLocaleString("en-RW")}`;
}

function imageSrc(img) {
  if (!img) return "";
  return img.startsWith("http") || img.startsWith("data:") ? img : `${A}${img}`;
}

function whatsappUrl(product) {
  if (!product) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi ${STORE_NAME}, please share current phone availability.`)}`;
  }

  const [name, specs, price] = product;
  const text = `Hi ${STORE_NAME}, I am interested in ${name}. Specs: ${specs}. Listed price: ${currency(price)}. Please send availability and payment details.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function productBrand(product) {
  return product?.[7] || product?.[4] || "Phones";
}

function isFeatured(product) {
  return Boolean(product?.[8]);
}

function getBrands(products) {
  return [...new Set(products.map(productBrand).filter(Boolean))];
}

function getCategoryProducts(products) {
  return getBrands(products).map((brand) => {
    const product = products.find((item) => productBrand(item) === brand);
    return { brand, image: product?.[3] || "", count: products.filter((item) => productBrand(item) === brand).length };
  });
}

function getSearchTerms(products) {
  return [...new Set(products.flatMap((product) => [product[0], productBrand(product), product[1]?.split(",")[0]].filter(Boolean)))].slice(0, 5);
}

function getSpecPills(meta) {
  return String(meta || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

function matchesBrand(product, active) {
  if (active === "All") return true;
  return productBrand(product).toLowerCase().includes(active.toLowerCase());
}

function AppLogo({ compact = false }) {
  return (
    <button className={`logo ${compact ? "compact" : ""}`} onClick={() => { location.hash = "#/"; }}>
      <span className="logoMain">KG</span>
      <span className="logoSub">PHONE STORE</span>
    </button>
  );
}

function Header({ setRoute, products }) {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const go = (next) => setRoute(next);
  const featured = products[0];
  return (
    <>
      <header className="topbar">
        <div className="topline">
          <button className="menuButton" onClick={() => setMenu(true)} aria-label="Open menu"><List size={22} /></button>
          <AppLogo />
          <button className="search" onClick={() => setSearch(true)}>
            <span>Search phone model, color, storage...</span>
            <MagnifyingGlass size={24} />
          </button>
          <button className="help" onClick={() => go("help")}>Need help?</button>
          <a className="topWhatsapp" href={whatsappUrl(featured)} target="_blank" rel="noreferrer"><WhatsappLogo size={18} weight="fill" /> WhatsApp</a>
        </div>
      </header>
      {menu && <MenuDrawer onClose={() => setMenu(false)} go={go} products={products} />}
      {search && <SearchModal onClose={() => setSearch(false)} go={go} products={products} />}
    </>
  );
}

function MenuDrawer({ onClose, go, products }) {
  const categories = getCategoryProducts(products);
  return (
    <aside className="overlay">
      <div className="drawer leftDrawer">
        <button className="close" onClick={onClose} aria-label="Close menu"><X size={20} /></button>
        <AppLogo compact />
        <h2>Menu</h2>
        <div className="drawerNav">
          {nav.map((item) => item.href ? (
            <a className="drawerLink" href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label}<CaretRight /></a>
          ) : (
            <button className="drawerLink" key={item.label} onClick={() => { go(item.route); onClose(); }}>{item.label}<CaretRight /></button>
          ))}
        </div>
        <h3>Shop by brand</h3>
        {categories.length === 0 && <p className="emptyState">No backend inventory is available yet.</p>}
        {categories.map(({ brand, image, count }) => (
          <button className="menuRow" key={brand} onClick={() => { go("collection"); onClose(); }}>
            {image ? <img src={imageSrc(image)} alt="" /> : <span className="menuIcon">KG</span>}
            <span>{brand}<small>{count} in backend</small></span>
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
  const quickTerms = getSearchTerms(products);
  return (
    <aside className="overlay centerOverlay">
      <div className="searchPanel">
        <button className="close" onClick={onClose} aria-label="Close search"><X size={20} /></button>
        <label className="searchField">
          <MagnifyingGlass size={22} />
          <input autoFocus value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search Pixel 8 Pro, S24 Ultra, iPhone 15..." />
        </label>
        <div className="quickTerms">
          {quickTerms.map((item) => <button key={item} onClick={() => setTerm(item)}>{item}</button>)}
        </div>
        <div className="searchResults">
          {(term ? results : products.slice(0, 4)).map((p) => <ProductMini key={p[5] || p[0]} product={p} onClick={() => { go("product"); onClose(); }} />)}
          {products.length === 0 && <p className="emptyState">No products are currently returned by the backend.</p>}
        </div>
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

function Hero({ products, demoMode }) {
  const featuredProducts = products.filter(isFeatured);
  const slides = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 1);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const product = slides[active] || products[0];
  const image = imageSrc(product?.[3]);

  useEffect(() => {
    setActive(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  const previousSlide = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  const nextSlide = () => setActive((current) => (current + 1) % slides.length);

  return (
    <section className="hero">
      {image && <img className="heroLeft" src={image} alt="" />}
      <div className="heroCopy">
        <p className="heroBrand">{STORE_NAME}</p>
        <h1>{product ? "Premium phones. Clear prices. Fast WhatsApp." : "Backend inventory required"}</h1>
        <p>{product ? `${product[0]} is featured in this ${demoMode ? "demo preview" : "live inventory"} view.` : "Add real phones in admin to populate the storefront."}</p>
        <a className="primary whatsappCta" href={whatsappUrl(product)} target="_blank" rel="noreferrer"><WhatsappLogo size={20} weight="fill" /> Ask on WhatsApp</a>
      </div>
      {image && <img className="heroRight" src={image} alt="" />}
      {slides.length > 1 && (
        <div className="heroControls" aria-label="Featured phones">
          <button className="heroArrow" onClick={previousSlide} aria-label="Previous featured phone"><CaretLeft size={18} /></button>
          <button className="heroPlay" onClick={() => setPaused((current) => !current)} aria-label={paused ? "Play featured carousel" : "Pause featured carousel"}>
            {paused ? <Play size={15} weight="fill" /> : <Pause size={15} weight="fill" />}
          </button>
          <div className="heroDots">
            {slides.map((slide, index) => (
              <button className={active === index ? "active" : ""} key={slide[5] || slide[0]} onClick={() => setActive(index)} aria-label={`Show ${slide[0]}`} />
            ))}
          </div>
          <button className="heroArrow" onClick={nextSlide} aria-label="Next featured phone"><CaretRight size={18} /></button>
        </div>
      )}
    </section>
  );
}

function HomePage({ setRoute, products, databaseReady, backendError, demoMode }) {
  const categories = getCategoryProducts(products);

  return (
    <>
      <Hero products={products} demoMode={demoMode} />
      {demoMode && <DemoPreviewNotice databaseReady={databaseReady} error={backendError} />}
      <TrustBar />
      <section className="section white">
        <div className="sectionHead">
          <h2>Shop by phone family</h2>
          <button onClick={() => setRoute("collection")}>Browse all <CaretRight size={16} /></button>
        </div>
        <div className="categoryGrid">
          {categories.map(({ brand, image, count }) => <button key={brand} className="category" onClick={() => setRoute("collection")}>{image ? <img src={imageSrc(image)} alt="" /> : <span className="categoryEmpty">KG</span>}<span>{brand}<small>{count} listed</small></span></button>)}
          {categories.length === 0 && <EmptyInventory setRoute={setRoute} />}
        </div>
      </section>
      <ProductStrip title="Available phones" products={products} setRoute={setRoute} />
      <PromiseBand />
    </>
  );
}

function ProductStrip({ title, products: list, setRoute }) {
  if (list.length === 0) return null;
  return (
    <section className="section">
      <div className="sectionHead">
        <h2>{title}</h2>
        <button onClick={() => setRoute("collection")}>See all <CaretRight size={16} /></button>
      </div>
      <div className="productGrid compactGrid">
        {list.map((product, index) => <ProductCard key={`${title}-${product[5] || product[0]}-${index}`} product={product} onView={() => setRoute("product")} />)}
      </div>
    </section>
  );
}

function ProductCard({ product, onView }) {
  const [name, meta, price, img, tag] = product;
  const specs = getSpecPills(meta);
  return (
    <article className="productCard">
      <button className="productView" onClick={onView}>
        <span className="badge">{tag}</span>
        <span className="productImage">{img ? <img src={imageSrc(img)} alt={name} /> : <span className="imageMissing">No image</span>}</span>
        <span className="productInfo">
          <span className="productBrand">{productBrand(product)}</span>
          <strong>{name}</strong>
          <span className="specPills">{specs.map((spec) => <span key={spec}>{spec}</span>)}</span>
        </span>
      </button>
      <div className="cardFooter">
        <span className="price">{currency(price)} <em>Ask stock</em></span>
        <a className="whatsappButton" href={whatsappUrl(product)} target="_blank" rel="noreferrer"><WhatsappLogo weight="fill" /> WhatsApp</a>
      </div>
    </article>
  );
}

function ProductMini({ product, onClick }) {
  if (!product) return null;
  return (
    <button className="miniProduct" onClick={onClick}>
      {product[3] ? <img src={imageSrc(product[3])} alt="" /> : <span className="imageMissing">No image</span>}
      <span><strong>{product[0]}</strong><small>{product[1]}</small></span>
      <b>{currency(product[2])}</b>
    </button>
  );
}

function EmptyInventory({ setRoute }) {
  return (
    <div className="emptyInventory">
      <h3>No backend inventory yet</h3>
      <p>The storefront will stay empty until MongoDB returns real phone records.</p>
      <button className="primary" onClick={() => setRoute("admin")}>Open admin</button>
    </div>
  );
}

function BackendNotice({ error }) {
  return (
    <section className="backendNotice">
      <strong>Backend unavailable</strong>
      <span>{error || "Configure MongoDB so the site can load real inventory."}</span>
    </section>
  );
}

function DemoPreviewNotice({ databaseReady, error }) {
  return (
    <section className="backendNotice demoNotice">
      <strong>Demo data preview</strong>
      <span>{databaseReady ? "MongoDB has no products yet, so demo phones are shown for layout visualization." : error || "Backend data is unavailable, so demo phones are shown for layout visualization."}</span>
    </section>
  );
}

function PromiseBand() {
  return (
    <section className="promise">
      <div>
        <h2>Simple phone buying, no noise.</h2>
        <p>Choose a model, open WhatsApp, and confirm stock, battery health, condition photos, and payment directly.</p>
        <strong>{STORE_NAME} direct support</strong>
      </div>
      <ul>
        {["Real stock first", "Clean product specs", "WhatsApp enquiry", "Condition confirmed before payment"].map((item) => <li key={item}><CheckCircle size={18} /> {item}</li>)}
      </ul>
    </section>
  );
}

function CollectionPage({ setRoute, products }) {
  const [active, setActive] = useState("All");
  const brandOptions = useMemo(() => ["All", ...getBrands(products)], [products]);
  const list = useMemo(() => products.filter((product) => matchesBrand(product, active)), [active, products]);
  const heroProduct = products[0];
  return (
    <>
      <section className="collectionHero dodoHero">
        <div>
          <h1>{STORE_NAME} <span>Phones</span></h1>
          <strong>iPhone, Samsung, Pixel</strong><b>|</b><strong>WhatsApp support</strong><b>|</b><strong>{DISPLAY_PHONE}</strong>
        </div>
        <div className="heroTrust">{products.length} backend listings <Star weight="fill" /> Fast replies</div>
        {heroProduct?.[3] && <img src={imageSrc(heroProduct[3])} alt="" />}
      </section>
      <main className="collectionLayout">
        <section className="collectionProducts">
          <div className="brandRow">
            {brandOptions.map((brand) => <button className={active === brand ? "active" : ""} onClick={() => setActive(brand)} key={brand}>{brand}</button>)}
          </div>
          <div className="productGrid">
            {list.map((p, i) => <ProductCard product={p} key={`${p[5] || p[0]}-${i}`} onView={() => setRoute("product")} />)}
            {list.length === 0 && <div className="emptyCollection"><h3>No matching backend products</h3><p>Add stock in admin or choose another brand.</p></div>}
          </div>
        </section>
      </main>
      <PromiseBand />
      <InfoCopy />
    </>
  );
}

function ProductPage({ products }) {
  const p = products[0];
  if (!p) {
    return (
      <main className="simplePage">
        <h1>No product selected</h1>
        <p>No backend product is available yet. Add a real phone in admin to populate this page.</p>
      </main>
    );
  }
  return (
    <main className="productPage">
      <section className="gallery">
        {p[3] ? <img src={imageSrc(p[3])} alt={p[0]} /> : <span className="imageMissing large">No image</span>}
        <div>{[p[3]].filter(Boolean).map((img) => <button key={img}><img src={imageSrc(img)} alt="" /></button>)}</div>
      </section>
      <section className="purchase">
        <p className="crumb">Home / Phones / {STORE_NAME}</p>
        <h1>{p[0]}</h1>
        <p>{p[1]}</p>
        <div className="rating">Condition and availability confirmed on WhatsApp</div>
        <h2>{currency(p[2])}</h2>
        <div className="optionGroup"><b>Backend specs</b><button>{p[1]}</button><button>{productBrand(p)}</button></div>
        <a className="primary wide whatsappCta" href={whatsappUrl(p)} target="_blank" rel="noreferrer"><WhatsappLogo size={20} weight="fill" /> Chat on WhatsApp</a>
        <PromiseBand />
      </section>
    </main>
  );
}

function SimplePage({ kind, products }) {
  const featured = products[0];
  const copy = {
    help: ["Help Center", `Ask ${STORE_NAME} about stock, battery health, delivery, collection, and payment on WhatsApp.`],
    deals: ["Phone Deals", "Only iPhones, Samsung Galaxy, and Google Pixel. Tap any WhatsApp button to send the phone details."],
    sell: [`WhatsApp ${STORE_NAME}`, `Send the phone model you want and we will reply from ${DISPLAY_PHONE}.`],
  }[kind] || [`About ${STORE_NAME}`, "A phone shop for iPhone, Samsung Galaxy, and Google Pixel with simple listings and direct WhatsApp enquiries."];
  return (
    <main className="simplePage">
      <h1>{copy[0]}</h1>
      <p>{copy[1]}</p>
      <div className="supportGrid">
        {["Check availability", "Ask for photos", "Confirm battery health", "Chat on WhatsApp"].map((item) => <a key={item} href={whatsappUrl(featured)} target="_blank" rel="noreferrer">{item}<CaretRight /></a>)}
      </div>
      <PromiseBand />
    </main>
  );
}

function InfoCopy() {
  return (
    <section className="infoCopy">
      <h2>Explore {STORE_NAME} Phone Deals</h2>
      <p>{STORE_NAME} focuses on iPhones, Samsung Galaxy, and Google Pixel phones, making it easier to compare model, storage, color, condition, and price without unrelated products.</p>
      <p>When a client likes a phone, the WhatsApp button opens a chat with the phone name, simple specs, and listed price already prepared.</p>
    </section>
  );
}

function Footer({ products }) {
  const featured = products[0];
  return (
    <footer className="footer">
      <div><h3>{STORE_NAME}</h3><a>iPhone, Samsung, Pixel</a><a>Customer support</a><a>WhatsApp {DISPLAY_PHONE}</a><a href={`https://instagram.com/${INSTAGRAM}`} target="_blank" rel="noreferrer">Instagram @{INSTAGRAM}</a></div>
      <div><h3>SHOP</h3><a>All phones</a><a>Deals</a><a>Warranty</a><a>Admin</a></div>
      <div><h3>CONTACT</h3><a>Battery health</a><a>Condition photos</a><a>Availability</a><a className="footerWhatsapp" href={whatsappUrl(featured)} target="_blank" rel="noreferrer">CONTACT ON WHATSAPP</a></div>
    </footer>
  );
}

function AdminLogin({ configured, onLogin }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin-auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Admin login failed.");
      return;
    }
    onLogin();
  };

  return (
    <main className="adminPage">
      <section className="adminHero loginHero">
        <div>
          <p className="heroBrand">{STORE_NAME} ADMIN</p>
          <h1>Admin login required</h1>
          <p>Product uploads and removals are protected by a server-side admin session.</p>
        </div>
      </section>
      <form className="loginCard" onSubmit={submit}>
        {!configured && <p className="formError">Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in the environment first.</p>}
        <label>
          Username
          <input value={credentials.username} onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))} autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} autoComplete="current-password" />
        </label>
        {error && <p className="formError">{error}</p>}
        <button className="primary wide" type="submit" disabled={!configured}>Log in</button>
      </form>
    </main>
  );
}

function AdminPanel({ adminProducts, addAdminProduct, updateAdminProduct, removeAdminProduct, setRoute, onLogout }) {
  const emptyDraft = {
    id: "",
    name: "",
    brand: "iPhone",
    specs: "",
    price: "",
    imageFile: null,
    imagePreview: "",
    existingImage: "",
    tag: "New Stock",
    featured: false,
  };
  const [draft, setDraft] = useState(emptyDraft);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [brandSearch, setBrandSearch] = useState(emptyDraft.brand);
  const [error, setError] = useState("");
  const brandOptions = useMemo(() => [...new Set([...BASE_BRANDS, ...adminProducts.map(productBrand).filter(Boolean)])].sort(), [adminProducts]);
  const filteredBrands = brandOptions.filter((brand) => brand.toLowerCase().includes(brandSearch.toLowerCase()));
  const imagePreview = draft.imagePreview || draft.existingImage;

  const update = (field, value) => setDraft((current) => ({ ...current, [field]: value }));
  const openAdd = () => {
    setMode("add");
    setDraft(emptyDraft);
    setBrandSearch(emptyDraft.brand);
    setError("");
    setPanelOpen(true);
  };
  const openEdit = (product) => {
    setMode("edit");
    setDraft({
      id: product[5],
      name: product[0],
      brand: productBrand(product),
      specs: product[1],
      price: String(product[2]),
      imageFile: null,
      imagePreview: "",
      existingImage: product[3],
      tag: product[4],
      featured: isFeatured(product),
    });
    setBrandSearch(productBrand(product));
    setError("");
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    setError("");
    setDraft(emptyDraft);
  };
  const updateImage = (file) => {
    setDraft((current) => ({
      ...current,
      imageFile: file,
      imagePreview: file ? URL.createObjectURL(file) : "",
    }));
  };
  const chooseBrand = (brand) => {
    setBrandSearch(brand);
    update("brand", brand);
  };
  const submit = async (event) => {
    event.preventDefault();
    const price = Number(String(draft.price).replaceAll(",", ""));
    if (!draft.name.trim()) {
      setError("Add or select the phone model.");
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
    if (mode === "add" && !draft.imageFile) {
      setError("Choose a phone image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", draft.name.trim());
      formData.append("brand", draft.brand);
      formData.append("specs", draft.specs.trim());
      formData.append("price", String(price));
      formData.append("tag", draft.tag.trim() || draft.brand);
      formData.append("featured", String(draft.featured));
      if (draft.imageFile) formData.append("image", draft.imageFile);

      if (mode === "edit") {
        await updateAdminProduct(draft.id, formData);
      } else {
        await addAdminProduct(formData);
      }
      closePanel();
    } catch {
      setError(mode === "edit" ? "The backend could not update this phone. Try again." : "The backend could not save this phone. Try again.");
    }
  };

  return (
    <main className="adminPage">
      <section className="adminHero">
        <div>
          <p className="heroBrand">{STORE_NAME} ADMIN</p>
          <h1>Inventory control</h1>
          <p>Manage phone stock, featured homepage banners, Cloudinary images, prices, and product details.</p>
        </div>
        <div className="adminHeroActions">
          <button className="primary" onClick={openAdd}><Plus size={18} /> Add phone</button>
          <button className="secondary" onClick={() => setRoute("home")}>View shop</button>
          <button className="secondary" onClick={onLogout}>Log out</button>
        </div>
      </section>

      <section className="adminInventory">
        <div className="sectionHead">
          <h2>Inventory list</h2>
          <span>{adminProducts.length} saved in MongoDB</span>
        </div>
        {adminProducts.length === 0 ? (
          <div className="emptyInventory">
            <h3>No phones yet</h3>
            <p>Add the first phone to populate the storefront.</p>
            <button className="primary" onClick={openAdd}>Add phone</button>
          </div>
        ) : (
          <div className="adminList">
            {adminProducts.map((product, index) => (
              <article className="adminRow" key={`${product[5] || product[0]}-${index}`}>
                <img src={imageSrc(product[3])} alt="" />
                <div>
                  <strong>{product[0]}</strong>
                  <small>{product[1]}</small>
                  <b>{currency(product[2])}</b>
                </div>
                {isFeatured(product) && <span className="featuredPill">Featured</span>}
                <button onClick={() => openEdit(product)}>Edit</button>
                <a href={whatsappUrl(product)} target="_blank" rel="noreferrer">WhatsApp</a>
                <button className="dangerButton" onClick={() => removeAdminProduct(product[5]).catch(() => setError("The backend could not remove this phone. Try again."))}>Remove</button>
              </article>
            ))}
          </div>
        )}
      </section>

      {panelOpen && (
        <aside className="adminEditorOverlay">
          <form className="adminEditor" onSubmit={submit}>
            <div className="adminEditorHead">
              <div>
                <p className="heroBrand">{mode === "edit" ? "EDIT PHONE" : "ADD PHONE"}</p>
                <h2>{mode === "edit" ? "Update listing" : "New listing"}</h2>
              </div>
              <button className="close" type="button" onClick={closePanel} aria-label="Close editor"><X size={18} /></button>
            </div>

            <div className="adminEditorGrid">
              <section className="adminForm">
                <label>
                  Model
                  <input value={draft.name} onChange={(event) => update("name", event.target.value)} placeholder="iPhone 15 Pro Max" />
                </label>
                <label className="brandSelect">
                  Brand
                  <input value={brandSearch} onChange={(event) => { setBrandSearch(event.target.value); update("brand", event.target.value); }} placeholder="Search brand" />
                  {filteredBrands.length > 0 && (
                    <div className="brandOptions">
                      {filteredBrands.map((brand) => <button type="button" key={brand} onClick={() => chooseBrand(brand)}>{brand}</button>)}
                    </div>
                  )}
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
                  Badge
                  <input value={draft.tag} onChange={(event) => update("tag", event.target.value)} placeholder="New Stock" />
                </label>
                <label className="featureToggle">
                  <input type="checkbox" checked={draft.featured} onChange={(event) => update("featured", event.target.checked)} />
                  <span>Feature this phone on the homepage banner</span>
                </label>
                <label className="imagePicker">
                  <input type="file" accept="image/*" onChange={(event) => updateImage(event.target.files?.[0] || null)} />
                  <span>
                    <strong>{draft.imageFile ? draft.imageFile.name : imagePreview ? "Change image" : "Choose product image"}</strong>
                    <small>PNG, JPG, or WebP. Stored through Cloudinary.</small>
                  </span>
                </label>
                {error && <p className="formError">{error}</p>}
                <div className="adminEditorActions">
                  <button className="secondary" type="button" onClick={closePanel}>Cancel</button>
                  <button className="primary" type="submit">{mode === "edit" ? "Save changes" : "Add phone"}</button>
                </div>
              </section>

              <aside className="adminPreview">
                <h3>Live preview</h3>
                <ProductCard
                  product={[
                    draft.name || "Phone model",
                    draft.specs || "Storage, color, SIM status",
                    Number(draft.price) || 0,
                    imagePreview,
                    draft.tag || "New Stock",
                    draft.id || "preview",
                    "preview",
                    draft.brand,
                    draft.featured,
                  ]}
                  onView={() => {}}
                />
              </aside>
            </div>
          </form>
        </aside>
      )}
    </main>
  );
}

export function App() {
  const [route, setRoute] = useState("home");
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [databaseReady, setDatabaseReady] = useState(true);
  const [backendError, setBackendError] = useState("");
  const [adminSession, setAdminSession] = useState({ authenticated: false, configured: true, checked: false });
  const demoMode = catalogProducts.length === 0;
  const allProducts = useMemo(() => catalogProducts.length > 0 ? catalogProducts : DEMO_PRODUCTS, [catalogProducts]);

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        setCatalogProducts(Array.isArray(data.products) ? data.products : []);
        setAdminProducts(Array.isArray(data.adminProducts) ? data.adminProducts : []);
        setDatabaseReady(Boolean(data.databaseReady));
        setBackendError(data.error || "");
      })
      .catch(() => {
        if (!active) return;
        setCatalogProducts([]);
        setAdminProducts([]);
        setDatabaseReady(false);
        setBackendError("The products API did not respond.");
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshAdminSession = async () => {
    const response = await fetch("/api/admin-auth/session");
    const data = await response.json();
    setAdminSession({ authenticated: Boolean(data.authenticated), configured: Boolean(data.configured), checked: true });
  };

  useEffect(() => {
    refreshAdminSession().catch(() => setAdminSession({ authenticated: false, configured: false, checked: true }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const addAdminProduct = async (formData) => {
    const response = await fetch("/api/admin-products", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Unable to add phone.");
    const data = await response.json();
    setAdminProducts(Array.isArray(data.adminProducts) ? data.adminProducts : []);
    setCatalogProducts(Array.isArray(data.products) ? data.products : []);
  };
  const updateAdminProduct = async (id, formData) => {
    const response = await fetch(`/api/admin-products?id=${encodeURIComponent(id)}`, {
      method: "PUT",
      body: formData,
    });
    if (!response.ok) throw new Error("Unable to update phone.");
    const data = await response.json();
    setAdminProducts(Array.isArray(data.adminProducts) ? data.adminProducts : []);
    setCatalogProducts(Array.isArray(data.products) ? data.products : []);
  };
  const removeAdminProduct = async (id) => {
    const response = await fetch(`/api/admin-products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Unable to remove phone.");
    const data = await response.json();
    setAdminProducts(Array.isArray(data.adminProducts) ? data.adminProducts : []);
    setCatalogProducts(Array.isArray(data.products) ? data.products : []);
  };
  const logoutAdmin = async () => {
    await fetch("/api/admin-auth/logout", { method: "POST" });
    setAdminSession((current) => ({ ...current, authenticated: false }));
    setRoute("home");
  };
  const page = route === "collection"
    ? <CollectionPage setRoute={setRoute} products={allProducts} />
    : route === "product"
      ? <ProductPage products={allProducts} />
      : route === "admin"
        ? adminSession.authenticated
          ? <AdminPanel adminProducts={adminProducts} addAdminProduct={addAdminProduct} updateAdminProduct={updateAdminProduct} removeAdminProduct={removeAdminProduct} setRoute={setRoute} onLogout={logoutAdmin} />
          : <AdminLogin configured={adminSession.configured} onLogin={refreshAdminSession} />
        : route === "home"
          ? <HomePage setRoute={setRoute} products={allProducts} databaseReady={databaseReady} backendError={backendError} demoMode={demoMode} />
          : <SimplePage kind={route} products={allProducts} />;
  return (
    <>
      <Header setRoute={setRoute} products={allProducts} />
      {page}
      <Footer products={allProducts} />
    </>
  );
}
