import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import QuickView from "../components/QuickView";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quickView, setQuickView] = useState(null);
  const [moved, setMoved] = useState(null);

  const moveToBag = (p) => {
    addToCart({ ...p, qty: 1 });
    toggleWishlist(p);
    setMoved(p._id);
    setTimeout(() => navigate("/cart"), 700);
  };

  if (!wishlist.length) {
    return (
      <div className="wishlist-page">
        <div className="empty-box">
          <p className="empty-face">♡</p>
          <h3>Your wishlist is daydreaming…</h3>
          <p>Tap ♡ Save on anything you love and it'll wait for you here.</p>
          <Link to="/collections" className="btn-primary">Find something to love →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="coll-hero">
        <p className="eyebrow light">♡ Saved with love</p>
        <h1>Wishlist ({wishlist.length})</h1>
        <p>Your personal moodboard. Don't let them sell out.</p>
      </div>
      <div className="masonry pad">
        {wishlist.map((p, i) => (
          <div key={p._id + i} className="masonry-item" style={{ "--d": `${(i % 8) * 60}ms` }}>
            <ProductCard product={p} onQuickView={setQuickView} />
            <button
              className={`move-bag ${moved === p._id ? "done" : ""}`}
              onClick={() => moveToBag(p)}
            >
              {moved === p._id ? "✓ Added — opening bag…" : "Move to Bag →"}
            </button>
          </div>
        ))}
      </div>
      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} />}
    </div>
  );
};

export default Wishlist;
