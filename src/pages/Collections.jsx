import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import NavratriHero, { expandQuery, GarbaBand, DropPreview } from "../components/Navratri";
import { GridSkeleton } from "../components/Loader";

const MAIN = [
  { value: "threads-of-aura", name: "The Threads of Aura", img: "/house-threads.jpg", fallback: "/threads of aura.png", tag: "Collection" },
  { value: "colors-of-aura", name: "The Colors of Aura", img: "/house-colors.png", fallback: "/colors of aura.png", tag: "Collection" },
  { value: "accessories", name: "Accessories", img: "/house-acc.jpg", fallback: "/cat-acc.jpg", tag: "Accessories" },
  { value: "bandhani", name: "Bandhej - The Sheer Edit", img: "/house-bandhej.jpg", fallback: "/img3.jpeg", tag: "New Launch 🎉" },
];

const CATS = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "couple", label: "Couple" },
  { value: "accessories", label: "Accessories" },
];

const Collections = () => {
  const { mainCollection } = useParams();
  const location = useLocation();
  // /navratri is its OWN festive page. /collections/colors-of-aura stays a
  // normal backend-driven collection, exactly like threads-of-aura.
  const isNavratriPage = location.pathname.startsWith("/navratri");
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);
  const [sort, setSort] = useState("featured");

  const selected = MAIN.find((c) => c.value === mainCollection);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    // Fetch everything once — then filter client-side so nothing ever "disappears".
    api.get("/api/products?limit=200")
      .then((res) => { if (alive) setAllProducts(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (alive) setAllProducts([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const productsMemo = useMemo(() => {
    let list = [...allProducts];
    let collectionFallback = false;
    if (selected) {
      const inCollection = list.filter((p) => (p.mainCollection || "").toLowerCase() === selected.value);
      // Never show a dead-end: if this collection has no pieces yet, show
      // everything with a note instead of an empty page.
      if (inCollection.length) list = inCollection;
      else collectionFallback = true;
    }
    // Navratri mode sells everything too — no day-wise filtering, ever.
    if (categoryParam === "accessories") {
      const matches = list.filter((p) =>
        `${p.subcategory || ""} ${p.name || ""} ${p.description || ""}`.toLowerCase().includes("accessor")
      );
      // Never show a dead-end: if no accessories exist yet, show everything.
      list = matches.length ? matches : list;
    } else if (categoryParam !== "all") {
      list = list.filter((p) => (p.category || "").toLowerCase() === categoryParam);
    }
    if (searchParam) {
      // Colour-aware search: "red" also matches maroon/laal, "peacock" matches teal…
      // Every typed word must hit (with its colour family) — no loose OR spam.
      const groups = expandQuery(searchParam);
      list = list.filter((p) => {
        const hay = `${p.name} ${p.description} ${p.category} ${p.subcategory || ""}`.toLowerCase();
        return groups.every((family) => family.some((w) => hay.includes(w)));
      });
    }
    return { list, collectionFallback };
  }, [allProducts, selected, categoryParam, searchParam]);

  const sorted = useMemo(() => {
    const arr = [...productsMemo.list];
    if (sort === "price-low") arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price-high") arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sort === "name") arr.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return arr;
  }, [productsMemo.list, sort]);

  const products = sorted;
  const collectionFallback = productsMemo.collectionFallback;

  const setCat = (v) => {
    const next = new URLSearchParams(searchParams);
    if (v === "all") next.delete("category"); else next.set("category", v);
    setSearchParams(next);
  };

  return (
    <div className="collections">
      {isNavratriPage ? (
        <NavratriHero
          onCelebrate={() => document.getElementById("nav-grid")?.scrollIntoView({ behavior: "smooth" })}
        />
      ) : (
        <div className="coll-hero">
          <p className="eyebrow light">{selected ? "✦ Signature edit" : "✦ The full wardrobe"}</p>
          <h1>{selected ? selected.name : "Collections"}</h1>
          <p>{allProducts.length} pieces · {searchParam ? `matching “${searchParam}”` : "handcrafted & ready to ship"}</p>
        </div>
      )}

      {isNavratriPage && <DropPreview onQuickView={setQuickView} />}

      {!selected && !isNavratriPage && (
        <div className="coll-cards">
          {MAIN.map((c) => (
            <Link key={c.value} to={c.to || `/collections/${c.value}`} className="coll-card">
              <img src={c.img} alt={c.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = c.fallback || "/img2.jpeg"; }} />
              <span className="coll-badge">{c.tag}</span>
              <div className="coll-card-cap"><b>{c.name}</b><span>Explore →</span></div>
            </Link>
          ))}
        </div>
      )}

      <div className="coll-filters">
        {CATS.map((c) => (
          <button key={c.value} className={categoryParam === c.value || (c.value === "all" && !searchParams.get("category")) ? "on" : ""} onClick={() => setCat(c.value)}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="coll-tools">
        <p className="coll-count">{!loading && `${products.length} piece${products.length === 1 ? "" : "s"}`}</p>
        <label className="sort-wrap">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="featured">Featured</option>
            <option value="price-low">Price: low → high</option>
            <option value="price-high">Price: high → low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      {selected && (
        <Link to="/collections" className="back-link">← Back to Collections</Link>
      )}

      {!loading && collectionFallback && products.length > 0 && (
        <p className="fallback-note">❀ Fresh pieces for <b>{selected?.name}</b> are being stitched — meanwhile, here's everything we have →</p>
      )}

      {loading ? (
        <div className="section"><GridSkeleton count={8} /></div>
      ) : products.length === 0 ? (
        <div className="empty-box">
          <p className="empty-face">(◕‿◕)</p>
          <h3>Nothing here yet…</h3>
          <p>Try a different category — or be the first to ask for it on Instagram.</p>
          <Link to="/collections" className="btn-primary">See everything →</Link>
        </div>
      ) : (
        <div className="masonry pad" id="nav-grid">
          {products.map((p, i) => (
            <div key={p._id + i} className="masonry-item" style={{ "--d": `${(i % 10) * 60}ms` }}>
              <ProductCard product={p} onQuickView={setQuickView} />
            </div>
          ))}
        </div>
      )}

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}

      {isNavratriPage && !loading && products.length > 0 && (
        <GarbaBand onShop={() => document.getElementById("nav-grid")?.scrollIntoView({ behavior: "smooth" })} />
      )}
    </div>
  );
};

export default Collections;
