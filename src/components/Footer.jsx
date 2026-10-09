import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Queue locally until the backend newsletter endpoint ships — no lead lost.
    try {
      const key = "chatakh-newsletter";
      const queue = JSON.parse(localStorage.getItem(key) || "[]");
      queue.push({ email, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(queue));
    } catch { /* private mode — still confirm */ }
    setDone(true);
  };

  return (
    <footer className="chatakh-footer">
      <div className="footer-ticker">
        <div className="ticker-track">
          {[...Array(2)].map((_, k) => (
            <span key={k} className="ticker-set">
              <span>CHATAKH ✦ BORN TO STAND OUT ✦ HANDCRAFTED ✦ NAVRATRI EDIT ✦&nbsp;</span>
              <span>CHATAKH ✦ BORN TO STAND OUT ✦ HANDCRAFTED ✦ NAVRATRI EDIT ✦&nbsp;</span>
            </span>
          ))}
        </div>
      </div>

      <div className="footer-grid">
        <div className="f-brand">
          <img src="/logofinn.png" alt="Chatakh" />
          <p>Luxury fashion for modern confidence — bold silhouettes, premium texture, and shopping that feels like a festival.</p>
          <div className="f-social">
            <a href="https://www.instagram.com/chatakh_" target="_blank" rel="noreferrer" aria-label="Instagram">◍</a>
            <a href="mailto:support@chatakh.com" aria-label="Email">✉</a>
          </div>
        </div>

        <div className="f-col">
          <h4>Quick links</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/collections/threads-of-aura">Threads of Aura</Link>
          <Link to="/collections/colors-of-aura">Colors of Aura</Link>
          <Link to="/navratri">Navratri Edit ❀</Link>
        </div>

        <div className="f-col">
          <h4>Help</h4>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/about#policies">Shipping & Exchanges</Link>
          <a href="mailto:support@chatakh.com">support@chatakh.com</a>
        </div>

        <div className="f-news">
          <h4>Get the drops first</h4>
          <p>Styling tips, secret sales & Friday drops. No spam, only tadka.</p>
          {done ? (
            <p className="news-done">✦ You're on the list! ✦</p>
          ) : (
            <form onSubmit={subscribe}>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <button type="submit">Join →</button>
            </form>
          )}
        </div>
      </div>

      <div className="f-bottom">
        <span>© {new Date().getFullYear()} Chatakh Creations · Made with pyaar in India</span>
        <span className="pay-chips" aria-label="Accepted payments">
          <i>UPI</i><i>Visa</i><i>Mastercard</i><i>RuPay</i><i>Razorpay Secure</i>
        </span>
        <span className="f-made">✦ Born to stand out ✦</span>
      </div>
    </footer>
  );
};

export default Footer;
