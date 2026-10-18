import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import * as Clerk from "@clerk/clerk-react";
import { PageLoader } from "../components/Loader";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

const useSafeClerk = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const auth = Clerk.useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const userState = Clerk.useUser();
    return { ...auth, ...userState, clerkLive: true };
  } catch {
    return { getToken: async () => null, user: null, isLoaded: true, isSignedIn: false, clerkLive: false };
  }
};

const statusCls = (s) =>
  s === "Cancelled" ? "st-cancel" : s === "Delivered" ? "st-green" : s === "Shipped" ? "st-blue" : "st-warn";

const MyOrders = () => {
  const { getToken, user, isLoaded, isSignedIn, clerkLive } = useSafeClerk();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnForm, setReturnForm] = useState({ reason: "", description: "" });

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const res = await api.get("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = await getToken();
      await api.put(`/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message));
    }
  };

  const handleReturnClick = (orderId) => {
    setSelectedOrderId(orderId);
    setReturnForm({ reason: "", description: "" });
    setShowReturnModal(true);
  };

  const handleReturnSubmit = async () => {
    if (!returnForm.reason || !returnForm.description) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const token = await getToken();
      await api.put(`/api/orders/${selectedOrderId}/return-request`, {
        reason: returnForm.reason,
        description: returnForm.description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Return request submitted successfully");
      setShowReturnModal(false);
      fetchOrders();
    } catch (err) {
      alert("Failed to submit return request: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (!isSignedIn) { setLoading(false); return; }
    const initialFetch = async () => {
      await fetchOrders();
      setLoading(false);
    };
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user, getToken]);

  if (!hasClerk || !clerkLive) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">📦</p>
          <h3>Orders live behind login</h3>
          <p>Sign-in is unavailable in this preview. Add your Clerk key to track orders.</p>
          <Link to="/" className="btn-primary">Back home →</Link>
        </div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="cart-page"><PageLoader label="Fetching your orders" /></div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="cart-page">
        <div className="empty-box">
          <p className="empty-face">📦</p>
          <h3>Please login to view your orders</h3>
          <p>Your parcels are waiting on the other side of sign-in.</p>
          <Link to="/login" className="btn-primary">Login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="coll-hero light-hero">
        <p className="eyebrow">📦 Your parcels</p>
        <h1>My Orders</h1>
        <p>Track, cancel & return — no phone calls needed.</p>
      </div>

      <div className="orders-wrap">
        {orders.length === 0 ? (
          <div className="empty-box">
            <p className="empty-face">(◕‿◕)</p>
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will land here.</p>
            <Link to="/collections" className="btn-primary">Shop now →</Link>
          </div>
        ) : (
          orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-top">
                <div>
                  <p className="order-label">Order ID</p>
                  <p className="order-id">{order._id}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="order-top-right">
                  <span className={`status-pill ${statusCls(order.orderStatus)}`}>{order.orderStatus}</span>
                  <p className="order-total">₹{order.totalAmount}</p>
                </div>
              </div>

              {order.returnRequest && order.returnRequest.status !== "None" && (
                <div className="return-box">
                  <p><b>Return:</b> {order.returnRequest.status} · {order.returnRequest.reason}</p>
                  {order.returnRequest.refundAmount != null && (
                    <p>Refund: ₹{order.returnRequest.refundAmount}{order.returnRequest.refundStatus ? ` (${order.returnRequest.refundStatus})` : ""}</p>
                  )}
                </div>
              )}

              <div className="order-items">
                {order.items?.map((item, i) => (
                  <div key={i} className="order-item">
                    <span>{item.name} <small>· {item.size} × {item.quantity}</small></span>
                    <b>₹{item.price}</b>
                  </div>
                ))}
              </div>

              {(order.subtotal || order.shippingCost) != null && (order.subtotal > 0 || order.shippingCost > 0) && (
                <div className="order-sums">
                  {order.subtotal > 0 && <div className="sum-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>}
                  <div className="sum-row"><span>Shipping</span><span>{order.shippingCost > 0 ? `₹${order.shippingCost}` : "Free ✦"}</span></div>
                  {order.paymentInfo?.razorpay_payment_id && (
                    <p className="pay-id">UPI/Card · {order.paymentInfo.razorpay_payment_id} · {order.paymentInfo.paymentMethod || "Online"}</p>
                  )}
                </div>
              )}

              <div className="order-actions">
                {order.orderStatus !== "Cancelled" && (
                  <button onClick={() => handleCancelOrder(order._id)} className="cart-remove">Cancel Order</button>
                )}
                {order.orderStatus !== "Cancelled" && (!order.returnRequest || order.returnRequest.status === "None") && (
                  <button onClick={() => handleReturnClick(order._id)} className="return-btn">Request Return</button>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {showReturnModal && (
        <div className="qv-backdrop" onClick={() => setShowReturnModal(false)}>
          <div className="return-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request Return</h2>
            <label>Return Reason *</label>
            <select
              value={returnForm.reason}
              onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
            >
              <option value="">Select a reason</option>
              <option value="Defective Product">Defective Product</option>
              <option value="Wrong Item Received">Wrong Item Received</option>
              <option value="Not as Described">Not as Described</option>
              <option value="Size/Fit Issue">Size/Fit Issue</option>
              <option value="Changed Mind">Changed Mind</option>
              <option value="Quality Issue">Quality Issue</option>
              <option value="Other">Other</option>
            </select>
            <label>Detailed Description *</label>
            <textarea
              value={returnForm.description}
              onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
              placeholder="Tell us what went wrong — size, defect, anything…"
            />
            <p className="return-note"><b>Note:</b> Our team reviews returns in 2–3 business days.</p>
            <div className="qv-actions">
              <button className="qv-save" onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button className="qv-primary" onClick={handleReturnSubmit}>Submit Return</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
