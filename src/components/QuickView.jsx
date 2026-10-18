import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { getImageUrl } from "../utils/image";

const SIZES = ["S", "M", "L", "XL", "XXL"];

// Pinterest-style quick view modal: big image, save, shop.
const QuickView = ({ product, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWished } = useWishlist();
  const cardRef = useRef(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState("M");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { onClose?.(); return; }
      // Lightweight focus trap: keep Tab inside the dialog.
      if (e.key === "Tab" && cardRef.current) {
        const focusables = cardRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    cardRef.current?.querySelector("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!product) return null;
  const wished = isWished(product._id);
  const images = product.images?.length ? product.images : ["/img1.jpeg"];

  return (
    <div className="qv-backdrop" onClick={onClose}>
      <div
        ref={cardRef}
        className="qv-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <button className="qv-close" onClick={onClose} aria-label="Close">✕</button>
        <div className="qv-media">
          <img
            key={images[Math.min(imgIdx, images.length - 1)]}
            src={getImageUrl(images[Math.min(imgIdx, images.length - 1)])}
            alt={product.name}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }}
          />
          {images.length > 1 && (
            <div className="qv-thumbs" role="tablist" aria-label="Product images">
              {images.slice(0, 4).map((im, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === imgIdx}
                  aria-label={`Image ${i + 1}`}
                  className={i === imgIdx ? "on" : ""}
                  onClick={() => setImgIdx(i)}
                >
                  <img src={getImageUrl(im)} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="qv-info">
          <span className="qv-cat">{product.category || "Chatakh Edit"}</span>
          <h2>{product.name}</h2>
          {product.demo || product.price == null ? (
            <>
              <p className="qv-price">Dropping soon ✦</p>
              <p className="qv-desc">{product.description}</p>
              <div className="qv-actions">
                <a
                  className="qv-primary qv-anchor"
                  href="https://www.instagram.com/chatakh_"
                  target="_blank"
                  rel="noreferrer"
                >
                  Pre-book on DM ◍
                </a>
              </div>
              <p className="qv-note">Price reveals at launch. DM a screenshot to reserve yours.</p>
            </>
          ) : (
          <>
          <p className="qv-price">₹{product.price}</p>
          <p className="qv-desc">{product.description}</p>
          <div className="qv-sizes" role="group" aria-label="Select size">
            {SIZES.map((s) => (
              <button key={s} className={size === s ? "on" : ""} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
          <div className="qv-actions">
            <button className="qv-primary" onClick={() => { addToCart({ ...product, size, qty: 1 }); onClose?.(); navigate("/cart"); }}>
              Add to bag →
            </button>
            <button className={`qv-save ${wished ? "saved" : ""}`} onClick={() => toggleWishlist(product)}>
              {wished ? "♥ Saved" : "♡ Save"}
            </button>
          </div>
          <button className="qv-full" onClick={() => { onClose?.(); navigate(`/product/${product._id}`); }}>
            View full details
          </button>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickView;
