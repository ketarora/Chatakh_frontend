import { useNavigate } from "react-router-dom";
import { getProductImage } from "../utils/images";
import "./ProductCard.css";

const ProductCard = ({ product, index = 0 }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const imageUrl = getProductImage(product);
  // Pinterest-style varied heights: cycle through aspect ratios
  const ratios = ["ratio-a", "ratio-b", "ratio-a", "ratio-c", "ratio-b", "ratio-c"];
  const ratioClass = ratios[index % ratios.length];

  return (
    <div
      className={`product-card-component group ${ratioClass}`}
      onClick={() => navigate(`/product/${product._id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product._id}`)}
      role="button"
      tabIndex={0}
    >
      <div className="pc-image-wrap">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        <span className="pc-badge">New Drop</span>
      </div>

      <div className="pc-body">
        <h3>{product.name}</h3>
        {product.description && (
          <p className="pc-desc">{product.description}</p>
        )}
        <div className="pc-footer">
          <span className="pc-price">₹{product.price}</span>
          <span className="pc-status">Available</span>
        </div>
        <button
          type="button"
          className="pc-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
