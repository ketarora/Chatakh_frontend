import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import { getImageUrl } from "../utils/image";
import { useReveal, useTilt } from "../hooks/useReveal";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";
import { GridSkeleton } from "../components/Loader";

const FALLBACK_IMGS = ["/demo-1.jpg", "/demo-2.jpg", "/demo-3.jpg", "/demo-4.jpg", "/demo-5.jpg", "/demo-6.jpg"];

/* ---------------- HERO: split layout — text can NEVER cover faces ---------------- */
const Hero = () => {
  const photoRef = useRef(null);

  useEffect(() => {
    // rAF-throttled parallax: writes straight to the DOM, zero re-renders.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (photoRef.current) {
          photoRef.current.style.transform = `translateY(${window.scrollY * 0.12}px) scale(1.1)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero-split">
      <div className="hs-text">
        <p className="hero-kicker"><i /> run by 3 friends who agree on nothing — except good clothes</p>
        <h1 className="hs-title">
          <span className="line">BORN TO</span>
          <span className="line pink">STAND OUT<span className="bang">!!</span></span>
        </h1>
        <p className="hs-sub">Festive fashion that moves with you — twirl-tested lehengas, co-ords & statements in full Chatakh colour.</p>
        <div className="hero-ctas">
          <Link to="/collections" className="btn-primary">Explore the Edit <span>→</span></Link>
          <Link to="/navratri" className="btn-outline">Navratri Edit ❀</Link>
        </div>
        <div className="hs-meta">
          <span>✦ 4.9 loved by 2k+ shoppers</span>
          <span>✦ Ships across India</span>
        </div>
      </div>

      <div className="hs-photo">
        <div ref={photoRef} className="hs-photo-inner" style={{ transform: "scale(1.1)" }}>
          <img src="/hero-twirl.jpg" alt="Chatakh festive model twirling" loading="eager" decoding="async" onError={(e) => { const el = e.currentTarget; el.onerror = null; el.src = "/demo-1.jpg"; el.onerror = () => { el.src = "/COVER_.png"; }; }} />
        </div>

        <span className="hero-sticker s1">✦ new drop</span>
        <span className="hero-sticker s2">Navratri Edit ❀</span>

        {/* The trio — overlapping the split, deliberately crooked */}
        <a href="#about" className="hero-trio" aria-label="Meet the founders">
          <img
            src="/owners-trio.jpg"
            alt="The three friends behind Chatakh"
            loading="eager"
            decoding="async"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/IMG_8301.png"; }}
          />
          <span className="hero-trio-cap">us, prolly arguing about whose idea's better ↓</span>
          <span className="tape t1" />
        </a>

        <a href="#featured" className="scroll-cue" aria-label="Scroll down">
          <b /><small>scroll</small>
        </a>
      </div>
    </section>
  );
};

/* ---------------- FEATURED: image-changing animation ---------------- */
const Featured = ({ products, onQuickView }) => {
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, visible] = useReveal();
  const list = products.length ? products : FALLBACK_IMGS.map((src, i) => ({ _id: `fb-${i}`, name: `Chatakh Muse ${i + 1}`, price: 1499 + i * 200, category: "Featured", images: [src], description: "Festive statement from the house of Chatakh." }));

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setTick((v) => v + 1), 2800);
    return () => clearInterval(t);
  }, [paused]);

  // rotate: 3 visible, offset shifts each tick
  const visible3 = [0, 1, 2].map((k) => list[(tick + k) % list.length]);
  const activeName = list[tick % list.length]?.name || "Featured";
  const dotCount = Math.min(6, list.length);

  return (
    <section id="featured" ref={ref} className={`section featured reveal ${visible ? "revealed" : ""}`}>
      <div className="sec-head">
        <p className="eyebrow">✦ Fresh off the karigar's table</p>
        <h2>Featured <em>Collection</em></h2>
        <p className="sec-sub">Watch it change — a living window into what's hot right now.</p>
      </div>

      <div
        className="feat-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {visible3.map((p, i) => (
          <div
            key={`${p._id}-${i}`}
            className={`feat-card pos-${i}`}
            role="button"
            tabIndex={0}
            aria-label={`Quick view ${p.name}`}
            onClick={() => onQuickView?.(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onQuickView?.(p); } }}
          >
            <img src={getImageUrl(p.images?.[0])} alt={p.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
            <span className="feat-num">0{i + 1}</span>
            <div className="feat-cap">
              <b>{p.name}</b>
              <span>₹{p.price}</span>
            </div>
          </div>
        ))}
        <div className="feat-dots" role="tablist" aria-label="Featured looks">
          {list.slice(0, dotCount).map((p, i) => (
            <button
              key={p._id}
              role="tab"
              aria-selected={i === tick % dotCount}
              aria-label={`Show ${p.name}`}
              className={i === tick % dotCount ? "on" : ""}
              onClick={() => setTick(i)}
            />
          ))}
        </div>
      </div>

      <div className="feat-pill-row">
        <Link to="/collections/colors-of-aura" className="feat-pill">{activeName} →</Link>
      </div>
    </section>
  );
};

/* ---------------- COLORS OF AURA banner ---------------- */
const AuraBanner = () => {
  const [ref, visible] = useReveal();
  const tilt = useTilt(9);
  return (
    <section ref={ref} className={`section aura reveal ${visible ? "revealed" : ""}`}>
      <div className="aura-grid">
        <div className="aura-copy">
          <p className="eyebrow">❀ The festive headline</p>
          <h2>The Colors <em>of Aura</em></h2>
          <p className="aura-tag">Festive palettes, nine moods, infinite twirls.</p>
          <div className="aura-swatches">
            {["#ec0080", "#ff5da2", "#ffb300", "#00aeb2", "#7c3aed", "#16a34a", "#f97316", "#eab308", "#ef4444"].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </div>
          <Link to="/collections/colors-of-aura" className="btn-primary">View more <span>→</span></Link>
        </div>
        <div ref={tilt} className="aura-media tilt">
          <img src="/colors of aura.png" alt="The Colors of Aura" onError={(e) => { e.currentTarget.src = "/img2.jpeg"; }} />
          <span className="aura-badge">❀ twirl tested</span>
        </div>
      </div>
    </section>
  );
};

/* ---------------- THREE FRIENDS story + 3D ---------------- */
// The trio group photo (public/owners-trio.jpg, compressed from IMG_8301.png).
// To swap it later, just replace that one file — no code change needed.
const TRIO = { src: "/owners-trio.jpg", fallback: "/IMG_8301.png", last: "/img1.jpeg" };

const trioImg = (cls) => (
  <img
    className={cls}
    src={TRIO.src}
    alt="The three friends behind Chatakh"
    loading="lazy"
    decoding="async"
    onError={(e) => {
      const el = e.currentTarget;
      el.onerror = null;
      el.src = TRIO.fallback;
      el.onerror = () => { el.src = TRIO.last; };
    }}
  />
);

const Story = () => {
  const [ref, visible] = useReveal();
  const tilt = useTilt(12);
  return (
    <section id="about" ref={ref} className={`section story reveal ${visible ? "revealed" : ""}`}>
      <div className="story-grid">
        <div className="story-copy">
          <p className="eyebrow">✦ Our origin story</p>
          <h2>Three Friends,<br /><em>One Little Dream</em></h2>
          <p>Three personalities, three very different ways of seeing the world — and somehow, all making sense in one place. One is calm, one is chaotic, one is probably changing the plan five minutes before it happens.</p>
          <p>But somewhere between the disagreements, the laughs, the random ideas, and the "wait, what if we did this?" moments — <b>Chatakh was born</b>.</p>
          <p className="dim">It's a space for everything we love — fashion, creativity, culture, colour, self-expression and all the wonderfully random things in between. We make, experiment, mess up, start again, and turn our differences into something unmistakably Chatakh.</p>
          <div className="story-friends">
            <span className="friend f1">☾ the calm one</span>
            <span className="friend f2">✸ the chaotic one</span>
            <span className="friend f3">❀ the plan-changer</span>
          </div>
        </div>
        <div ref={tilt} className="trio-frame tilt">
          {trioImg()}
          <p className="trio-cap">us, prolly arguing about whose idea's better</p>
          <span className="tape t1" /><span className="tape t2" />
          <span className="trio-doodle">↩ real humans, promise</span>
          <span className="story-badge">✦ the humans behind the chaos</span>
        </div>
      </div>
    </section>
  );
};

/* ---------------- INSTAGRAM marquee ---------------- */
const Insta = () => (
  <section className="section insta">
    <div className="sec-head">
      <p className="eyebrow light">◍ @chatakh_ on Instagram</p>
      <h2 className="light">Come say hi, <em>stay for the BTS</em></h2>
    </div>
    <div className="marquee">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="marquee-set" aria-hidden={k === 1}>
            {[...Array(10)].map((_, i) => (
              <a key={i} href="https://www.instagram.com/chatakh_" target={k === 0 ? "_blank" : undefined} rel="noreferrer" tabIndex={k === 1 ? -1 : undefined} className="insta-tile">
                <img src={`/bts-${i + 1}.jpg`} alt={`Chatakh BTS ${i + 1}`} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `/demo-${(i % 6) + 1}.jpg`; }} />
                <span>◍ BTS Diaries</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
    <a className="btn-light" href="https://www.instagram.com/chatakh_" target="_blank" rel="noreferrer">Follow @chatakh_ ◍</a>
  </section>
);

/* ---------------- SHOP BY CATEGORY: colour-changing ---------------- */
const CATS = [
  { value: "men", label: "Men", note: "Bandhgalas to breezy kurtas", img: "/cat-men.jpg", fallback: "/demo-2.jpg", pos: "50% 18%", to: "/collections?category=men", c: "#00aeb2" },
  { value: "women", label: "Women", note: "Lehengas, co-ords & more", img: "/cat-women.jpg", fallback: "/demo-5.jpg", pos: "50% 10%", to: "/collections?category=women", c: "#ec0080" },
  { value: "couple", label: "Couple", note: "Matchy-matchy, but make it fashion", img: "/cat-couple.jpg", fallback: "/demo-1.jpg", pos: "50% 8%", to: "/collections?category=couple", c: "#ffb300" },
  { value: "accessories", label: "Accessories", note: "The cherry on top", img: "/cat-acc.jpg", fallback: "/img2.jpeg", pos: "62% 42%", to: "/collections?category=accessories", c: "#7c3aed" },
];

const ShopByCat = () => {
  const [ref, visible] = useReveal();

  // Direct DOM writes — buttery blush with zero re-renders.
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };
  const setGlow = (c) => ref.current?.style.setProperty("--mc", c);

  return (
    <section
      ref={ref}
      className={`section cats reveal ${visible ? "revealed" : ""}`}
      onMouseMove={onMove}
    >
      <div className="sec-head">
        <p className="eyebrow">✦ Pick your player</p>
        <h2>Shop by <em>Category</em></h2>
        <p className="sec-sub">Move your cursor around — this section blushes with you.</p>
      </div>
      <div className="cat-grid">
        {CATS.map((c) => (
          <Link key={c.value} to={c.to} className="cat-card" onMouseEnter={() => setGlow(c.c)}>
            <div className="cat-media"><img src={c.img} alt={c.label} loading="lazy" style={{ objectPosition: c.pos }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = c.fallback; }} /></div>
            <div className="cat-info">
              <h3>{c.label}</h3>
              <p>{c.note}</p>
              <span style={{ "--cc": c.c }} className="cat-go">Shop {c.label} →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ---------------- PINTEREST WALL ---------------- */
const Wall = ({ products, onQuickView }) => {
  const [ref, visible] = useReveal({ threshold: 0.05 });
  const items = useMemo(() => {
    if (products.length > 6) return products.slice(4);
    return FALLBACK_IMGS.concat(FALLBACK_IMGS).map((src, i) => ({ _id: `w-${i}`, name: `Muse Diaries ${i + 1}`, price: 1299 + i * 150, category: "Muses", images: [src], description: "Saved from the Chatakh moodboard." }));
  }, [products]);

  return (
    <section ref={ref} className={`section wall reveal ${visible ? "revealed" : ""}`}>
      <div className="sec-head">
        <p className="eyebrow">℘ The Chatakh Wall</p>
        <h2>Pin your <em>favourites</em></h2>
        <p className="sec-sub">A Pinterest-style moodboard — hover any tile to save it or peek inside. It loads in a staggered cascade, just like your favourite app.</p>
      </div>
      <div className="masonry">
        {items.map((p, i) => (
          <div key={p._id + i} className="masonry-item" style={{ "--d": `${(i % 10) * 70}ms` }}>
            <ProductCard product={p} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------------- EXPLORE THE HOUSE: four collections, jharokha arches ---------------- */
const HOUSE = [
  { name: "The Threads of Aura", tag: "Collection", img: "/house-threads.jpg", fallback: "/threads of aura.png", to: "/collections/threads-of-aura" },
  { name: "The Colors of Aura", tag: "Collection", img: "/house-colors.png", fallback: "/colors of aura.png", to: "/collections/colors-of-aura" },
  { name: "Accessories", tag: "Accessories", img: "/house-acc.jpg", fallback: "/cat-acc.jpg", to: "/collections/accessories" },
  { name: "Bandhej - The Sheer Edit", tag: "New Launch 🎉", img: "/house-bandhej.jpg", fallback: "/img3.jpeg", to: "/collections/bandhani" },
];

const ExploreHouse = () => {
  const [ref, visible] = useReveal();
  return (
    <section ref={ref} className={`section house reveal ${visible ? "revealed" : ""}`}>
      <div className="sec-head">
        <p className="eyebrow">✦ teeno apni jagah</p>
        <h2>Explore the <em>House</em></h2>
      </div>
      <div className="arch-row">
        {HOUSE.map((c, i) => (
          <Link key={c.name} to={c.to} className={`arch arch-${i}`}>
            <span className="arch-frame">
              <img src={c.img} alt={c.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = c.fallback || "/img2.jpeg"; }} />
              <span className="arch-scrim" />
              <span className="coll-badge">{c.tag}</span>
            </span>
            <span className="arch-cap">
              <small>0{i + 1}</small>
              <b>{c.name}</b>
              <em>Explore →</em>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ---------------- PAGE ---------------- */
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickView, setQuickView] = useState(null);

  useEffect(() => {
    let alive = true;
    // Fetch BIG limit so ALL products show up across sections (owner complaint).
    api.get("/api/products?limit=60")
      .then((res) => { if (alive) setProducts(Array.isArray(res.data) ? res.data : []); })
      .catch(() => { if (alive) setProducts([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const featured = useMemo(() => {
    // Navratri focus: show Colors of Aura the moment it has products,
    // otherwise Threads picks (backend-driven in both cases).
    const colors = products.filter((p) => (p.mainCollection || "").toLowerCase() === "colors-of-aura");
    return colors.length ? colors.slice(0, 8) : products.slice(0, 8);
  }, [products]);

  return (
    <div className="home">
      <Hero />

      {loading ? (
        <section className="section"><GridSkeleton count={4} /></section>
      ) : (
        <Featured products={featured} onQuickView={setQuickView} />
      )}

      <AuraBanner />
      <Story />
      <Insta />
      <ShopByCat />

      {/* Explore the house: all three, equal cards */}
      <ExploreHouse />

      {loading ? (
        <section className="section"><GridSkeleton count={8} /></section>
      ) : (
        <Wall products={products} onQuickView={setQuickView} />
      )}

      <section className="section promise">
        <div className="promise-band">
          <p className="eyebrow light">✦ the fine print, but fun</p>
          <h2>Good fabric. Fast ship.<br /><em>No drama.</em></h2>
          <div className="promise-row">
            <div className="promise-item">
              <span className="p-num">01</span>
              <h3>Fabric first</h3>
              <p>Every metre touched by us before it touches you — khadi, cottons & blends built for Indian summers and 50+ washes.</p>
            </div>
            <div className="promise-item">
              <span className="p-num">02</span>
              <h3>Ships in 24–48 hrs</h3>
              <p>Dispatched fast, tracked door-to-door across India. No "where is my order??" anxiety at 2am.</p>
            </div>
            <div className="promise-item">
              <span className="p-num">03</span>
              <h3>Exchanges, minus tears</h3>
              <p>Wrong size? Real humans, easy swaps, secure payments. Write to us — we actually reply.</p>
            </div>
          </div>
          <span className="promise-sticker">♥ packed with pyaar</span>
          <Link to="/collections" className="btn-big light">Start Shopping →</Link>
        </div>
      </section>

      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
};

export default Home;
