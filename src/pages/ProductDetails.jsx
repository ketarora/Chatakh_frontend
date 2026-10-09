import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../utils/image";
import { PageLoader } from "../components/Loader";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [pin, setPin] = useState("");
  const [pinEta, setPinEta] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setProduct(null);
    setImgIdx(0);
    setQty(1);
    api.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setFailed(true));
  }, [id]);

  if (failed) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">(◕︵◕)</p>
          <h3>This look wouldn't load</h3>
          <p>Network hiccup or the piece moved. Try again — the good stuff is worth it.</p>
          <div className="nf-actions">
            <button className="btn-primary" onClick={() => window.location.reload()}>Retry →</button>
            <Link to="/collections" className="back-link">or browse everything</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="cart-page">
        <PageLoader label="Opening the look" />
      </div>
    );
  }

  const wished = isWished(product._id);
  const images = product.images?.length ? product.images : ["/img1.jpeg"];
  const prev = () => setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="pd-page">
      <div className="pd-crumb">
        <button onClick={() => navigate(-1)}>← Back</button>
        <span>/</span>
        {["men", "women", "couple"].includes((product.category || "").toLowerCase()) ? (
          <Link to={`/collections?category=${product.category.toLowerCase()}`}>{product.category}</Link>
        ) : (
          <Link to="/collections">{product.category || "Collection"}</Link>
        )}
      </div>

      <div className="pd-grid">
        <div className="pd-gallery">
          <div className="pd-main">
            <img src={getImageUrl(images[imgIdx])} alt={product.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
            {images.length > 1 && (
              <>
                <button className="pd-arrow left" onClick={prev} aria-label="Previous">‹</button>
                <button className="pd-arrow right" onClick={next} aria-label="Next">›</button>
                <span className="pd-count">{imgIdx + 1} / {images.length}</span>
              </>
            )}
            <button className={`pd-wish ${wished ? "saved" : ""}`} onClick={() => toggleWishlist(product)}>
              {wished ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((im, i) => (
                <button key={i} className={i === imgIdx ? "on" : ""} onClick={() => setImgIdx(i)}>
                  <img src={getImageUrl(im)} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <span className="qv-cat">{product.category || "Chatakh Edit"}</span>
          <h1>{product.name}</h1>
          <p className="pd-price">₹{product.price}</p>
          <p className="pd-ship">{product.shippingCharge > 0 ? `+ ₹${product.shippingCharge} shipping` : "✦ Free shipping"}</p>

          <label className="pd-label">Select Size</label>
          <div className="pd-sizes">
            {SIZES.map((s) => (
              <button key={s} className={size === s ? "on" : ""} onClick={() => setSize(s)}>{s}</button>
            ))}
            <button className="pd-guide-link" onClick={() => setShowGuide((g) => !g)}>
              📏 {showGuide ? "Hide guide" : "Size guide"}
            </button>
          </div>

          {showGuide && (
            <div className="pd-guide">
              <table>
                <thead><tr><th>Size</th><th>Bust (in)</th><th>Waist (in)</th><th>Hip (in)</th></tr></thead>
                <tbody>
                  {[["S", "32–33", "26–27", "35–36"], ["M", "34–35", "28–29", "37–38"], ["L", "36–37", "30–31", "39–40"], ["XL", "38–40", "32–34", "41–43"], ["XXL", "41–43", "35–37", "44–46"]].map((r) => (
                    <tr key={r[0]} className={size === r[0] ? "on" : ""}>
                      <td><b>{r[0]}</b></td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Indicative chart — between sizes? Size up for festive comfort.</p>
            </div>
          )}

          <label className="pd-label">Quantity</label>
          <div className="pd-qty">
            <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <b>{qty}</b>
            <button onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
          </div>

          <div className="pd-actions">
            <button
              className={`qv-primary ${added ? "done" : ""}`}
              onClick={() => { addToCart({ ...product, size, qty }); setAdded(true); setTimeout(() => navigate("/cart"), 900); }}
            >
              {added ? "✓ Added to Bag" : "Add to Bag →"}
            </button>
            <button className={`qv-save ${wished ? "saved" : ""}`} onClick={() => toggleWishlist(product)}>
              {wished ? "♥" : "♡"}
            </button>
          </div>

          <div className="pd-pin">
            <label className="pd-label">Delivery pincode</label>
            <form
              className="pin-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (!/^\d{6}$/.test(pin.trim())) { setPinEta({ error: "Enter a valid 6-digit pincode" }); return; }
                const fmt = (t) => new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                setPinEta({ ok: `Reaches ${pin.trim()} by ${fmt(Date.now() + 4 * 864e5)} – ${fmt(Date.now() + 6 * 864e5)} (indicative)` });
              }}
            >
              <input
                value={pin}
                onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setPinEta(null); }}
                placeholder="e.g. 110001"
                inputMode="numeric"
                aria-label="Delivery pincode"
              />
              <button type="submit">Check</button>
            </form>
            {pinEta?.ok && <p className="pin-ok">🚚 {pinEta.ok}</p>}
            {pinEta?.error && <p className="pin-err">{pinEta.error}</p>}
          </div>

          <div className="pd-desc">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
