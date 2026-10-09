import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import CheckoutButton from "../components/CheckoutButton";
import { getImageUrl } from "../utils/image";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const shipping = cart.reduce((s, i) => s + (i.shippingCharge || 0), 0);

  if (!cart.length) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">🛍</p>
          <h3>Your bag is empty</h3>
          <p>Beautiful things are waiting. Go find your standout piece.</p>
          <Link to="/collections" className="btn-primary">Continue Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="coll-hero light-hero">
        <p className="eyebrow">🛍 Your bag</p>
        <h1>Shopping Bag ({cart.length})</h1>
        <p>Almost yours. Checkout is secure & super fast.</p>
      </div>
      <div className="cart-grid">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id + (item.size || "")} className="cart-row">
              <img src={getImageUrl(item.images?.[0])} alt={item.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/img1.jpeg"; }} />
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>{item.size ? `Size ${item.size} · ` : ""}Qty {item.qty || 1}</p>
                <b>₹{item.price * (item.qty || 1)}</b>
              </div>
              <button onClick={() => removeFromCart(item._id, item.size)} className="cart-remove">Remove</button>
            </div>
          ))}
        </div>
        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div className="sum-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{shipping > 0 ? `₹${shipping}` : "Free ✦"}</span></div>
          <div className="sum-total"><span>Total</span><span>₹{subtotal + shipping}</span></div>
          <div className="ship-progress">
            {subtotal >= 999 ? (
              <p>✦ FREE shipping unlocked!</p>
            ) : (
              <p>₹{999 - subtotal} away from <b>FREE shipping</b></p>
            )}
            <div className="ship-bar"><i style={{ width: `${Math.min(100, Math.round((subtotal / 999) * 100))}%` }} /></div>
          </div>
          <CheckoutButton />
          <Link to="/collections" className="back-link">← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
