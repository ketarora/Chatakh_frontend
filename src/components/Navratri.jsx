import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Sharad Navratri 2026 · 11–19 Oct. Dates drive the countdown only —
// this page sells the whole wardrobe, never day-wise.
export const FEST_START = new Date("2026-10-11T00:00:00+05:30").getTime();
export const FEST_END = new Date("2026-10-20T00:00:00+05:30").getTime();

export const NIGHTS = [
  { day: 1, colour: "Orange", hex: "#F97316", keys: ["orange", "kesar", "saffron"] },
  { day: 2, colour: "White", hex: "#EDE6D6", keys: ["white", "ivory"] },
  { day: 3, colour: "Red", hex: "#DC2626", keys: ["red", "maroon", "laal"] },
  { day: 4, colour: "Royal Blue", hex: "#1D4ED8", keys: ["blue", "neel", "navy", "royal"] },
  { day: 5, colour: "Yellow", hex: "#FACC15", keys: ["yellow", "haldi", "peela", "mustard"] },
  { day: 6, colour: "Green", hex: "#16A34A", keys: ["green", "hara"] },
  { day: 7, colour: "Grey", hex: "#6B7280", keys: ["grey", "gray", "silver"] },
  { day: 8, colour: "Purple", hex: "#7C3AED", keys: ["purple", "jamuni", "violet"] },
  { day: 9, colour: "Peacock Green", hex: "#0D9488", keys: ["peacock", "mor", "teal"] },
];

// Search that understands colour: "red" also finds maroon/laal, "peacock" finds teal…
// Every typed word must match (with its colour family) — precision AND recall.
export const expandQuery = (q) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return words.map((w) => {
    for (const n of NIGHTS) {
      const family = [n.colour.toLowerCase(), ...n.keys];
      if (family.includes(w)) return family;
    }
    return [w];
  });
};

// Which night is it RIGHT NOW? Returns 1–9 during the festival, else null.
export const liveNight = () => {
  const now = Date.now();
  if (now < FEST_START || now >= FEST_END) return null;
  return Math.min(9, Math.floor((now - FEST_START) / 86400000) + 1);
};

/* ---------------- Countdown: one honest strip, lives inside the hero ---------------- */
export const CountdownStrip = ({ onCelebrate }) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now >= FEST_END) return null;
  const ln = liveNight();
  if (ln != null) {
    const n = NIGHTS[ln - 1];
    return (
      <button className="cd-strip live" style={{ "--nc": n.hex }} onClick={onCelebrate}>
        🪔 Night {n.day} is TONIGHT — wear {n.colour} ↓
      </button>
    );
  }
  const diff = Math.max(0, FEST_START - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return (
    <p className="cd-strip">
      🪔 garba starts in <b>{d}d · {h}h · {m}m · {s}s</b> — 11 Oct, ready?
    </p>
  );
};

/* ---------------- DEMO DROP PREVIEW: static looks until backend has them ----------------
   Real products load from the backend only. These six are the upcoming drop —
   preview + pre-book via DM, no prices, no checkout. Delete this block once
   the backend carries Navratri products. */
export const DEMO_DROPS = [
  { _id: "demo-1", name: "Midnight Mirror Couple Set", category: "couple", demo: true, images: ["/demo-1.jpg"], description: "Black-on-black with mirror blooms — his kurta, her lehenga." },
  { _id: "demo-2", name: "Neelkamal Couple Set", category: "couple", demo: true, images: ["/demo-2.jpg"], description: "Indigo bandhej on ivory — garba whites, upgraded." },
  { _id: "demo-3", name: "Jamuni Jodi Set", category: "couple", demo: true, images: ["/demo-3.jpg"], description: "Deep purple bandhani with a flowing white drape." },
  { _id: "demo-4", name: "Mor-Pankh Couple Set", category: "couple", demo: true, images: ["/demo-4.jpg"], description: "Peacock-blue prints on festive white." },
  { _id: "demo-5", name: "Neel Mirror Lehenga", category: "women", demo: true, images: ["/demo-5.jpg"], description: "Indigo choli, mirror tassels, twirl-ready flare." },
  { _id: "demo-6", name: "Teen Deviyan Trio", category: "women", demo: true, images: ["/demo-6.jpg"], description: "One frame, three moods — festive bestsellers." },
];

export const DropPreview = ({ onQuickView }) => (
  <section className="section wall">
    <div className="sec-head">
      <p className="eyebrow">❀ dropping soon</p>
      <h2>The Navratri <em>Drop Preview</em></h2>
      <p className="sec-sub">Six looks, stitched and steamed. Prices reveal at launch — tap to peek, DM to pre-book.</p>
    </div>
    <div className="masonry">
      {DEMO_DROPS.map((p, i) => (
        <div key={p._id} className="masonry-item" style={{ "--d": `${i * 70}ms` }}>
          <article
            className="pin-card"
            role="button"
            tabIndex={0}
            aria-label={`Peek at ${p.name}`}
            onClick={() => onQuickView?.(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onQuickView?.(p); } }}
          >
            <div className="pin-media">
              <img src={p.images[0]} alt={p.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
              <span className="pin-shine" />
              <div className="pin-top">
                <span className="pin-chip">{p.category}</span>
                <span className="pin-save saved" style={{ pointerEvents: "none" }}>❀ Drop soon</span>
              </div>
              <div className="pin-hover">
                <button className="pin-btn ghost" onClick={(e) => { e.stopPropagation(); onQuickView?.(p); }}>👁 Peek</button>
              </div>
            </div>
            <div className="pin-body">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </div>
          </article>
        </div>
      ))}
    </div>
  </section>
);
const Toran = () => (
  <div className="toran" aria-hidden="true">
    <span className="toran-string" />
    {[...Array(26)].map((_, i) => (
      <i key={i} className={`toran-f f${i % 3}`} style={{ "--d": `${(i % 7) * 0.35}s`, "--x": `${(i * 3.85).toFixed(2)}%` }} />
    ))}
  </div>
);

const Diyas = () => (
  <div className="diya-row" aria-hidden="true">
    {[...Array(7)].map((_, i) => (
      <span key={i} className="diya" style={{ "--d": `${(i % 5) * 0.3}s` }}>
        <b className="flame" />
      </span>
    ))}
  </div>
);

/* ---------------- Festive hero. Below it, the page is the normal shop. ---------------- */
const NavratriHero = ({ onCelebrate }) => (
  <div className="nav-hero">
    <Toran />
    <div className="nav-hero-inner">
      <p className="eyebrow light">❀ Sharad Navratri · 11–19 Oct 2026</p>
      <h1>The Colors <em>of Aura</em></h1>
      <p className="nav-sub">Nine nights. Nine colours. One dandiya-ready wardrobe.</p>
      <CountdownStrip onCelebrate={onCelebrate} />
    </div>
    <Diyas />
  </div>
);

/* ---------------- Garba-night closing band: festive frame, shop CTA ---------------- */
export const GarbaBand = ({ onShop }) => (
  <section className="garba-band" aria-label="Garba nights">
    <Toran />
    <p className="eyebrow light">❀ 11–19 Oct · save the dates</p>
    <h2>Dandiya nights are <em>calling</em></h2>
    <p className="garba-sub">Fits, juttis, jhumkas & side-ups — sab kuch, ek jagah. Twirl-tested, garba-approved.</p>
    <div className="garba-ctas">
      <button className="btn-primary" onClick={onShop}>Shop the Edit <span>→</span></button>
      <Link to="/collections/threads-of-aura" className="btn-ghost">Threads of Aura</Link>
    </div>
    <Diyas />
  </section>
);

export default NavratriHero;
