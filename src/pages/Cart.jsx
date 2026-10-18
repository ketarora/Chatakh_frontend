import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import CheckoutButton from "../components/CheckoutButton";
import { getImageUrl } from "../utils/image";
import { FREE_SHIPPING_THRESHOLD, getCartShipping, getCartSubtotal } from "../utils/shipping";

// Real pincode lookup (India Post, free, no key): type 6 digits →
// pick your post office from the menu, see district + state + ETA.
const PincodeChecker = () => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [office, setOffice] = useState("");
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);

  const check = async (e) => {
    e?.preventDefault();
    const v = pin.trim();
    if (!/^\d{6}$/.test(v)) {
      setError("6-digit pincode dalo");
      setOffices([]);
      setChecked(true);
      return;
    }
    setLoading(true);
    setError(null);
    setChecked(true);
    try {
      const r = await fetch(`https://api.postalpincode.in/pincode/${v}`);
      const j = await r.json();
      const list = j?.[0]?.PostOffice || [];
      if (j?.[0]?.Status === "Success" && list.length) {
        setOffices(list);
        const firstDeliverable = list.find((o) => o.DeliveryStatus === "Delivery") || list[0];
        setOffice(firstDeliverable.Name);
      } else {
        setOffices([]);
        setError("Is pincode par delivery nahi milti — pincode check karo");
      }
    } catch {
      setOffices([]);
      setError("Network hiccup — dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ship-progress">
      <p>📍 <b>Delivery check</b> — pincode dalo, sahi location chuno</p>
      <form className="pin-row" onSubmit={check}>
        <input
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setChecked(false); setOffices([]); setError(null); }}
          placeholder="e.g. 110001"
          inputMode="numeric"
          aria-label="Delivery pincode"
        />
        <button type="submit">{loading ? "…" : "Check"}</button>
      </form>
      {error && <p className="pin-err">{error}</p>}
      {offices.length > 0 && (() => {
        const sel = offices.find((o) => o.Name === office) || offices[0];
        const delivers = sel.DeliveryStatus === "Delivery";
        return (
          <div className="pin-result">
            <select value={office} onChange={(e) => setOffice(e.target.value)} aria-label="Post office">
              {offices.map((o) => (
                <option key={o.Name + o.BranchType} value={o.Name}>
                  {o.Name} ({o.BranchType}){o.DeliveryStatus === "Delivery" ? " ✓" : " — no delivery"}
                </option>
              ))}
            </select>
            <p>
              📍 {sel.Name}, {sel.District}, {sel.State} — {delivers ? "yahan delivery hoti hai ✦" : "yahan delivery NAHI hoti — ✓ wala area chuno"}
              {delivers && (<><br />Pahunchne me ~3–5 din (indicative)</>)}
            </p>
          </div>
        );
      })()}
    </div>
  );
};

const Cart = () => {
  const { cart, removeFromCart, updateQty } = useCart();
  const subtotal = getCartSubtotal(cart);
  const shipping = getCartShipping(cart);

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
                <p>{item.size ? `Size ${item.size} · ` : ""}</p>
                <div className="qty-step">
                  <button onClick={() => updateQty(item._id, item.size, -1)} aria-label="Decrease quantity">−</button>
                  <b>{item.qty || 1}</b>
                  <button onClick={() => updateQty(item._id, item.size, 1)} aria-label="Increase quantity">+</button>
                </div>
                <b className="cart-line-total">₹{item.price * (item.qty || 1)}</b>
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
          <PincodeChecker />
          <div className="ship-progress">
            {subtotal >= FREE_SHIPPING_THRESHOLD ? (
              <p>✦ FREE shipping unlocked!</p>
            ) : (
              <p>₹{FREE_SHIPPING_THRESHOLD - subtotal} away from <b>FREE shipping</b></p>
            )}
            <div className="ship-bar"><i style={{ width: `${Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%` }} /></div>
          </div>
          <CheckoutButton />
          <Link to="/collections" className="back-link">← Continue Shopping</Link>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
