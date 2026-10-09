import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { getProductImage } from "../utils/image";
import { useTilt } from "../hooks/useReveal";

const ProductCard = ({ product, onQuickView }) => {
  const navigate = useNavigate();
  const { toggleWishlist, isWished } = useWishlist();
  const tiltRef = useTilt(7);
  if (!product) return null;

  const wished = isWished(product._id);
  const img = getProductImage(product);
  const open = () => navigate(`/product/${product._id}`);

  return (
    <article
      ref={tiltRef}
      className="pin-card"
      role="button"
      tabIndex={0}
      aria-label={`View ${product.name}`}
      onClick={open}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } }}
    >
      <div className="pin-media">
        <img src={img} alt={product.name} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
        <span className="pin-shine" />
        <div className="pin-top">
          <span className="pin-chip">{product.category || "New Drop"}</span>
          <button
            className={`pin-save ${wished ? "saved" : ""}`}
            aria-label="Save to wishlist"
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
          >
            {wished ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
        <div className="pin-hover">
          <button
            className="pin-btn ghost"
            onClick={(e) => { e.stopPropagation(); onQuickView ? onQuickView(product) : navigate(`/product/${product._id}`); }}
          >
            👁 Quick view
          </button>
          <button className="pin-btn solid" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}>
            Shop →
          </button>
        </div>
        {product.price != null && (
          <span className="pin-price">₹{product.price}</span>
        )}
      </div>
      <div className="pin-body">
        <h3>{product.name}</h3>
        {product.description && <p>{product.description}</p>}
      </div>
    </article>
  );
};

export default ProductCard;
